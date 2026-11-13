import { NextResponse } from 'next/server';
import { validWebhookSignature } from '@/lib/paystack';
import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * Paystack webhook (PRD F5): verifies the signature, then records each successful charge
 * (reference, amount, category, date) in Supabase for the Treasurer and the semester audit.
 * Set the URL in Paystack → Settings → API Keys & Webhooks: https://jccffuta.org/api/give/webhook
 */
export async function POST(req: Request) {
  const raw = await req.text();
  if (!validWebhookSignature(raw, req.headers.get('x-paystack-signature'))) {
    return new NextResponse('Invalid signature', { status: 401 });
  }
  const event = JSON.parse(raw) as {
    event: string;
    data: { reference: string; amount: number; currency: string; paid_at?: string; channel?: string; customer?: { email?: string }; metadata?: Record<string, unknown> };
  };
  if (event.event !== 'charge.success') return NextResponse.json({ received: true });

  const db = supabaseAdmin();
  if (!db) {
    console.error('[paystack] webhook received but Supabase is not configured');
    return new NextResponse('Not configured', { status: 503 }); // Paystack retries later
  }
  const d = event.data;
  const meta = d.metadata ?? {};
  const { error } = await db.from('payments').upsert(
    {
      reference: d.reference,
      amount_kobo: d.amount,
      currency: d.currency,
      category_id: (meta.category_id as string) ?? null,
      category_label: (meta.category_label as string) ?? null,
      giver_name: (meta.giver_name as string) ?? null,
      giver_email: d.customer?.email ?? null,
      channel: d.channel ?? null,
      paid_at: d.paid_at ?? new Date().toISOString(),
    },
    { onConflict: 'reference' },
  );
  if (error) {
    console.error('[paystack] could not record payment', error.message);
    return new NextResponse('Error', { status: 500 });
  }
  return NextResponse.json({ received: true });
}
