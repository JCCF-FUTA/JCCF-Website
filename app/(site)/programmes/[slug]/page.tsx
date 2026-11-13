import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProgramme, getProgrammes } from '@/lib/data';
import { getVideosByIds } from '@/lib/youtube';
import { formatRange, formatTime, isPast, programmeLine } from '@/lib/format';
import { toPlainText } from '@/lib/content/blocks';
import { SITE } from '@/lib/site';
import { Countdown } from '@/components/programmes/Countdown';
import { calendarHref, ProgrammeCard, whatsappShare } from '@/components/programmes/ProgrammeCard';
import { SermonCard } from '@/components/media/SermonCard';
import { LinkButton } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { RichText } from '@/components/ui/RichText';
import { SmartImage } from '@/components/ui/SmartImage';

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getProgrammes()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getProgramme((await params).slug);
  if (!p) return {};
  return {
    title: p.title,
    description: `${programmeLine(p)}. ${p.summary ?? toPlainText(p.body).slice(0, 140)}`,
    openGraph: p.flyer?.url ? { images: [{ url: p.flyer.url }] } : undefined,
  };
}

export default async function ProgrammePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProgramme(slug);
  if (!p) notFound();
  const now = Date.now();
  const past = isPast(p, now);
  const [related, all] = await Promise.all([past ? getVideosByIds(p.relatedVideoIds ?? []) : Promise.resolve([]), getProgrammes()]);
  const others = all.filter((x) => x.slug !== p.slug && !isPast(x, now)).slice(0, 3);
  const mapUrl = p.mapUrl ?? (p.venue ? `https://maps.google.com/?q=${encodeURIComponent(p.venue)}` : undefined);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: p.title,
    startDate: p.start,
    endDate: p.end ?? p.start,
    eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: { '@type': 'Place', name: p.venue ?? 'FUTA', address: 'Federal University of Technology, Akure, Ondo State, Nigeria' },
    image: p.flyer?.url ? [p.flyer.url] : undefined,
    description: p.summary,
    organizer: { '@type': 'Organization', name: SITE.fullName, url: SITE.url },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="theme-stage relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30 blur-2xl" aria-hidden="true">
          <SmartImage image={p.flyer} sizes="50vw" decorative />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-stage/60 to-stage" aria-hidden="true" />
        <div className="container-page grid gap-10 pt-28 pb-16 expanded:grid-cols-12 expanded:items-center expanded:pt-36 expanded:pb-24">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-xl shadow-elev-5 expanded:col-span-5" data-hero-item>
            <SmartImage image={p.flyer} sizes="(min-width: 840px) 420px, 90vw" priority fallbackLabel={p.kind} />
          </div>
          <div className="flex flex-col items-start gap-6 expanded:col-span-7">
            <nav aria-label="Breadcrumb" data-hero-item>
              <ol className="flex items-center gap-1.5 text-label-md font-semibold uppercase text-on-stage-variant">
                <li><Link href="/programmes" className="inline-flex min-h-12 items-center hover:text-on-stage">Programmes</Link></li>
                <li aria-hidden="true"><Icon name="arrow_forward" size={16} /></li>
                <li aria-current="page" className="text-on-stage">{p.kind}</li>
              </ol>
            </nav>
            <div className="flex flex-wrap gap-2" data-hero-item>
              <StatusChip kind="stage">{past ? 'Past programme' : 'Upcoming'}</StatusChip>
              {p.placeholder && <StatusChip kind="stage-dashed">Date to be confirmed</StatusChip>}
            </div>
            <h1 className="type-display text-display-lg text-balance" data-hero-item style={{ '--d': 1 } as React.CSSProperties}>{p.title}</h1>
            {p.theme && <p data-hero-item className="text-title-lg text-glow">“{p.theme}”</p>}
            {!past ? (
              <div data-hero-item className="glass w-full rounded-xl p-5 medium:p-6">
                <Countdown title={p.title} start={p.start} end={p.end} dateLine={programmeLine(p)} now={now} hideTitle />
              </div>
            ) : (
              <p data-hero-item className="flex items-center gap-2 text-body-lg text-on-stage-variant"><Icon name="calendar_month" /> {programmeLine(p)}</p>
            )}
            {!past && (
              <div data-hero-item className="flex flex-wrap gap-3">
                <LinkButton href={calendarHref(p)} tone="stage" icon="event">Add to calendar</LinkButton>
                <LinkButton href={whatsappShare(p)} tone="stage" variant="outlined" icon="share">Share on WhatsApp</LinkButton>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-12 expanded:grid-cols-12">
          <div className="expanded:col-span-8" data-reveal="up">
            <h2 className="type-headline mb-6 text-headline-md">About this programme</h2>
            {p.body?.length ? <RichText value={p.body} /> : <p className="prose-jccf text-on-surface-variant">{p.summary}</p>}

            {!!p.ministers?.length && (
              <div className="mt-12">
                <h2 className="type-headline mb-6 text-headline-md">Ministering</h2>
                <ul className="grid grid-cols-2 gap-4 medium:grid-cols-3">
                  {p.ministers.map((m) => (
                    <li key={m.name} className="flex items-center gap-3">
                      <span className="relative inline-flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-container-high">
                        {m.photo?.url ? <Image src={m.photo.url} alt="" fill sizes="56px" className="object-cover" /> : <Icon name="person" />}
                      </span>
                      <div>
                        <p className="text-title-sm font-semibold">{m.name}</p>
                        {m.role && <p className="text-body-sm text-on-surface-variant">{m.role}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <aside className="expanded:col-span-4" aria-label="Programme details">
            <dl className="flex flex-col gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 expanded:sticky expanded:top-24">
              {[
                { icon: 'calendar_month', label: 'Date', value: formatRange(p.start, p.end) },
                { icon: 'schedule', label: 'Time', value: formatTime(p.start) },
                ...(p.venue ? [{ icon: 'location_on', label: 'Venue', value: p.venue }] : []),
              ].map((r) => (
                <div key={r.label} className="flex gap-3">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container"><Icon name={r.icon} size={20} /></span>
                  <div>
                    <dt className="text-label-md font-semibold uppercase text-on-surface-variant">{r.label}</dt>
                    <dd className="text-body-lg">{r.value}</dd>
                  </div>
                </div>
              ))}
              {mapUrl && (
                <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-1 text-label-lg font-semibold text-primary">
                  <Icon name="map" size={20} /> Get directions <Icon name="north_east" size={16} />
                </a>
              )}
              <p className="text-body-sm text-on-surface-variant">During Household programmes, member fellowships suspend their own meetings (constitution, Article 8).</p>
            </dl>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="section bg-surface-container-low">
          <div className="container-page">
            <h2 id="related-title" className="type-headline mb-8 text-headline-md">Sermons from {p.title}</h2>
            <ul data-reveal-stagger className="grid gap-6 medium:grid-cols-2 expanded:grid-cols-3">
              {related.map((v) => <li key={v.id}><SermonCard v={v} /></li>)}
            </ul>
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section aria-labelledby="more-title" className="section">
          <div className="container-page">
            <h2 id="more-title" className="type-headline mb-8 text-headline-md">More programmes</h2>
            <ul className="grid gap-6 medium:grid-cols-2 expanded:grid-cols-3">
              {others.map((x) => <li key={x.slug}><ProgrammeCard p={x} now={now} /></li>)}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
