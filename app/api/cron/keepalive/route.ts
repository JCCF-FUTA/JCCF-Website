import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

/** Weekly Vercel Cron (vercel.json): one tiny query keeps the free Supabase project from pausing. */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get('authorization') !== `Bearer ${secret}`) return new NextResponse('Unauthorized', { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ ok: false, reason: 'supabase not configured' });
  const { error } = await db.from('newsletter_subscribers').select('id', { count: 'exact', head: true });
  return NextResponse.json({ ok: !error, at: new Date().toISOString() });
}
