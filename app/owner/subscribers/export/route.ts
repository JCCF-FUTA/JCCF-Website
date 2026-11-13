import { getStaff } from '@/lib/supabase/server';

/** CSV export of newsletter subscribers (PRD F7) — owners and admins. */
export async function GET() {
  const staff = await getStaff();
  if (!staff || (staff.role !== 'owner' && staff.role !== 'admin')) return new Response('Forbidden', { status: 403 });
  const rows: { email: string; source: string | null; created_at: string }[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await staff.sb.from('newsletter_subscribers').select('email, source, created_at').order('created_at').range(from, from + 999);
    if (error) return new Response('Export failed', { status: 500 });
    rows.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }
  const esc = (s: string) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
  const csv = ['email,source,subscribed_at', ...rows.map((r) => [r.email, r.source ?? '', r.created_at].map(esc).join(','))].join('\n');
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="jccf-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
