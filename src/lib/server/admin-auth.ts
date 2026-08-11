import type { AstroCookies } from 'astro';
import { getWeddingAuth, getWeddingDatabase } from './supabase';

const ACCESS_COOKIE = 'wedding_admin_access';
const REFRESH_COOKIE = 'wedding_admin_refresh';

type AdminSession = {
  userId: string;
  email: string;
  displayName: string;
};

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'strict' as const,
    path: '/',
    maxAge
  };
}

export function setAdminSessionCookies(
  cookies: AstroCookies,
  session: { access_token: string; refresh_token: string; expires_in?: number }
) {
  cookies.set(ACCESS_COOKIE, session.access_token, cookieOptions(session.expires_in ?? 3600));
  cookies.set(REFRESH_COOKIE, session.refresh_token, cookieOptions(60 * 60 * 24 * 30));
}

export function clearAdminSessionCookies(cookies: AstroCookies) {
  cookies.delete(ACCESS_COOKIE, { path: '/' });
  cookies.delete(REFRESH_COOKIE, { path: '/' });
}

export async function getAdminSession(cookies: AstroCookies): Promise<AdminSession | null> {
  try {
    const auth = getWeddingAuth();
    let accessToken = cookies.get(ACCESS_COOKIE)?.value;
    const refreshToken = cookies.get(REFRESH_COOKIE)?.value;
    let user = accessToken ? (await auth.auth.getUser(accessToken)).data.user : null;

    if (!user && refreshToken) {
      const refreshed = await auth.auth.refreshSession({ refresh_token: refreshToken });
      if (refreshed.data.session) {
        setAdminSessionCookies(cookies, refreshed.data.session);
        accessToken = refreshed.data.session.access_token;
        user = refreshed.data.user;
      }
    }

    if (!user || !accessToken) {
      clearAdminSessionCookies(cookies);
      return null;
    }

    const database = getWeddingDatabase();
    const { data: admin, error } = await database
      .from('wedding_admins')
      .select('user_id, email, display_name, is_active')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !admin) {
      clearAdminSessionCookies(cookies);
      return null;
    }

    return {
      userId: admin.user_id,
      email: admin.email,
      displayName: admin.display_name
    };
  } catch (error) {
    console.error('Administrator session validation failed', error);
    return null;
  }
}
