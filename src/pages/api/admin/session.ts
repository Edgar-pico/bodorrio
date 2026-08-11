import type { APIRoute } from 'astro';
import { getAdminSession } from '../../../lib/server/admin-auth';
import { json } from '../../../lib/server/http';

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  const admin = await getAdminSession(cookies);
  if (!admin) return json({ message: 'Sesión no válida.' }, 401);
  return json({ admin });
};

export const ALL: APIRoute = () => json({ message: 'Método no permitido.' }, 405);
