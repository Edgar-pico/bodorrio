import type { APIRoute } from 'astro';
import { getWeddingDatabase, maskPhone, normalizeGuestName, normalizeMexicanPhone } from '../../../lib/server/supabase';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff'
    }
  });

const guestSelect = [
  'id',
  'full_name',
  'allowed_passes',
  'confirmed_passes',
  'allowed_adults',
  'allowed_children',
  'confirmed_adults',
  'confirmed_children',
  'confirmation_status',
  'public_token',
  'invitation_code',
  'invitation_type',
  'contacts:wedding_invitation_contacts(contact_name, phone_e164, is_primary, display_order)'
].join(', ');

function serializeInvitation(guest: any) {
  const contacts = [...(guest.contacts ?? [])].sort((left, right) => left.display_order - right.display_order);
  const primary = contacts.find((contact) => contact.is_primary) ?? contacts[0];

  return {
    token: guest.public_token,
    invitationCode: guest.invitation_code,
    fullName: guest.full_name,
    maskedPhone: primary ? maskPhone(primary.phone_e164) : 'Teléfono verificado',
    recipientNames: contacts.map((contact) => contact.contact_name),
    allowedPasses: guest.allowed_passes,
    confirmedPasses: guest.confirmed_passes,
    allowedAdults: guest.allowed_adults,
    allowedChildren: guest.allowed_children,
    confirmedAdults: guest.confirmed_adults,
    confirmedChildren: guest.confirmed_children,
    status: guest.confirmation_status,
    invitationType: guest.invitation_type
  };
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentLength = Number(request.headers.get('content-length') ?? 0);
    if (contentLength > 2_000) return json({ message: 'La solicitud es demasiado grande.' }, 413);

    const body = (await request.json()) as { search?: unknown; token?: unknown; website?: unknown };
    if (typeof body.website === 'string' && body.website.length > 0) {
      return json({ message: 'No encontramos una invitación con esos datos.' }, 404);
    }

    const token = typeof body.token === 'string' ? body.token : '';
    const hasToken = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token);
    const search = typeof body.search === 'string' ? body.search.trim() : '';
    if (token && !hasToken) return json({ message: 'El enlace de invitación no es válido.' }, 400);
    if (!hasToken && (search.length < 5 || search.length > 120)) {
      return json({ message: 'Escribe tu nombre, teléfono o ID de invitación.' }, 400);
    }

    const database = getWeddingDatabase();
    const compactSearch = search.toUpperCase().replace(/\s+/g, '');
    const looksLikeCode = /^EB-?\d{6}$/.test(compactSearch);
    const invitationCode = compactSearch.replace(/^EB(?=\d)/, 'EB-');
    const looksLikePhone = /^[\d\s()+.-]+$/.test(search);
    const digits = normalizeMexicanPhone(search);
    if (looksLikePhone && digits.length !== 10) {
      return json({ message: 'Escribe el teléfono completo a 10 dígitos.' }, 400);
    }

    let guests: any[] | null = null;
    let error: any = null;

    if (!hasToken && looksLikePhone) {
      const { data: contactMatches, error: contactError } = await database
        .from('wedding_invitation_contacts')
        .select('guest_id')
        .eq('phone_normalized', digits)
        .limit(3);
      if (contactError) throw contactError;
      const ids = [...new Set((contactMatches ?? []).map((contact) => contact.guest_id))];
      if (ids.length) {
        const result = await database.from('wedding_guests').select(guestSelect).in('id', ids).eq('is_active', true).limit(2);
        guests = result.data;
        error = result.error;
      } else {
        guests = [];
      }
    } else {
      const field = hasToken ? 'public_token' : looksLikeCode ? 'invitation_code' : 'normalized_name';
      const value = hasToken ? token : looksLikeCode ? invitationCode : normalizeGuestName(search);
      const result = await database.from('wedding_guests').select(guestSelect).eq(field, value).eq('is_active', true).limit(2);
      guests = result.data;
      error = result.error;
    }

    if (error) throw error;
    if (!guests?.length) return json({ message: 'No encontramos una invitación con esos datos. Revisa que coincidan con los que recibiste.' }, 404);
    if (guests.length > 1) return json({ message: 'Hay más de una coincidencia. Usa el ID de invitación que aparece en tu mensaje.' }, 409);

    return json({ invitation: serializeInvitation(guests[0]) });
  } catch (error) {
    console.error('Invitation lookup failed', error);
    return json({ message: 'El sistema de confirmación no está disponible por el momento. Intenta nuevamente más tarde.' }, 503);
  }
};

export const ALL: APIRoute = () => json({ message: 'Método no permitido.' }, 405);
