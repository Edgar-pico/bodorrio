import type { APIRoute } from 'astro';
import { getAdminSession } from '../../../../lib/server/admin-auth';
import { hasSameOrigin, json } from '../../../../lib/server/http';
import { adminGuestSelect, contactsForRpc, parseInvitationContacts, serializeGuest } from '../../../../lib/server/invitations';
import { getWeddingDatabase } from '../../../../lib/server/supabase';

export const prerender = false;

async function dashboardPayload() {
  const database = getWeddingDatabase();
  const [{ data: guests, error: guestsError }, { data: settings, error: settingsError }] = await Promise.all([
    database
      .from('wedding_guests')
      .select(adminGuestSelect)
      .order('full_name'),
    database.from('wedding_settings').select('reception_capacity').eq('id', 1).single()
  ]);

  if (guestsError) throw guestsError;
  if (settingsError) throw settingsError;

  const allGuests = (guests ?? []) as any[];
  const activeReception = allGuests.filter((guest) => guest.is_active && guest.invitation_type === 'reception');
  const activeCeremony = allGuests.filter((guest) => guest.is_active && guest.invitation_type === 'ceremony_only');
  const assigned = activeReception.reduce((total, guest) => total + guest.allowed_passes, 0);
  const confirmed = activeReception.reduce((total, guest) => total + guest.confirmed_passes, 0);
  const assignedAdults = activeReception.reduce((total, guest) => total + guest.allowed_adults, 0);
  const assignedChildren = activeReception.reduce((total, guest) => total + guest.allowed_children, 0);
  const confirmedAdults = activeReception.reduce((total, guest) => total + guest.confirmed_adults, 0);
  const confirmedChildren = activeReception.reduce((total, guest) => total + guest.confirmed_children, 0);
  const releasable = activeReception
    .filter((guest) => guest.confirmation_status !== 'pending')
    .reduce((total, guest) => total + Math.max(0, guest.allowed_passes - guest.confirmed_passes), 0);

  return {
    guests: allGuests.map(serializeGuest),
    stats: {
      capacity: settings.reception_capacity,
      assigned,
      confirmed,
      assignedAdults,
      assignedChildren,
      confirmedAdults,
      confirmedChildren,
      available: Math.max(0, settings.reception_capacity - assigned),
      releasable,
      pendingInvitations: activeReception.filter((guest) => guest.confirmation_status === 'pending').length,
      ceremonyConfirmed: activeCeremony.filter((guest) => guest.confirmation_status === 'confirmed').length
    }
  };
}

export const GET: APIRoute = async ({ cookies }) => {
  const admin = await getAdminSession(cookies);
  if (!admin) return json({ message: 'Tu sesión venció. Inicia sesión nuevamente.' }, 401);

  try {
    return json(await dashboardPayload());
  } catch (error) {
    console.error('Administrator guest list failed', error);
    return json({ message: 'No pudimos cargar los invitados.' }, 503);
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!hasSameOrigin(request)) return json({ message: 'Solicitud no permitida.' }, 403);
  const admin = await getAdminSession(cookies);
  if (!admin) return json({ message: 'Tu sesión venció. Inicia sesión nuevamente.' }, 401);

  try {
    const body = (await request.json()) as {
      fullName?: unknown;
      phone?: unknown;
      contacts?: unknown;
      invitationType?: unknown;
      allowedAdults?: unknown;
      allowedChildren?: unknown;
    };
    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
    const contacts = parseInvitationContacts(body.contacts);
    const invitationType = body.invitationType === 'ceremony_only' ? 'ceremony_only' : 'reception';
    const allowedAdults = invitationType === 'ceremony_only' ? 0 : Number(body.allowedAdults);
    const allowedChildren = invitationType === 'ceremony_only' ? 0 : Number(body.allowedChildren);

    if (fullName.length < 5 || fullName.length > 120 || !contacts) {
      return json({ message: 'Revisa el nombre de la invitación y los datos de cada destinatario.' }, 400);
    }
    if (!Number.isInteger(allowedAdults) || !Number.isInteger(allowedChildren) || allowedAdults < 0 || allowedChildren < 0 || allowedAdults + allowedChildren > 20 || (invitationType === 'reception' && allowedAdults + allowedChildren < 1)) {
      return json({ message: 'La cantidad de pases de adultos y niños no es válida.' }, 400);
    }

    const database = getWeddingDatabase();
    const { data, error } = await database.rpc('admin_save_wedding_guest', {
      p_guest_id: null,
      p_full_name: fullName,
      p_contacts: contactsForRpc(contacts),
      p_invitation_type: invitationType,
      p_allowed_adults: allowedAdults,
      p_allowed_children: allowedChildren,
      p_is_active: true
    });

    if (error) {
      if (error.message.includes('RECEPTION_CAPACITY')) return json({ message: 'No hay suficientes pases disponibles en el cupo del salón.' }, 409);
      if (error.message.includes('PHONE_MUST_HAVE_10_DIGITS')) return json({ message: 'El teléfono debe tener 10 dígitos.' }, 400);
      if (error.message.includes('PHONE_ALREADY_ASSIGNED')) return json({ message: 'Uno de los teléfonos ya pertenece a otra invitación activa.' }, 409);
      if (error.message.includes('wedding_invitation_contacts_guest_id_phone_normalized_key')) return json({ message: 'No repitas el mismo teléfono dentro de una invitación.' }, 409);
      throw error;
    }

    const guest = Array.isArray(data) ? data[0] : data;
    return json({ guest: serializeGuest(guest), ...(await dashboardPayload()) }, 201);
  } catch (error) {
    console.error('Administrator guest creation failed', error);
    return json({ message: 'No pudimos guardar al invitado.' }, 503);
  }
};

export const ALL: APIRoute = () => json({ message: 'Método no permitido.' }, 405);
