import type { APIRoute } from 'astro';
import { getAdminSession } from '../../../../lib/server/admin-auth';
import { hasSameOrigin, json } from '../../../../lib/server/http';
import { getWeddingDatabase } from '../../../../lib/server/supabase';

export const prerender = false;

function serializeGuest(guest: any) {
  return {
    id: guest.id,
    token: guest.public_token,
    fullName: guest.full_name,
    phone: guest.phone_e164,
    invitationType: guest.invitation_type,
    allowedPasses: guest.allowed_passes,
    confirmedPasses: guest.confirmed_passes,
    status: guest.confirmation_status,
    note: guest.guest_note,
    isActive: guest.is_active,
    confirmedAt: guest.confirmed_at,
    createdAt: guest.created_at
  };
}

async function dashboardPayload() {
  const database = getWeddingDatabase();
  const [{ data: guests, error: guestsError }, { data: settings, error: settingsError }] = await Promise.all([
    database
      .from('wedding_guests')
      .select('id, public_token, full_name, phone_e164, invitation_type, allowed_passes, confirmed_passes, confirmation_status, guest_note, is_active, confirmed_at, created_at')
      .order('full_name'),
    database.from('wedding_settings').select('reception_capacity').eq('id', 1).single()
  ]);

  if (guestsError) throw guestsError;
  if (settingsError) throw settingsError;

  const allGuests = guests ?? [];
  const activeReception = allGuests.filter((guest) => guest.is_active && guest.invitation_type === 'reception');
  const activeCeremony = allGuests.filter((guest) => guest.is_active && guest.invitation_type === 'ceremony_only');
  const assigned = activeReception.reduce((total, guest) => total + guest.allowed_passes, 0);
  const confirmed = activeReception.reduce((total, guest) => total + guest.confirmed_passes, 0);
  const releasable = activeReception
    .filter((guest) => guest.confirmation_status !== 'pending')
    .reduce((total, guest) => total + Math.max(0, guest.allowed_passes - guest.confirmed_passes), 0);

  return {
    guests: allGuests.map(serializeGuest),
    stats: {
      capacity: settings.reception_capacity,
      assigned,
      confirmed,
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
      invitationType?: unknown;
      allowedPasses?: unknown;
    };
    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const invitationType = body.invitationType === 'ceremony_only' ? 'ceremony_only' : 'reception';
    const allowedPasses = invitationType === 'ceremony_only' ? 0 : Number(body.allowedPasses);

    if (fullName.length < 5 || fullName.length > 120 || !/^\+?\d[\d\s()-]{8,18}$/.test(phone)) {
      return json({ message: 'Revisa el nombre y el teléfono del invitado.' }, 400);
    }
    if (!Number.isInteger(allowedPasses) || allowedPasses < 0 || allowedPasses > 20) {
      return json({ message: 'La cantidad de pases no es válida.' }, 400);
    }

    const database = getWeddingDatabase();
    const { data, error } = await database.rpc('admin_save_wedding_guest', {
      p_guest_id: null,
      p_full_name: fullName,
      p_phone: phone,
      p_invitation_type: invitationType,
      p_allowed_passes: allowedPasses,
      p_is_active: true
    });

    if (error) {
      if (error.message.includes('RECEPTION_CAPACITY')) return json({ message: 'No hay suficientes pases disponibles en el cupo del salón.' }, 409);
      if (error.message.includes('PHONE_MUST_HAVE_10_DIGITS')) return json({ message: 'El teléfono debe tener 10 dígitos.' }, 400);
      if (error.message.includes('wedding_guests_phone_unique')) return json({ message: 'Ese teléfono ya pertenece a otra invitación activa.' }, 409);
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
