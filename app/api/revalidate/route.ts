import { revalidatePath } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

/**
 * Sanity webhook → on-demand revalidation (PRD F1: changes live within 60 s).
 * Sanity → API → Webhooks: URL https://jccffuta.org/api/revalidate, trigger on create/update/delete,
 * secret = SANITY_REVALIDATE_SECRET.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return new NextResponse('Not configured', { status: 503 });
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret);
    if (!isValidSignature) return new NextResponse('Invalid signature', { status: 401 });
    revalidatePath('/', 'layout');
    return NextResponse.json({ revalidated: true, type: body?._type ?? null, now: Date.now() });
  } catch (err) {
    console.error('[revalidate]', err);
    return new NextResponse('Bad request', { status: 400 });
  }
}
