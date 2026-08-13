-- Invitaciones individuales y conjuntas.
-- Ejecutar DESPUES de 202608110003_family_contacts_and_child_passes.sql.

alter table public.wedding_guests
  add column if not exists invitation_mode text not null default 'group';

alter table public.wedding_guests
  drop constraint if exists wedding_guests_invitation_mode_check;
alter table public.wedding_guests
  add constraint wedding_guests_invitation_mode_check
  check (invitation_mode in ('individual', 'group'));

-- Clasifica los registros existentes por su cantidad actual de contactos.
-- Una invitacion conjunta que comparta un solo telefono puede corregirse desde Editar.
update public.wedding_guests as guest
set invitation_mode = case
  when (
    select count(*)
    from public.wedding_invitation_contacts as contact
    where contact.guest_id = guest.id
  ) = 1 then 'individual'
  else 'group'
end;

alter table public.wedding_guests
  drop constraint if exists wedding_guests_full_name_check;
alter table public.wedding_guests
  add constraint wedding_guests_full_name_check
  check (char_length(trim(full_name)) between 2 and 120);

-- Conserva toda la validacion transaccional de la funcion 003 y agrega la modalidad.
create or replace function public.admin_save_wedding_guest(
  p_guest_id uuid,
  p_full_name text,
  p_contacts jsonb,
  p_invitation_mode text,
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
  saved_guest public.wedding_guests%rowtype;
begin
  if p_invitation_mode not in ('individual', 'group') then
    raise exception 'INVITATION_MODE';
  end if;

  if p_invitation_mode = 'individual'
     and (jsonb_typeof(p_contacts) <> 'array' or jsonb_array_length(p_contacts) <> 1) then
    raise exception 'INDIVIDUAL_CONTACT_LIMIT';
  end if;

  select * into saved_guest
  from public.admin_save_wedding_guest(
    p_guest_id,
    p_full_name,
    p_contacts,
    p_invitation_type,
    p_allowed_adults,
    p_allowed_children,
    p_is_active
  );

  update public.wedding_guests
  set invitation_mode = p_invitation_mode,
      updated_at = now()
  where id = saved_guest.id
  returning * into saved_guest;

  return next saved_guest;
end;
$$;

revoke all on function public.admin_save_wedding_guest(uuid, text, jsonb, text, text, smallint, smallint, boolean)
  from public, anon, authenticated;
grant execute on function public.admin_save_wedding_guest(uuid, text, jsonb, text, text, smallint, smallint, boolean)
  to service_role;

comment on column public.wedding_guests.invitation_mode is
  'Define el lenguaje y envio: individual usa singular; group representa pareja, familia o grupo.';

notify pgrst, 'reload schema';
