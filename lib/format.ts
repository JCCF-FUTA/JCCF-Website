import { SITE } from './site';

const tz = SITE.timeZone;
const locale = 'en-NG';

const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, { timeZone: tz, ...opts });

/** "Sun 14 Feb 2027" */
export function formatDate(iso: string) {
  return fmt({ weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));
}

/** "14 February 2027" */
export function formatLongDate(iso: string) {
  return fmt({ day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
}

/** "4:00 PM" */
export function formatTime(iso: string) {
  return fmt({ hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(iso)).toUpperCase();
}

/** { day: "14", month: "FEB" } for date blocks */
export function dateParts(iso: string) {
  const d = new Date(iso);
  return {
    day: fmt({ day: 'numeric' }).format(d),
    month: fmt({ month: 'short' }).format(d).toUpperCase(),
    weekday: fmt({ weekday: 'long' }).format(d),
  };
}

/** "Mon 18 – Sun 24 Jan 2027" or a single date */
export function formatRange(start: string, end?: string) {
  if (!end) return formatDate(start);
  const s = new Date(start);
  const e = new Date(end);
  const sameDay = fmt({ year: 'numeric', month: 'numeric', day: 'numeric' }).format(s) ===
    fmt({ year: 'numeric', month: 'numeric', day: 'numeric' }).format(e);
  if (sameDay) return formatDate(start);
  return `${fmt({ weekday: 'short', day: 'numeric', month: 'short' }).format(s)} – ${formatDate(end)}`;
}

/** "Sun 14 Feb 2027 · 4:00 PM · Chapel of Faith" */
export function programmeLine(p: { start: string; end?: string; venue?: string }) {
  return [formatRange(p.start, p.end), formatTime(p.start), p.venue].filter(Boolean).join(' · ');
}

export function relativeDays(iso: string, now = Date.now()) {
  const diff = new Date(iso).getTime() - now;
  const days = Math.ceil(diff / 86_400_000);
  if (diff <= 0) return null;
  if (days <= 1) return 'Tomorrow';
  return `In ${days} days`;
}

export function naira(amount: number) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function isPast(p: { start: string; end?: string }, now = Date.now()) {
  return new Date(p.end || p.start).getTime() + (p.end ? 0 : 3 * 3_600_000) < now;
}
