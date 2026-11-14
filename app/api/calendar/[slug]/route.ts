import { getProgramme } from '@/lib/data';
import { toPlainText } from '@/lib/content/blocks';
import { SITE } from '@/lib/site';

const stamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
/** YYYYMMDD in Africa/Lagos, for all-day events */
const day = (iso: string, addDays = 0) => {
  const d = new Date(new Date(iso).getTime() + addDays * 86_400_000);
  return new Intl.DateTimeFormat('en-CA', { timeZone: SITE.timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d).replace(/-/g, '');
};
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
    ...(p.allDay
      ? [`DTSTART;VALUE=DATE:${day(p.start)}`, `DTEND;VALUE=DATE:${day(p.end ?? p.start, 1)}`]
      : [`DTSTART:${stamp(p.start)}`, `DTEND:${stamp(end)}`]),
    `SUMMARY:${esc(`${p.title} (JCCF FUTA)`)}`,
    p.venue ? `LOCATION:${esc(p.venue)}` : '',
    `DESCRIPTION:${esc(`${p.summary ?? toPlainText(p.body).slice(0, 300)}\n\n${url}`)}`,
    `URL:${url}`,
    'BEGIN:VALARM', p.allDay ? 'TRIGGER:-PT12H' : 'TRIGGER:-PT1H', 'ACTION:DISPLAY', `DESCRIPTION:${esc(p.title)}`, 'END:VALARM',
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
