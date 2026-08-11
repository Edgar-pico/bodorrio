import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// The schema is installed after deployment from the bundled SQL migration.
// Generated database types can replace this boundary once the Supabase project exists.
let client: SupabaseClient<any> | null = null;

export function getWeddingDatabase() {
  const url = import.meta.env.SUPABASE_URL;
  const secret = import.meta.env.SUPABASE_SECRET_KEY ?? import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !secret) {
    throw new Error('Invitation database is not configured.');
  }

  client ??= createClient<any>(url, secret, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false
    }
  });

  return client;
}

export function getWeddingAuth() {
  const url = import.meta.env.SUPABASE_URL;
  const publishableKey = import.meta.env.SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.SUPABASE_ANON_KEY;

  if (!url || !publishableKey) {
    throw new Error('Wedding administrator authentication is not configured.');
  }

  return createClient<any>(url, publishableKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false
    }
  });

}

export function normalizeGuestName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es-MX')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeMexicanPhone(value: string) {
  const digits = value.replace(/\D/g, '');
  return digits.length === 12 && digits.startsWith('52') ? digits.slice(2) : digits;
}

export function maskPhone(value: string) {
  const digits = normalizeMexicanPhone(value);
  return digits.length >= 4 ? `(***) ***-${digits.slice(-4)}` : 'Teléfono verificado';
}
