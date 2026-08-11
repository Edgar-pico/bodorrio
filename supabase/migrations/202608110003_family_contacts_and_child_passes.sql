-- Invitaciones familiares, pases de adultos/niños y folio público.
-- Ejecutar DESPUES de 202608100002_admin_and_ceremony.sql.

create sequence if not exists public.wedding_invitation_code_seq start 1;

alter table public.wedding_guests
  add column if not exists invitation_code text,
  add column if not exists allowed_adults smallint not null default 0,
  add column if not exists allowed_children smallint not null default 0,
  add column if not exists confirmed_adults smallint not null default 0,
  add column if not exists confirmed_children smallint not null default 0;

update public.wedding_guests
set allowed_adults = allowed_passes,
    allowed_children = 0,
    confirmed_adults = confirmed_passes,
    confirmed_children = 0
where invitation_type = 'reception'
  and allowed_adults = 0
  and allowed_children = 0;

update public.wedding_guests
set allowed_adults = 0,
    allowed_children = 0,
    confirmed_adults = 0,
    confirmed_children = 0,
    allowed_passes = 0,
    confirmed_passes = 0
where invitation_type = 'ceremony_only';

alter table public.wedding_guests
  alter column invitation_code set default
    ('EB-' || lpad(nextval('public.wedding_invitation_code_seq')::text, 6, '0'));

update public.wedding_guests
set invitation_code = 'EB-' || lpad(nextval('public.wedding_invitation_code_seq')::text, 6, '0')
where invitation_code is null;

alter table public.wedding_guests
  alter column invitation_code set not null;

create unique index if not exists wedding_guests_invitation_code_unique
  on public.wedding_guests (upper(invitation_code));

alter table public.wedding_guests
  drop constraint if exists wedding_guests_allowed_categories_check;
alter table public.wedding_guests
  add constraint wedding_guests_allowed_categories_check
  check (
    allowed_adults between 0 and 20
    and allowed_children between 0 and 20
    and allowed_adults + allowed_children = allowed_passes
  );

alter table public.wedding_guests
  drop constraint if exists wedding_guests_confirmed_categories_check;
alter table public.wedding_guests
  add constraint wedding_guests_confirmed_categories_check
  check (
    confirmed_adults between 0 and allowed_adults
    and confirmed_children between 0 and allowed_children
    and confirmed_adults + confirmed_children = confirmed_passes
  );

