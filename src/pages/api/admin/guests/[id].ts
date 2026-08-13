import type { APIRoute } from 'astro';
import { getAdminSession } from '../../../../lib/server/admin-auth';
import { hasSameOrigin, json } from '../../../../lib/server/http';
import { contactsForRpc, parseInvitationContacts, parseInvitationMode } from '../../../../lib/server/invitations';
import { getWeddingDatabase } from '../../../../lib/server/supabase';

export const prerender = false;

const isUuid = (value: string | undefined) =>
  Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value));

export const PATCH: APIRoute = async ({ request, cookies, params }) => {
  if (!hasSameOrigin(request)) return json({ message: 'Solicitud no permitida.' }, 403);
  const admin = await getAdminSession(cookies);
  if (!admin) return json({ message: 'Tu sesión venció. Inicia sesión nuevamente.' }, 401);
  if (!isUuid(params.id)) return json({ message: 'Invitación no válida.' }, 400);

  try {
    const body = (await request.json()) as {
      action?: unknown;
      fullName?: unknown;
      contacts?: unknown;
      invitationMode?: unknown;
      invitationType?: unknown;
      allowedAdults?: unknown;
      allowedChildren?: unknown;
      isActive?: unknown;
    };
    const database = getWeddingDatabase();

    if (body.action === 'release') {
      const { error } = await database.rpc('admin_release_unused_wedding_passes', { p_guest_id: params.id });
      if (error) {
        if (error.message.includes('PASSES_NOT_RELEASABLE')) return json({ message: 'Solo puedes liberar pases después de una confirmación o rechazo.' }, 409);
        throw error;
      }
      return json({ ok: true });
    }

    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
    const contacts = parseInvitationContacts(body.contacts);
    const invitationMode = parseInvitationMode(body.invitationMode);
    const invitationType = body.invitationType === 'ceremony_only' ? 'ceremony_only' : 'reception';
    const allowedAdults = invitationType === 'ceremony_only' ? 0 : Number(body.allowedAdults);
    const allowedChildren = invitationType === 'ceremony_only' ? 0 : Number(body.allowedChildren);
    const isActive = body.isActive !== false;

    if (fullName.length < 2 || fullName.length > 120 || !contacts || (invitationMode === 'individual' && contacts.length !== 1)) {
      return json({ message: 'Revisa el nombre de la invitación y los datos de cada destinatario.' }, 400);
    }
    if (!Number.isInteger(allowedAdults) || !Number.isInteger(allowedChildren) || allowedAdults < 0 || allowedChildren < 0 || allowedAdults + allowedChildren > 20 || (invitationType === 'reception' && allowedAdults + allowedChildren < 1)) {
      return json({ message: 'La cantidad de pases de adultos y niños no es válida.' }, 400);
    }

    const { error } = await database.rpc('admin_save_wedding_guest', {
      p_guest_id: params.id,
      p_full_name: fullName,
      p_contacts: contactsForRpc(contacts),
      p_invitation_mode: invitationMode,
      p_invitation_type: invitationType,
      p_allowed_adults: allowedAdults,
      p_allowed_children: allowedChildren,
      p_is_active: isActive
    });

    if (error) {
      if (error.message.includes('RECEPTION_CAPACITY')) return json({ message: 'No hay suficientes pases disponibles en el cupo del salón.' }, 409);
      if (error.message.includes('INDIVIDUAL_CONTACT_LIMIT')) return json({ message: 'Una invitación individual debe tener exactamente un contacto.' }, 400);
      if (error.message.includes('CONFIRMED_PASSES_CONFLICT')) return json({ message: 'No puedes reducir adultos o niños por debajo de lo ya confirmado, ni convertir esa confirmación a solo misa.' }, 409);
      if (error.message.includes('PHONE_MUST_HAVE_10_DIGITS')) return json({ message: 'El teléfono debe tener 10 dígitos.' }, 400);
      if (error.message.includes('PHONE_ALREADY_ASSIGNED')) return json({ message: 'Uno de los teléfonos ya pertenece a otra invitación activa.' }, 409);
      if (error.message.includes('wedding_invitation_contacts_guest_id_phone_normalized_key')) return json({ message: 'No repitas el mismo teléfono dentro de una invitación.' }, 409);
      throw error;
    }

    return json({ ok: true });
  } catch (error) {
    console.error('Administrator guest update failed', error);
    return json({ message: 'No pudimos actualizar la invitación.' }, 503);
  }
};

export const ALL: APIRoute = () => json({ message: 'Método no permitido.' }, 405);
