import type { APIRoute } from 'astro';
import { getAdminSession } from '../../../../lib/server/admin-auth';
import { hasSameOrigin, json } from '../../../../lib/server/http';
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
      phone?: unknown;
      invitationType?: unknown;
      allowedPasses?: unknown;
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
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const invitationType = body.invitationType === 'ceremony_only' ? 'ceremony_only' : 'reception';
    const allowedPasses = invitationType === 'ceremony_only' ? 0 : Number(body.allowedPasses);
    const isActive = body.isActive !== false;

    if (fullName.length < 5 || fullName.length > 120 || !/^\+?\d[\d\s()-]{8,18}$/.test(phone)) {
      return json({ message: 'Revisa el nombre y el teléfono del invitado.' }, 400);
    }
    if (!Number.isInteger(allowedPasses) || allowedPasses < 0 || allowedPasses > 20) {
      return json({ message: 'La cantidad de pases no es válida.' }, 400);
    }

    const { error } = await database.rpc('admin_save_wedding_guest', {
      p_guest_id: params.id,
      p_full_name: fullName,
      p_phone: phone,
      p_invitation_type: invitationType,
      p_allowed_passes: allowedPasses,
      p_is_active: isActive
    });

    if (error) {
      if (error.message.includes('RECEPTION_CAPACITY')) return json({ message: 'No hay suficientes pases disponibles en el cupo del salón.' }, 409);
      if (error.message.includes('CONFIRMED_PASSES_CONFLICT')) return json({ message: 'No puedes asignar menos pases que los ya confirmados ni convertir esa confirmación a solo misa.' }, 409);
      if (error.message.includes('PHONE_MUST_HAVE_10_DIGITS')) return json({ message: 'El teléfono debe tener 10 dígitos.' }, 400);
      if (error.message.includes('wedding_guests_phone_unique')) return json({ message: 'Ese teléfono ya pertenece a otra invitación activa.' }, 409);
      throw error;
    }

    return json({ ok: true });
  } catch (error) {
    console.error('Administrator guest update failed', error);
    return json({ message: 'No pudimos actualizar la invitación.' }, 503);
  }
};

export const ALL: APIRoute = () => json({ message: 'Método no permitido.' }, 405);