create table if not exists public.wedding_invitation_contacts (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null references public.wedding_guests(id) on delete cascade,
  contact_name text not null check (char_length(trim(contact_name)) between 2 and 80),
  phone_e164 text not null,
  phone_normalized text not null default '',
  is_primary boolean not null default false,
  display_order smallint not null default 0 check (display_order between 0 and 20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (guest_id, phone_normalized)
);

create or replace function public.prepare_wedding_invitation_contact()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  digits text;
begin
  new.contact_name := trim(new.contact_name);
  digits := regexp_replace(new.phone_e164, '\D', '', 'g');

  if length(digits) = 12 and left(digits, 2) = '52' then
    digits := right(digits, 10);
  end if;

  if length(digits) <> 10 then
    raise exception 'PHONE_MUST_HAVE_10_DIGITS';
  end if;

  new.phone_normalized := digits;
  new.phone_e164 := '+52' || digits;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists wedding_invitation_contact_prepare on public.wedding_invitation_contacts;
create trigger wedding_invitation_contact_prepare
before insert or update of contact_name, phone_e164
on public.wedding_invitation_contacts
for each row execute function public.prepare_wedding_invitation_contact();

create unique index if not exists wedding_invitation_contacts_primary_unique
  on public.wedding_invitation_contacts (guest_id)
  where is_primary;
create index if not exists wedding_invitation_contacts_phone_lookup
  on public.wedding_invitation_contacts (phone_normalized);
create index if not exists wedding_invitation_contacts_guest_lookup
  on public.wedding_invitation_contacts (guest_id, display_order);

insert into public.wedding_invitation_contacts
  (guest_id, contact_name, phone_e164, is_primary, display_order)
select guest.id, guest.full_name, guest.phone_e164, true, 0
from public.wedding_guests as guest
where not exists (
  select 1
  from public.wedding_invitation_contacts as contact
  where contact.guest_id = guest.id
);

alter table public.wedding_confirmation_events
  add column if not exists confirmed_adults smallint not null default 0,
  add column if not exists confirmed_children smallint not null default 0;

update public.wedding_confirmation_events
set confirmed_adults = confirmed_passes,
    confirmed_children = 0
where confirmed_adults = 0 and confirmed_children = 0;

drop function if exists public.confirm_wedding_invitation(uuid, boolean, smallint, text);
create function public.confirm_wedding_invitation(
  p_public_token uuid,
  p_attending boolean,
  p_confirmed_adults smallint,
  p_confirmed_children smallint,
  p_note text default null
)
returns table (
  invitation_code text,
  full_name text,
  phone_e164 text,
  allowed_passes smallint,
  confirmed_passes smallint,
  allowed_adults smallint,
  allowed_children smallint,
  confirmed_adults smallint,
  confirmed_children smallint,
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
  next_adults smallint;
  next_children smallint;
begin
  select * into current_guest
  from public.wedding_guests
  where public_token = p_public_token and is_active
  for update;

  if not found then
    raise exception 'INVITATION_NOT_FOUND';
  end if;

  next_status := case when p_attending then 'confirmed' else 'declined' end;

  if current_guest.invitation_type = 'ceremony_only' or not p_attending then
    next_adults := 0;
    next_children := 0;
  else
    next_adults := p_confirmed_adults;
    next_children := p_confirmed_children;

    if next_adults < 0
       or next_children < 0
       or next_adults > current_guest.allowed_adults
       or next_children > current_guest.allowed_children
       or next_adults + next_children < 1 then
      raise exception 'PASS_LIMIT';
    end if;
  end if;

  update public.wedding_guests as guest
  set confirmation_status = next_status,
      confirmed_adults = next_adults,
      confirmed_children = next_children,
      confirmed_passes = next_adults + next_children,
      guest_note = nullif(trim(p_note), ''),
      confirmed_at = now(),
      updated_at = now()
  where guest.id = current_guest.id;

  insert into public.wedding_confirmation_events
    (guest_id, previous_status, new_status, confirmed_passes, confirmed_adults, confirmed_children)
  values
    (current_guest.id, current_guest.confirmation_status, next_status,
     next_adults + next_children, next_adults, next_children);

  return query
  select guest.invitation_code,
         guest.full_name,
         guest.phone_e164,
         guest.allowed_passes,
         guest.confirmed_passes,
         guest.allowed_adults,
         guest.allowed_children,
         guest.confirmed_adults,
         guest.confirmed_children,
         guest.confirmation_status,
         guest.invitation_type
  from public.wedding_guests as guest
  where guest.id = current_guest.id;
end;
$$;

drop function if exists public.admin_save_wedding_guest(uuid, text, text, text, smallint, boolean);
create function public.admin_save_wedding_guest(
  p_guest_id uuid,
  p_full_name text,
  p_contacts jsonb,
  p_invitation_type text,
  p_allowed_adults smallint,
  p_allowed_children smallint,
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
  requested_adults integer;
  requested_children integer;
  requested_passes integer;
  saved_id uuid;
  contact_record record;
  primary_phone text;
  digits text;
begin
  perform pg_advisory_xact_lock(hashtext('wedding_reception_capacity'));

  if p_invitation_type not in ('reception', 'ceremony_only') then
    raise exception 'INVITATION_TYPE';
  end if;

  if jsonb_typeof(p_contacts) <> 'array'
     or jsonb_array_length(p_contacts) < 1
     or jsonb_array_length(p_contacts) > 5 then
    raise exception 'CONTACT_LIMIT';
  end if;

  for contact_record in
    select trim(item.value->>'contact_name') as contact_name,
           item.value->>'phone' as phone,
           item.position
    from jsonb_array_elements(p_contacts) with ordinality as item(value, position)
  loop
    if char_length(contact_record.contact_name) < 2
       or char_length(contact_record.contact_name) > 80 then
      raise exception 'CONTACT_NAME';
    end if;

    digits := regexp_replace(coalesce(contact_record.phone, ''), '\D', '', 'g');
    if length(digits) = 12 and left(digits, 2) = '52' then
      digits := right(digits, 10);
    end if;
    if length(digits) <> 10 then
      raise exception 'PHONE_MUST_HAVE_10_DIGITS';
    end if;

    if contact_record.position = 1 then
      primary_phone := digits;
    end if;

    if p_is_active and exists (
      select 1
      from public.wedding_invitation_contacts as existing_contact
      join public.wedding_guests as existing_guest on existing_guest.id = existing_contact.guest_id
      where existing_contact.phone_normalized = digits
        and existing_guest.is_active
        and (p_guest_id is null or existing_guest.id <> p_guest_id)
    ) then
      raise exception 'PHONE_ALREADY_ASSIGNED';
    end if;
  end loop;

  if primary_phone is null then
    raise exception 'CONTACT_LIMIT';
  end if;

  if p_invitation_type = 'ceremony_only' then
    requested_adults := 0;
    requested_children := 0;
  else
    requested_adults := p_allowed_adults;
    requested_children := p_allowed_children;
    if requested_adults < 0
       or requested_children < 0
       or requested_adults + requested_children < 1
       or requested_adults + requested_children > 20 then
      raise exception 'PASS_LIMIT';
    end if;
  end if;
  requested_passes := requested_adults + requested_children;

  if p_guest_id is not null then
    select * into current_guest
    from public.wedding_guests
    where id = p_guest_id
    for update;

    if not found then
      raise exception 'INVITATION_NOT_FOUND';
    end if;

    if p_invitation_type = 'ceremony_only'
       and current_guest.confirmed_passes > 0 then
      raise exception 'CONFIRMED_PASSES_CONFLICT';
    end if;

    if p_invitation_type = 'reception'
       and (requested_adults < current_guest.confirmed_adults
            or requested_children < current_guest.confirmed_children) then
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
      (full_name, phone_e164, invitation_type, allowed_passes,
       allowed_adults, allowed_children, confirmed_adults, confirmed_children, is_active)
    values
      (p_full_name, primary_phone, p_invitation_type, requested_passes,
       requested_adults, requested_children, 0, 0, p_is_active)
    returning id into saved_id;
  else
    update public.wedding_guests
    set full_name = p_full_name,
        phone_e164 = primary_phone,
        invitation_type = p_invitation_type,
        allowed_passes = requested_passes,
        allowed_adults = requested_adults,
        allowed_children = requested_children,
        confirmation_status = case
          when invitation_type <> p_invitation_type then 'pending'
          else confirmation_status
        end,
        confirmed_passes = case
          when invitation_type <> p_invitation_type then 0
          else confirmed_passes
        end,
        confirmed_adults = case
          when invitation_type <> p_invitation_type then 0
          else confirmed_adults
        end,
        confirmed_children = case
          when invitation_type <> p_invitation_type then 0
          else confirmed_children
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

  delete from public.wedding_invitation_contacts where guest_id = saved_id;

  insert into public.wedding_invitation_contacts
    (guest_id, contact_name, phone_e164, is_primary, display_order)
  select saved_id,
         trim(item.value->>'contact_name'),
         item.value->>'phone',
         item.position = 1,
         (item.position - 1)::smallint
  from jsonb_array_elements(p_contacts) with ordinality as item(value, position);

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
  set allowed_adults = confirmed_adults,
      allowed_children = confirmed_children,
      allowed_passes = confirmed_adults + confirmed_children,
      updated_at = now()
  where id = p_guest_id;

  return query
  select * from public.wedding_guests where id = p_guest_id;
end;
$$;

alter table public.wedding_invitation_contacts enable row level security;

revoke all on public.wedding_invitation_contacts from anon, authenticated;
revoke all on function public.confirm_wedding_invitation(uuid, boolean, smallint, smallint, text) from public, anon, authenticated;
revoke all on function public.admin_save_wedding_guest(uuid, text, jsonb, text, smallint, smallint, boolean) from public, anon, authenticated;

grant execute on function public.confirm_wedding_invitation(uuid, boolean, smallint, smallint, text) to service_role;
grant execute on function public.admin_save_wedding_guest(uuid, text, jsonb, text, smallint, smallint, boolean) to service_role;
grant all on public.wedding_invitation_contacts to service_role;
grant usage, select on sequence public.wedding_invitation_code_seq to service_role;

comment on column public.wedding_guests.invitation_code is 'Folio legible y único usado para localizar la invitación, por ejemplo EB-000001.';
comment on table public.wedding_invitation_contacts is 'Personas que pueden recibir y abrir el mismo enlace de una invitación familiar.';
