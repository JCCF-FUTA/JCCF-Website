import { randomBytes } from 'node:crypto';
import { fail, isEmail, ok, readJson, str } from '@/lib/api';
import { getGiveSettings } from '@/lib/data';
import { initializeTransaction } from '@/lib/paystack';
import { SITE } from '@/lib/site';
import { verifyTurnstile } from '@/lib/turnstile';

const MIN = 100;
const MAX = 10_000_000;

/** Starts a Paystack checkout and returns the hosted payment URL (PRD F5). */
export async function POST(req: Request) {
  if (!process.env.PAYSTACK_SECRET_KEY) return fail('Online giving isn’t switched on yet. Please use the bank details on this page.', 503);
  const body = await readJson(req);
  if (!body) return fail('Invalid request.');

  const amount = Math.round(Number(body.amount));
  const email = str(body.email, 254).toLowerCase();
  const name = str(body.name, 120);
  const phone = str(body.phone, 30);
  if (!Number.isFinite(amount) || amount < MIN || amount > MAX) return fail(`Enter an amount between ₦${MIN} and ₦${MAX.toLocaleString()}.`);
  if (!isEmail(email)) return fail('Enter a valid email address.');
  if (!name) return fail('Enter your name.');

  const give = await getGiveSettings();
  const category = give.categories.find((c) => c.id === str(body.categoryId, 80) && c.open);
  if (!category) return fail('That giving category is closed. Please pick another.');

  if (!(await verifyTurnstile(typeof body.token === 'string' ? body.token : null))) return fail('Please complete the spam check and try again.');

  const reference = `JCCF-${Date.now().toString(36)}-${randomBytes(4).toString('hex')}`.toUpperCase();
  const origin = req.headers.get('origin') ?? SITE.url;
  try {
    const url = await initializeTransaction({
      email,
      amountKobo: amount * 100,
      reference,
      callbackUrl: `${origin}/give/thanks`,
      metadata: {
        category_id: category.id,
        category_label: category.label,
        giver_name: name,
        phone: phone || undefined,
        custom_fields: [
          { display_name: 'Category', variable_name: 'category', value: category.label },
          { display_name: 'Name', variable_name: 'giver_name', value: name },
        ],
      },
    });
    return ok({ url, reference });
  } catch (err) {
    console.error('[paystack] initialize failed', err);
    return fail('We couldn’t reach Paystack. Please try again, or use the bank details.', 502);
  }
}
