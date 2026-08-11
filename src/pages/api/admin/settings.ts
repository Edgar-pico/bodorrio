import type { APIRoute } from 'astro';
import { getAdminSession } from '../../../lib/server/admin-auth';
import { hasSameOrigin, json } from '../../../lib/server/http';
import { getWeddingDatabase } from '../../../lib/server/supabase';

export const prerender = false;

export const PATCH: APIRoute = async ({ request, cookies }) => {
  if (!hasSameOrigin(request)) return json({ message: 'Solicitud no permitida.' }, 403);
  const admin = await getAdminSession(cookies);
  if (!admin) return json({ message: 'Tu sesión venció. Inicia sesión nuevamente.' }, 401);

  try {
    const body = (await request.json()) as { capacity?: unknown };
    const capacity = Number(body.capacity);
    if (!Number.isInteger(capacity) || capacity < 0 || capacity > 2000) {
      return json({ message: 'El cupo debe ser un número entre 0 y 2000.' }, 400);
    }

    const database = getWeddingDatabase();
    const { data, error } = await database.rpc('admin_set_wedding_capacity', { p_capacity: capacity });
    if (error) {
      if (error.message.includes('CAPACITY_BELOW_ALLOCATED')) return json({ message: 'El cupo no puede ser menor que los pases que ya están asignados.' }, 409);
      throw error;
    }

    return json({ settings: Array.isArray(data) ? data[0] : data });
  } catch (error) {
    console.error('Wedding capacity update failed', error);
    return json({ message: 'No pudimos actualizar el cupo.' }, 503);
  }
};

export const ALL: APIRoute = () => json({ message: 'Método no permitido.' }, 405);
