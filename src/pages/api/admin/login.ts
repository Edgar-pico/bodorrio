import type { APIRoute } from 'astro';
import { getWeddingAuth, getWeddingDatabase } from '../../../lib/server/supabase';
import { clearAdminSessionCookies, setAdminSessionCookies } from '../../../lib/server/admin-auth';
import { hasSameOrigin, json } from '../../../lib/server/http';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!hasSameOrigin(request)) return json({ message: 'Solicitud no permitida.' }, 403);

  try {
    const contentLength = Number(request.headers.get('content-length') ?? 0);
    if (contentLength > 4_000) return json({ message: 'La solicitud es demasiado grande.' }, 413);

    const body = (await request.json()) as { email?: unknown; password?: unknown };
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8 || password.length > 200) {
      return json({ message: 'Correo o contraseña incorrectos.' }, 401);
    }

    const auth = getWeddingAuth();
    const { data, error } = await auth.auth.signInWithPassword({ email, password });
    if (error || !data.user || !data.session) {
      clearAdminSessionCookies(cookies);
      return json({ message: 'Correo o contraseña incorrectos.' }, 401);
    }

    const database = getWeddingDatabase();
    const { data: admin, error: adminError } = await database
      .from('wedding_admins')
      .select('user_id, email, display_name, is_active')
      .eq('user_id', data.user.id)
      .eq('is_active', true)
      .maybeSingle();

    if (adminError || !admin) {
      clearAdminSessionCookies(cookies);
      return json({ message: 'Esta cuenta no tiene acceso al panel.' }, 403);
    }

    setAdminSessionCookies(cookies, data.session);
    return json({ admin: { email: admin.email, displayName: admin.display_name } });
  } catch (error) {
    console.error('Administrator login failed', error);
    return json({ message: 'No pudimos iniciar sesión. Intenta nuevamente.' }, 503);
  }
};

export const ALL: APIRoute = () => json({ message: 'Método no permitido.' }, 405);
