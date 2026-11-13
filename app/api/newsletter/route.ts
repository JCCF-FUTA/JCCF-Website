import { fail, isEmail, readJson, storeSubmission, str } from '@/lib/api';

/** Newsletter sign-up (PRD F7). */
export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body) return fail('Invalid request.');
  const email = str(body.email, 254).toLowerCase();
  if (!isEmail(email)) return fail('Enter a valid email address.', 400, { email: 'Enter a valid email address.' });
  return storeSubmission(req, body.token, 'newsletter_subscribers', { email, source: str(body.source, 40) || 'site' });
}
