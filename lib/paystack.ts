import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

const API = 'https://api.paystack.co';
const key = () => process.env.PAYSTACK_SECRET_KEY;

type Tx = { status: string; reference: string; amount: number; currency: string; paid_at?: string; customer?: { email?: string }; metadata?: Record<string, unknown> };

export async function initializeTransaction(input: {
  email: string; amountKobo: number; reference: string; callbackUrl: string; metadata: Record<string, unknown>;
}) {
  const res = await fetch(`${API}/transaction/initialize`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: input.email,
      amount: input.amountKobo,
      currency: 'NGN',
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
      channels: ['card', 'bank', 'ussd', 'bank_transfer'],
    }),
  });
  const data = (await res.json()) as { status: boolean; message: string; data?: { authorization_url: string } };
  if (!res.ok || !data.status || !data.data) throw new Error(data.message || 'Paystack initialize failed');
  return data.data.authorization_url;
}

export async function verifyTransaction(reference: string): Promise<Tx | null> {
  if (!key() || !/^[\w.-]{6,100}$/.test(reference)) return null;
  try {
    const res = await fetch(`${API}/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${key()}` },
      cache: 'no-store',
    });
    const data = (await res.json()) as { status: boolean; data?: Tx };
    return data.status && data.data ? data.data : null;
  } catch {
    return null;
  }
}

/** Paystack signs webhooks with HMAC-SHA512 of the raw body using the secret key. */
export function validWebhookSignature(rawBody: string, signature: string | null) {
  const secret = key();
  if (!secret || !signature) return false;
  const expected = createHmac('sha512', secret).update(rawBody).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}
