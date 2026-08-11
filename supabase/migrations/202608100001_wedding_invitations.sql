-- RSVP de Edgar y Brenda
-- Ejecutar completo en Supabase > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.wedding_event_tables (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  capacity smallint not null check (capacity > 0),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wedding_guests (
  id uuid primary key default gen_random_uuid(),
  public_token uuid not null unique default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 5 and 120),
  normalized_name text not null default '',
  phone_e164 text not null,
  phone_normalized text not null default '',
  allowed_passes smallint not null default 1 check (allowed_passes between 1 and 20),
  confirmed_passes smallint not null default 0 check (confirmed_passes between 0 and 20),
  confirmation_status text not null default 'pending' check (confirmation_status in ('pending', 'confirmed', 'declined')),
  guest_note text check (char_length(guest_note) <= 280),
  table_id uuid references public.wedding_event_tables(id) on delete set null,
  is_active boolean not null default true,
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint confirmed_passes_within_limit check (confirmed_passes <= allowed_passes)
);

create table if not exists public.wedding_seats (
  id uuid primary key default gen_random_uuid(),
  table_id uuid not null references public.wedding_event_tables(id) on delete cascade,
  seat_number smallint not null check (seat_number > 0),
  label text,
  guest_id uuid unique references public.wedding_guests(id) on delete set null,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (table_id, seat_number)
);

create table if not exists public.wedding_confirmation_events (
  id bigint generated always as identity primary key,
  guest_id uuid not null references public.wedding_guests(id) on delete cascade,
  previous_status text,
  new_status text not null,
  confirmed_passes smallint not null,
  created_at timestamptz not null default now()
);

create or replace function public.normalize_wedding_name(value text)
returns text
language sql
immutable
strict
as $$
  select regexp_replace(
    translate(lower(trim(value)), 'áéíóúüñàèìòùäëïöü', 'aeiouunaeiouaeiou'),
    '\s+',
    ' ',
    'g'
  );
$$;

create or replace function public.prepare_wedding_guest()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  digits text;
begin
  new.full_name := trim(new.full_name);
  new.normalized_name := public.normalize_wedding_name(new.full_name);
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

drop trigger if exists wedding_guest_prepare on public.wedding_guests;
create trigger wedding_guest_prepare
before insert or update of full_name, phone_e164
on public.wedding_guests
for each row execute function public.prepare_wedding_guest();

create unique index if not exists wedding_guests_phone_unique
  on public.wedding_guests (phone_normalized)
  where is_active;
create index if not exists wedding_guests_name_lookup
  on public.wedding_guests (normalized_name)
  where is_active;
create index if not exists wedding_guests_table_lookup
  on public.wedding_guests (table_id);
create index if not exists wedding_seats_table_lookup
  on public.wedding_seats (table_id, display_order, seat_number);

create or replace function public.confirm_wedding_invitation(
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
  confirmation_status text
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
  next_passes := case when p_attending then p_confirmed_passes else 0 end;

  if next_passes < 0 or next_passes > current_guest.allowed_passes or (p_attending and next_passes < 1) then
    raise exception 'PASS_LIMIT';
  end if;

  update public.wedding_guests as guest
  set confirmation_status = next_status,
      confirmed_passes = next_passes,
      guest_note = nullif(trim(p_note), ''),
      confirmed_at = now(),
      updated_at = now()
  where guest.id = current_guest.id;

  insert into public.wedding_confirmation_events (guest_id, previous_status, new_status, confirmed_passes)
  values (current_guest.id, current_guest.confirmation_status, next_status, next_passes);

  return query
  select guest.full_name, guest.phone_e164, guest.allowed_passes, guest.confirmed_passes, guest.confirmation_status
  from public.wedding_guests as guest
  where guest.id = current_guest.id;
end;
$$;

alter table public.wedding_event_tables enable row level security;
alter table public.wedding_guests enable row level security;
alter table public.wedding_seats enable row level security;
alter table public.wedding_confirmation_events enable row level security;

revoke all on public.wedding_event_tables from anon, authenticated;
revoke all on public.wedding_guests from anon, authenticated;
revoke all on public.wedding_seats from anon, authenticated;
revoke all on public.wedding_confirmation_events from anon, authenticated;
revoke all on function public.confirm_wedding_invitation(uuid, boolean, smallint, text) from public, anon, authenticated;
grant execute on function public.confirm_wedding_invitation(uuid, boolean, smallint, text) to service_role;
grant all on public.wedding_event_tables to service_role;
grant all on public.wedding_guests to service_role;
grant all on public.wedding_seats to service_role;
grant all on public.wedding_confirmation_events to service_role;
grant usage, select on sequence public.wedding_confirmation_events_id_seq to service_role;

comment on table public.wedding_guests is 'Invitaciones privadas y número máximo de pases por familia o contacto.';
comment on table public.wedding_event_tables is 'Mesas del salón para la futura vista administrativa tipo Cinépolis.';
comment on table public.wedding_seats is 'Asientos visuales asignables únicamente desde el futuro panel administrador.';
