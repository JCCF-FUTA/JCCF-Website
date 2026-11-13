import 'server-only';
import { redirect } from 'next/navigation';
import { getStaff, type StaffRole } from '@/lib/supabase/server';

/** Server-side role check for a staff page. RLS enforces the same rule in the database. */
export async function requireRole(roles: StaffRole[]) {
  const staff = await getStaff();
  if (!staff) redirect('/owner/login');
  if (!staff.role || !roles.includes(staff.role)) redirect('/owner');
  return staff;
}

export const when = (iso: string) =>
  new Intl.DateTimeFormat('en-NG', { timeZone: 'Africa/Lagos', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
