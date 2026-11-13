import { fail, isEmail, isPhone, readJson, storeSubmission, str } from '@/lib/api';

/** Contact form (PRD F8). Readable by owners and admins. */
export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body) return fail('Invalid request.');
  const name = str(body.name, 120);
  const contact = str(body.contact, 254);
  const message = str(body.message, 3000);
  const fields: Record<string, string> = {};
  if (!name) fields.name = 'Enter your name.';
  if (!isEmail(contact) && !isPhone(contact)) fields.contact = 'Enter an email address or phone number so we can reply.';
  if (message.length < 5) fields.message = 'Write a short message.';
  if (Object.keys(fields).length) return fail('Please check the highlighted fields.', 400, fields);
  return storeSubmission(req, body.token, 'contact_messages', { name, contact, subject: str(body.subject, 80) || 'General enquiry', message });
}
