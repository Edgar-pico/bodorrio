import type { APIRoute } from 'astro';
import { clearAdminSessionCookies } from '../../../lib/server/admin-auth';
import { hasSameOrigin, json } from '../../../lib/server/http';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!hasSameOrigin(request)) return json({ message: 'Solicitud no permitida.' }, 403);
  clearAdminSessionCookies(cookies);
  return json({ ok: true });
};

export const ALL: APIRoute = () => json({ message: 'Método no permitido.' }, 405);
