-- Panel administrador, control de cupo y modalidad "solo misa".
-- Ejecutar DESPUES de 202608100001_wedding_invitations.sql.

create table if not exists public.wedding_settings (
  id smallint primary key default 1 check (id = 1),
  reception_capacity smallint not null check (reception_capacity between 0 and 2000),
  updated_at timestamptz not null default now()
);

alter table public.wedding_guests
  add column if not exists invitation_type text not null default 'reception';

alter table public.wedding_guests
  drop constraint if exists wedding_guests_invitation_type_check;
alter table public.wedding_guests
  add constraint wedding_guests_invitation_type_check
  check (invitation_type in ('reception', 'ceremony_only'));

alter table public.wedding_guests
  drop constraint if exists wedding_guests_allowed_passes_check;
alter table public.wedding_guests
  add constraint wedding_guests_allowed_passes_check
  check (allowed_passes between 0 and 20);

update public.wedding_guests
set allowed_passes = 0,
    confirmed_passes = 0
where invitation_type = 'ceremony_only';

insert into public.wedding_settings (id, reception_capacity)
select 1, coalesce(sum(allowed_passes) filter (where is_active and invitation_type = 'reception'), 0)::smallint
from public.wedding_guests
on conflict (id) do nothing;

create table if not exists public.wedding_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text not null check (char_length(trim(display_name)) between 2 and 80),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop function if exists public.confirm_wedding_invitation(uuid, boolean, smallint, text);
create function public.confirm_wedding_invitation(
  p_public_token uuid,
  p_attending boolean,
  p_confirmed_passes smallint,
  p_note text default null
)
returns table (
  full_name text,
  phone_e164 text,
  allowed_passes smallint,
  confirmed_passes smallint,
  confirmation_status text,
  invitation_type text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_guest public.wedding_guests%rowtype;
  next_status text;
  next_passes smallint;
begin
  select * into current_guest
  from public.wedding_guests
  where public_token = p_public_token and is_active
  for update;

  if not found then
    raise exception 'INVITATION_NOT_FOUND';
  end if;

  next_status := case when p_attending then 'confirmed' else 'declined' end;

  if current_guest.invitation_type = 'ceremony_only' then
    next_passes := 0;
  else
    next_passes := case when p_attending then p_confirmed_passes else 0 end;
    if next_passes < 0
       or next_passes > current_guest.allowed_passes
       or (p_attending and next_passes < 1) then
      raise exception 'PASS_LIMIT';
    end if;
  end if;

  update public.wedding_guests as guest
  set confirmation_status = next_status,
      confirmed_passes = next_passes,
      guest_note = nullif(trim(p_note), ''),
      confirmed_at = now(),
      updated_at = now()
  where guest.id = current_guest.id;

  insert into public.wedding_confirmation_events
    (guest_id, previous_status, new_status, confirmed_passes)
  values
    (current_guest.id, current_guest.confirmation_status, next_status, next_passes);

  return query
  select guest.full_name,
         guest.phone_e164,
         guest.allowed_passes,
         guest.confirmed_passes,
         guest.confirmation_status,
         guest.invitation_type
  from public.wedding_guests as guest
  where guest.id = current_guest.id;
end;
$$;

create or replace function public.admin_save_wedding_guest(
  p_guest_id uuid,
  p_full_name text,
  p_phone text,
  p_invitation_type text,
  p_allowed_passes smallint,
  p_is_active boolean default true
)
returns setof public.wedding_guests
language plpgsql
security definer
set search_path = public
as $$
declare
  current_guest public.wedding_guests%rowtype;
  capacity_limit integer;
  allocated_elsewhere integer;
  requested_passes integer;
  saved_id uuid;
begin
  perform pg_advisory_xact_lock(hashtext('wedding_reception_capacity'));

  if p_invitation_type not in ('reception', 'ceremony_only') then
    raise exception 'INVITATION_TYPE';
  end if;

  if p_invitation_type = 'ceremony_only' then
    requested_passes := 0;
  else
    requested_passes := p_allowed_passes;
    if requested_passes < 1 or requested_passes > 20 then
      raise exception 'PASS_LIMIT';
    end if;
  end if;

  if p_guest_id is not null then
    select * into current_guest
    from public.wedding_guests
    where id = p_guest_id
    for update;

    if not found then
      raise exception 'INVITATION_NOT_FOUND';
    end if;

    if p_invitation_type = 'ceremony_only' and current_guest.confirmed_passes > 0 then
      raise exception 'CONFIRMED_PASSES_CONFLICT';
    end if;

    if p_invitation_type = 'reception' and requested_passes < current_guest.confirmed_passes then
      raise exception 'CONFIRMED_PASSES_CONFLICT';
    end if;
  end if;

  select reception_capacity into capacity_limit
  from public.wedding_settings
  where id = 1
  for update;

  if not found then
    raise exception 'CAPACITY_NOT_CONFIGURED';
  end if;

  select coalesce(sum(allowed_passes), 0)::integer into allocated_elsewhere
  from public.wedding_guests
  where is_active
    and invitation_type = 'reception'
    and (p_guest_id is null or id <> p_guest_id);

  if p_is_active and p_invitation_type = 'reception'
     and allocated_elsewhere + requested_passes > capacity_limit then
    raise exception 'RECEPTION_CAPACITY';
  end if;

  if p_guest_id is null then
    insert into public.wedding_guests
      (full_name, phone_e164, invitation_type, allowed_passes, is_active)
    values
      (p_full_name, p_phone, p_invitation_type, requested_passes, p_is_active)
    returning id into saved_id;
  else
    update public.wedding_guests
    set full_name = p_full_name,
        phone_e164 = p_phone,
        invitation_type = p_invitation_type,
        allowed_passes = requested_passes,
        confirmation_status = case
          when invitation_type <> p_invitation_type then 'pending'
          else confirmation_status
        end,
        confirmed_passes = case
          when invitation_type <> p_invitation_type then 0
          else confirmed_passes
        end,
        confirmed_at = case
          when invitation_type <> p_invitation_type then null
          else confirmed_at
        end,
        is_active = p_is_active,
        updated_at = now()
    where id = p_guest_id
    returning id into saved_id;
  end if;

  return query
  select * from public.wedding_guests where id = saved_id;
end;
$$;

create or replace function public.admin_release_unused_wedding_passes(p_guest_id uuid)
returns setof public.wedding_guests
language plpgsql
security definer
set search_path = public
as $$
declare
  current_guest public.wedding_guests%rowtype;
begin
  select * into current_guest
  from public.wedding_guests
  where id = p_guest_id
  for update;

  if not found then
    raise exception 'INVITATION_NOT_FOUND';
  end if;

  if current_guest.invitation_type <> 'reception'
     or current_guest.confirmation_status = 'pending' then
    raise exception 'PASSES_NOT_RELEASABLE';
  end if;

  update public.wedding_guests
  set allowed_passes = confirmed_passes,
      updated_at = now()
  where id = p_guest_id;

  return query
  select * from public.wedding_guests where id = p_guest_id;
end;
$$;

create or replace function public.admin_set_wedding_capacity(p_capacity smallint)
returns public.wedding_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  allocated integer;
  result public.wedding_settings%rowtype;
begin
  perform pg_advisory_xact_lock(hashtext('wedding_reception_capacity'));

  if p_capacity < 0 or p_capacity > 2000 then
    raise exception 'CAPACITY_LIMIT';
  end if;

  select coalesce(sum(allowed_passes), 0)::integer into allocated
  from public.wedding_guests
  where is_active and invitation_type = 'reception';

  if p_capacity < allocated then
    raise exception 'CAPACITY_BELOW_ALLOCATED';
  end if;

  insert into public.wedding_settings (id, reception_capacity, updated_at)
  values (1, p_capacity, now())
  on conflict (id) do update
  set reception_capacity = excluded.reception_capacity,
      updated_at = excluded.updated_at
  returning * into result;

  return result;
end;
$$;

alter table public.wedding_settings enable row level security;
alter table public.wedding_admins enable row level security;

revoke all on public.wedding_settings from anon, authenticated;
revoke all on public.wedding_admins from anon, authenticated;
revoke all on function public.confirm_wedding_invitation(uuid, boolean, smallint, text) from public, anon, authenticated;
revoke all on function public.admin_save_wedding_guest(uuid, text, text, text, smallint, boolean) from public, anon, authenticated;
revoke all on function public.admin_release_unused_wedding_passes(uuid) from public, anon, authenticated;
revoke all on function public.admin_set_wedding_capacity(smallint) from public, anon, authenticated;

grant execute on function public.confirm_wedding_invitation(uuid, boolean, smallint, text) to service_role;
grant execute on function public.admin_save_wedding_guest(uuid, text, text, text, smallint, boolean) to service_role;
grant execute on function public.admin_release_unused_wedding_passes(uuid) to service_role;
grant execute on function public.admin_set_wedding_capacity(smallint) to service_role;
grant all on public.wedding_settings to service_role;
grant all on public.wedding_admins to service_role;

comment on table public.wedding_settings is 'Cupo total de recepción; se usa para impedir sobreasignación de pases.';
comment on table public.wedding_admins is 'Usuarios de Supabase Auth autorizados para abrir el panel de la boda.';
comment on column public.wedding_guests.invitation_type is 'reception consume pases; ceremony_only confirma misa sin consumir cupo.';
