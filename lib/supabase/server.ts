import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

/** Cookie-based Supabase client for the owner/admin pages (acts as the signed-in user, RLS applies). */
export async function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  const store = await cookies();
  return createServerClient(url, anon, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Called from a Server Component: cookies are refreshed by proxy.ts instead.
        }
      },
    },
  });
}

export type StaffRole = 'owner' | 'admin' | 'treasurer';

/** The signed-in user and their site role (from public.site_roles), or null. */
export async function getStaff() {
  const sb = await supabaseServer();
  if (!sb) return null;
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  const { data } = await sb.from('site_roles').select('role').eq('user_id', user.id).maybeSingle();
  return { sb, user, role: (data?.role ?? null) as StaffRole | null };
}
