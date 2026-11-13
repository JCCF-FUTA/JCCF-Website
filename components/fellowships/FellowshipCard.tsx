import Image from 'next/image';
import Link from 'next/link';
import type { Fellowship } from '@/lib/types';
import { Brand } from '@/components/ui/Brand';
import { StatusChip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { SmartImage } from '@/components/ui/SmartImage';

export function meetingSummary(f: Fellowship) {
  const days = f.meetingDays.map((d) => `${d}s`).join(' & ');
  return [days, f.meetingTime].filter(Boolean).join(' · ');
}

export function whatsappHref(f: Fellowship) {
  if (f.whatsapp) return f.whatsapp;
  if (f.phone) return `https://wa.me/${f.phone.replace(/[^\d]/g, '').replace(/^0/, '234')}`;
  return undefined;
}

/** Photo card for the Home row (DESIGN §C11 `photo`). */
export function FellowshipPhotoCard({ f }: { f: Fellowship }) {
  return (
    <Link href={`/fellowships/${f.slug}`} className="group relative block aspect-[3/4] overflow-hidden rounded-xl text-white transition-transform duration-300 ease-standard hover:-translate-y-1">
      <SmartImage image={f.image} sizes="(min-width: 1200px) 20vw, (min-width: 600px) 33vw, 75vw" fallbackLabel={f.shortName} labelPosition="top" imgClassName="transition-transform duration-500 group-hover:scale-105" />
      <div className="overlay-card absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5">
        <p className="line-clamp-3 text-title-md font-semibold">{f.name}</p>
        {f.meetingDays.length > 0 && (
          <span className="inline-flex items-center gap-1 self-start rounded-full bg-black/60 px-2.5 py-1 text-label-sm font-semibold uppercase text-white backdrop-blur">
            <Icon name="schedule" size={16} /> {meetingSummary(f)}
          </span>
        )}
      </div>
    </Link>
  );
}

/** Listing card for /fellowships (DESIGN §C11 `listing`). The whole card is one link; WhatsApp sits above it. */
export function FellowshipListingCard({ f }: { f: Fellowship }) {
  const wa = whatsappHref(f);
  const rows = [
    f.meetingDays.length ? { icon: 'calendar_month', text: f.meetingDays.join(', ') } : null,
    f.meetingTime ? { icon: 'schedule', text: f.meetingTime } : null,
    f.venue ? { icon: 'location_on', text: f.venue } : null,
  ].filter(Boolean) as { icon: string; text: string }[];

  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-outline-variant bg-surface-container-lowest p-5 transition-[transform,box-shadow] duration-300 ease-standard hover:-translate-y-1 hover:shadow-elev-2 has-[a.card-link:focus-visible]:outline-3 has-[a.card-link:focus-visible]:outline-primary">
      <header className="flex items-center gap-3">
        <span className="relative inline-flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-container text-label-sm font-bold text-on-primary-container">
          {f.logo?.url ? <Image src={f.logo.url} alt="" fill sizes="48px" className="object-cover" /> : (f.shortName ?? f.name).slice(0, 4)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-title-md font-semibold">
            <Link href={`/fellowships/${f.slug}`} className="card-link outline-none after:absolute after:inset-0 after:rounded-xl after:content-['']">
              {f.name}
            </Link>
          </h3>
          {f.shortName && <p className="text-body-sm text-on-surface-variant">{f.shortName}</p>}
        </div>
      </header>

      <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-lg">
        <SmartImage image={f.image} sizes="(min-width: 840px) 33vw, (min-width: 600px) 50vw, 100vw" fallbackLabel={f.shortName} imgClassName="transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3"><StatusChip kind="image">{f.type === 'group' ? 'Christian group' : 'Fellowship'}</StatusChip></span>
      </div>

      {rows.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2 text-body-md text-on-surface-variant">
          {rows.map((r) => (
            <li key={r.icon} className="flex items-center gap-2"><Icon name={r.icon} size={20} /> {r.text}</li>
          ))}
        </ul>
      )}
      {f.placeholder && <p className="mt-3 text-body-sm text-on-surface-variant italic">Schedule to be confirmed by the fellowship.</p>}

      <footer className="mt-auto flex items-center justify-between pt-4">
        <span className="inline-flex h-12 items-center gap-1 text-label-lg font-semibold text-primary">
          View profile <Icon name="arrow_forward" size={20} className="transition-transform group-hover:translate-x-1" />
        </span>
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" aria-label={`Message ${f.shortName ?? f.name} on WhatsApp`}
            className="state-layer relative z-10 inline-flex size-12 items-center justify-center rounded-full border border-outline-variant text-on-surface">
            <Brand name="whatsapp" />
          </a>
        )}
      </footer>
    </article>
  );
}
