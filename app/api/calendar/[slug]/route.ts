import { getProgramme } from '@/lib/data';
import { toPlainText } from '@/lib/content/blocks';
import { SITE } from '@/lib/site';

const stamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');

/** Add-to-calendar: an .ics file for one programme (works with Google, Apple and Outlook calendars). */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProgramme(slug);
  if (!p) return new Response('Not found', { status: 404 });
  const end = p.end ?? new Date(new Date(p.start).getTime() + 3 * 3_600_000).toISOString();
  const url = `${SITE.url}/programmes/${p.slug}`;
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//JCCF FUTA//Programmes//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${p.slug}@jccffuta.org`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(p.start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(`${p.title} — JCCF FUTA`)}`,
    p.venue ? `LOCATION:${esc(p.venue)}` : '',
    `DESCRIPTION:${esc(`${p.summary ?? toPlainText(p.body).slice(0, 300)}\n\n${url}`)}`,
    `URL:${url}`,
    'BEGIN:VALARM', 'TRIGGER:-PT1H', 'ACTION:DISPLAY', `DESCRIPTION:${esc(p.title)}`, 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ].filter(Boolean).join('\r\n');
  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${p.slug}.ics"`,
      'Cache-Control': 'public, max-age=300',
    },
  });
}
