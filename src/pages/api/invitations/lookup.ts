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
    if (search.length < 5 || search.length > 120) {
      if (!hasToken) return json({ message: 'Escribe tu nombre completo o un teléfono de 10 dígitos.' }, 400);
    }

    const digits = normalizeMexicanPhone(search);
    const looksLikePhone = /^[\d\s()+.-]+$/.test(search);
    if (looksLikePhone && digits.length !== 10) {
      return json({ message: 'Escribe el teléfono completo a 10 dígitos.' }, 400);
    }

    const database = getWeddingDatabase();
    const field = hasToken ? 'public_token' : looksLikePhone ? 'phone_normalized' : 'normalized_name';
    const value = hasToken ? token : looksLikePhone ? digits : normalizeGuestName(search);
    const { data, error } = await database
      .from('wedding_guests')
      .select('full_name, phone_e164, allowed_passes, confirmed_passes, confirmation_status, public_token, invitation_type')
      .eq(field, value)
      .eq('is_active', true)
      .limit(2);

    if (error) throw error;
    if (!data?.length) return json({ message: 'No encontramos una invitación con esos datos. Revisa que estén escritos exactamente como fueron registrados.' }, 404);
    if (data.length > 1) return json({ message: 'Hay más de una invitación con ese nombre. Búscala usando el teléfono registrado.' }, 409);

    const guest = data[0];
    return json({
      invitation: {
        token: guest.public_token,
        fullName: guest.full_name,
        maskedPhone: maskPhone(guest.phone_e164),
        allowedPasses: guest.allowed_passes,
        confirmedPasses: guest.confirmed_passes,
        status: guest.confirmation_status,
        invitationType: guest.invitation_type
      }
    });
  } catch (error) {
    console.error('Invitation lookup failed', error);
    return json({ message: 'El sistema de confirmación no está disponible por el momento. Intenta nuevamente más tarde.' }, 503);
  }
};

export const ALL: APIRoute = () => json({ message: 'Método no permitido.' }, 405);
