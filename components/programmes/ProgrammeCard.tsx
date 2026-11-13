import Link from 'next/link';
import { cn } from '@/lib/cn';
import { SITE } from '@/lib/site';
import { dateParts, formatTime, isPast, programmeLine } from '@/lib/format';
import type { Programme } from '@/lib/types';
import { IconButton } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { SmartImage } from '@/components/ui/SmartImage';
import type { Tone } from '@/components/ui/Button';
import { Countdown } from './Countdown';

export function whatsappShare(p: Programme) {
  const text = `${p.title} — ${programmeLine(p)}\n${SITE.url}/programmes/${p.slug}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export const calendarHref = (p: Programme) => `/api/calendar/${p.slug}`;

function DateBlock({ iso }: { iso: string }) {
  const d = dateParts(iso);
  return (
    <span className="absolute left-3 top-3 flex flex-col items-center rounded-lg bg-primary px-3 py-2 text-white shadow-elev-1">
      <span className="font-display text-headline-md leading-none tabular-nums">{d.day}</span>
      <span className="mt-1 text-label-md font-semibold">{d.month}</span>
    </span>
  );
}

/** Programme card (DESIGN §C12), on stage or light. */
export function ProgrammeCard({ p, tone = 'light', now }: { p: Programme; tone?: Tone; now: number }) {
  const past = isPast(p, now);
  const stage = tone === 'stage';
  return (
    <article className={cn('group relative flex h-full flex-col overflow-hidden rounded-xl transition-transform duration-300 ease-standard hover:-translate-y-1', stage ? 'bg-stage-container' : 'border border-outline-variant bg-surface-container-lowest')}>
      <div className="relative aspect-[4/5] overflow-hidden" data-reveal="image">
        <SmartImage image={p.flyer} sizes="(min-width: 840px) 33vw, (min-width: 600px) 50vw, 100vw" fallbackLabel={p.kind} imgClassName="transition-transform duration-500 group-hover:scale-105" />
        <DateBlock iso={p.start} />
        <span className="absolute right-3 top-3">
          {past ? <StatusChip kind="image">Past</StatusChip> : <Countdown variant="chip" title={p.title} start={p.start} end={p.end} dateLine="" now={now} />}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-title-lg font-semibold">
          <Link href={`/programmes/${p.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {p.title}
          </Link>
        </h3>
        {p.theme && <p className={cn('-mt-1 text-body-md italic', stage ? 'text-on-stage-variant' : 'text-on-surface-variant')}>“{p.theme}”</p>}
        <ul className={cn('flex flex-col gap-1.5 text-body-md', stage ? 'text-on-stage-variant' : 'text-on-surface-variant')}>
          <li className="flex items-center gap-2"><Icon name="schedule" size={20} /> {formatTime(p.start)}</li>
          {p.venue && <li className="flex items-center gap-2"><Icon name="location_on" size={20} /> <span className="line-clamp-1">{p.venue}</span></li>}
        </ul>
        <div className="relative z-10 mt-auto flex items-center gap-1 pt-2">
          <span className={cn('mr-auto inline-flex h-12 items-center gap-1 text-label-lg font-semibold', stage ? 'text-stage-accent-text' : 'text-primary')}>
            Details <Icon name="arrow_forward" size={20} className="transition-transform group-hover:translate-x-1" />
          </span>
          {!past && (
            <>
              <IconButton href={calendarHref(p)} icon="event" label={`Add ${p.title} to calendar`} tone={tone} />
              <IconButton href={whatsappShare(p)} icon="share" label={`Share ${p.title} on WhatsApp`} tone={tone} />
            </>
          )}
        </div>
      </div>
    </article>
  );
}

/** Featured programme, horizontal on expanded+ with the full countdown. */
export function FeaturedProgramme({ p, tone = 'stage', now }: { p: Programme; tone?: Tone; now: number }) {
  const stage = tone === 'stage';
  return (
    <article className={cn('grid overflow-hidden rounded-2xl expanded:grid-cols-12', stage ? 'bg-stage-container' : 'border border-outline-variant bg-surface-container-lowest')}>
      <div className="relative aspect-[4/5] expanded:col-span-5 expanded:aspect-auto expanded:min-h-[440px]" data-reveal="image">
        <SmartImage image={p.flyer} sizes="(min-width: 840px) 40vw, 100vw" fallbackLabel={p.kind} />
        <DateBlock iso={p.start} />
      </div>
      <div className="flex flex-col justify-center gap-6 p-6 medium:p-8 expanded:col-span-7 expanded:p-12">
        <div className="flex flex-wrap gap-2">
          <StatusChip kind="new" icon="star">Featured</StatusChip>
          <StatusChip kind={stage ? 'stage' : 'upcoming'}>{p.kind}</StatusChip>
        </div>
        <div>
          <h3 className="font-display text-headline-lg uppercase expanded:text-display-sm">
            <Link href={`/programmes/${p.slug}`} className="hover:underline underline-offset-4">{p.title}</Link>
          </h3>
          {p.summary && <p className={cn('mt-3 max-w-[52ch] text-body-lg', stage ? 'text-on-stage-variant' : 'text-on-surface-variant')}>{p.summary}</p>}
        </div>
        <Countdown title={p.title} start={p.start} end={p.end} dateLine={programmeLine(p)} now={now} variant={stage ? 'stage' : 'light'} hideTitle />
        <div className="flex flex-wrap gap-2">
          <Link href={`/programmes/${p.slug}`} className={cn('state-layer inline-flex h-12 items-center gap-2 rounded-full px-6 text-label-lg font-semibold', stage ? 'bg-primary text-white' : 'bg-primary text-on-primary')}>
            Programme details <Icon name="arrow_forward" size={20} />
          </Link>
          <IconButton href={calendarHref(p)} icon="event" label="Add to calendar" variant="outlined" tone={tone} />
          <IconButton href={whatsappShare(p)} icon="share" label="Share on WhatsApp" variant="outlined" tone={tone} />
        </div>
      </div>
    </article>
  );
}
