import type { APIRoute } from 'astro';
import { getWeddingDatabase, maskPhone } from '../../../lib/server/supabase';

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

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentLength = Number(request.headers.get('content-length') ?? 0);
    if (contentLength > 3_000) return json({ message: 'La solicitud es demasiado grande.' }, 413);

    const body = (await request.json()) as {
      token?: unknown;
      attending?: unknown;
      adults?: unknown;
      children?: unknown;
      note?: unknown;
    };

    const token = typeof body.token === 'string' ? body.token : '';
    const attending = body.attending;
    const adults = Number(body.adults);
    const children = Number(body.children);
    const note = typeof body.note === 'string' ? body.note.trim().slice(0, 280) : '';

    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token)) {
      return json({ message: 'La invitación no es válida. Vuelve a buscarla.' }, 400);
    }
    if (typeof attending !== 'boolean' || !Number.isInteger(adults) || !Number.isInteger(children) || adults < 0 || children < 0) {
      return json({ message: 'Revisa las cantidades de adultos y niños.' }, 400);
    }
    if (!attending && (adults !== 0 || children !== 0)) {
      return json({ message: 'La cantidad de pases no es válida.' }, 400);
    }

    const database = getWeddingDatabase();
    const { data, error } = await database.rpc('confirm_wedding_invitation', {
      p_public_token: token,
      p_attending: attending,
      p_confirmed_adults: adults,
      p_confirmed_children: children,
      p_note: note || null
    });

    if (error) {
      if (error.message.includes('PASS_LIMIT')) return json({ message: 'La selección supera los pases de adultos o niños asignados.' }, 400);
      if (error.message.includes('INVITATION_NOT_FOUND')) return json({ message: 'La invitación ya no está disponible.' }, 404);
      throw error;
    }

    const guest = Array.isArray(data) ? data[0] : data;
    if (!guest) throw new Error('Confirmation did not return a guest.');

    return json({
      invitation: {
        token,
        invitationCode: guest.invitation_code,
        fullName: guest.full_name,
        maskedPhone: maskPhone(guest.phone_e164),
        recipientNames: [],
        allowedPasses: guest.allowed_passes,
        confirmedPasses: guest.confirmed_passes,
        allowedAdults: guest.allowed_adults,
        allowedChildren: guest.allowed_children,
        confirmedAdults: guest.confirmed_adults,
        confirmedChildren: guest.confirmed_children,
        status: guest.confirmation_status,
        invitationType: guest.invitation_type
      }
    });
  } catch (error) {
    console.error('Invitation confirmation failed', error);
    return json({ message: 'No pudimos guardar tu confirmación. Intenta nuevamente más tarde.' }, 503);
  }
};

export const ALL: APIRoute = () => json({ message: 'Método no permitido.' }, 405);
