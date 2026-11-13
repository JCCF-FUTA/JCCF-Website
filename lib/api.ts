import 'server-only';
import { NextResponse } from 'next/server';
import { verifyTurnstile } from './turnstile';
import { supabaseAdmin } from './supabase/admin';

export const ok = (extra: Record<string, unknown> = {}) => NextResponse.json({ ok: true, ...extra });
export const fail = (error: string, status = 400, fields?: Record<string, string>) =>
  NextResponse.json({ ok: false, error, fields }, { status });

export async function readJson(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await req.json();
    return body && typeof body === 'object' ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export const str = (v: unknown, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
export const isPhone = (s: string) => /^\+?[\d\s()-]{7,20}$/.test(s);

/**
 * Shared steps for every public form: Turnstile check, then insert with the service role.
 * Without Supabase: development logs and succeeds (so the UI can be tried); production refuses,
 * so nothing a student sends is silently lost.
 */
export async function storeSubmission(req: Request, token: unknown, table: string, row: Record<string, unknown>) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
  if (!(await verifyTurnstile(typeof token === 'string' ? token : null, ip))) {
    return fail('Please complete the spam check and try again.', 400);
  }
  const db = supabaseAdmin();
  if (!db) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[dev] Supabase not configured — would insert into ${table}:`, table === 'prayer_requests' ? '(prayer request hidden)' : row);
      return ok({ stored: false });
    }
    return fail('This form isn’t switched on yet. Please try again later or reach us on WhatsApp.', 503);
  }
  const { error } = await db.from(table).insert(row);
  if (error) {
    if (error.code === '23505') return ok({ duplicate: true }); // already subscribed
    console.error(`[${table}] insert failed`, error.message);
    return fail('We couldn’t save that just now. Please try again in a minute.', 500);
  }
  return ok();
}
