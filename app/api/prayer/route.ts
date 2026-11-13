import { fail, isEmail, isPhone, readJson, storeSubmission, str } from '@/lib/api';

/** Private prayer request (PRD F6). Stored only; never emailed. Readable by site owners only (RLS). */
export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body) return fail('Invalid request.');
  const request = str(body.request, 2000);
  const contact = str(body.contact, 254);
  if (request.length < 3) return fail('Please write your prayer request.', 400, { request: 'Please write your prayer request.' });
  if (contact && !isEmail(contact) && !isPhone(contact)) {
    return fail('Check the phone number or email.', 400, { contact: 'Enter a phone number or an email address, or leave it blank.' });
  }
  return storeSubmission(req, body.token, 'prayer_requests', {
    name: str(body.name, 120) || null,
    contact: contact || null,
    request,
    may_contact: body.followUp === true,
  });
}
