import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getFellowship, getFellowships } from '@/lib/data';
import { PHOTOS } from '@/lib/content/seed';
import { SHOW_SAMPLES, SITE } from '@/lib/site';
import { Brand } from '@/components/ui/Brand';
import { LinkButton } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { SmartImage } from '@/components/ui/SmartImage';
import { FellowshipPhotoCard, meetingSummary, whatsappHref } from '@/components/fellowships/FellowshipCard';

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getFellowships()).map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const f = await getFellowship((await params).slug);
  if (!f) return {};
  return {
    title: `${f.name}${f.shortName ? ` (${f.shortName})` : ''}`,
    description: f.description ?? `${f.name} is a constituent fellowship of ${SITE.title}. ${meetingSummary(f)}${f.venue ? ` at ${f.venue}` : ''}.`,
    openGraph: f.image?.url ? { images: [{ url: f.image.url }] } : undefined,
  };
}

export default async function FellowshipPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [f, all] = await Promise.all([getFellowship(slug), getFellowships()]);
  if (!f) notFound();

  const wa = whatsappHref(f);
  const mapUrl = f.mapUrl ?? (f.venue ? `https://maps.google.com/?q=${encodeURIComponent(`${f.venue}, Federal University of Technology Akure`)}` : undefined);
  const firstDay = f.meetingDays[0];
  const sameDay = firstDay ? all.filter((x) => x.slug !== f.slug && x.meetingDays.includes(firstDay)).slice(0, 5) : [];

  const info = [
    f.meetingDays.length ? { icon: 'calendar_month', label: 'Meets on', value: f.meetingDays.join(', ') } : null,
    f.meetingTime ? { icon: 'schedule', label: 'Time', value: f.meetingTime } : null,
    f.venue ? { icon: 'location_on', label: 'Venue', value: f.venue, href: mapUrl, linkLabel: 'Open in Maps' } : null,
    f.presidentName ? { icon: 'person', label: 'President', value: f.presidentName } : null,
  ].filter(Boolean) as { icon: string; label: string; value: string; href?: string; linkLabel?: string }[];

  const socials = [
    f.instagram ? { key: 'instagram' as const, href: f.instagram } : null,
    f.facebook ? { key: 'facebook' as const, href: f.facebook } : null,
  ].filter(Boolean) as { key: 'instagram' | 'facebook'; href: string }[];

  return (
    <>
      <section className="theme-stage relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-60" data-parallax>
          <SmartImage image={f.image ?? { ...PHOTOS.stage, alt: '' }} sizes="100vw" decorative priority imgClassName="scale-110 blur-[2px]" />
        </div>
        <div className="overlay-stage absolute inset-0 -z-10" aria-hidden="true" />
        <div className="container-page flex flex-col gap-6 pt-32 pb-12 expanded:flex-row expanded:items-end expanded:pb-16">
          <span data-hero-item className="relative inline-flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-primary font-display text-title-lg text-white">
            {f.logo?.url ? <Image src={f.logo.url} alt={`${f.name} logo`} fill sizes="96px" className="object-cover" /> : f.shortName ?? f.name.slice(0, 3)}
          </span>
          <div className="flex flex-col gap-4">
            <nav aria-label="Breadcrumb" data-hero-item>
              <ol className="flex items-center gap-1.5 text-label-md font-semibold uppercase text-on-stage-variant">
                <li><Link href="/fellowships" className="inline-flex min-h-12 items-center hover:text-on-stage">Fellowships</Link></li>
                <li aria-hidden="true"><Icon name="arrow_forward" size={16} /></li>
                <li aria-current="page" className="text-on-stage">{f.shortName ?? f.name}</li>
              </ol>
            </nav>
            <h1 className="type-display text-display-lg text-balance" data-hero-item style={{ '--d': 1 } as React.CSSProperties}>{f.name}</h1>
            <div data-hero-item className="flex flex-wrap gap-2">
              <StatusChip kind="stage">{f.type === 'group' ? 'Christian group' : 'Fellowship'}</StatusChip>
              {f.meetingDays.map((d) => (
                <StatusChip key={d} kind="stage" icon="calendar_month">{d}s{f.meetingTime ? ` · ${f.meetingTime}` : ''}</StatusChip>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-10 expanded:grid-cols-12">
          <div className="flex flex-col gap-8 expanded:col-span-8">
            <div data-reveal="up">
              <h2 className="type-headline text-headline-md">About {f.shortName ?? 'the fellowship'}</h2>
              <p className="mt-4 max-w-prose text-body-lg text-on-surface-variant">
                {f.description ?? `${f.name} is a registered constituent fellowship of the JCCF FUTA Household.`}
              </p>
              {f.placeholder && SHOW_SAMPLES && (
                <p className="mt-4 flex max-w-prose items-start gap-2 rounded-md bg-tertiary-container p-4 text-body-lg text-on-tertiary-container">
                  <Icon name="info" size={20} className="mt-px" /> Meeting days, time and venue shown here are not yet confirmed by the fellowship. Please check with them before you visit.
                </p>
              )}
            </div>
            {f.image?.url && (
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl" data-reveal="image">
                <SmartImage image={f.image} sizes="(min-width: 840px) 66vw, 100vw" />
              </div>
            )}
          </div>

          <aside className="expanded:col-span-4" aria-label="Fellowship details">
            <div className="flex flex-col gap-5 rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 expanded:sticky expanded:top-24" data-reveal="up">
              <h2 className="text-title-lg font-semibold">Visit {f.shortName ?? f.name}</h2>
              {info.length > 0 && (
                <dl className="flex flex-col gap-4">
                  {info.map((r) => (
                    <div key={r.label} className="flex gap-3">
                      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container"><Icon name={r.icon} size={20} /></span>
                      <div>
                        <dt className="text-label-md font-semibold uppercase text-on-surface-variant">{r.label}</dt>
                        <dd className="text-body-lg">{r.value}</dd>
                        {r.href && (
                          <a href={r.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-1 text-label-lg font-semibold text-primary">
                            {r.linkLabel} <Icon name="north_east" size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </dl>
              )}
              <div className="flex flex-col gap-2">
                {wa && <LinkButton href={wa} className="w-full"><span className="inline-flex items-center gap-2"><Brand name="whatsapp" /> Message on WhatsApp</span></LinkButton>}
                {f.phone && <LinkButton href={`tel:${f.phone.replace(/\s/g, '')}`} variant="outlined" icon="call" className="w-full">Call {f.phone}</LinkButton>}
              </div>
              {socials.length > 0 && (
                <div className="flex gap-2">
                  {socials.map((s) => (
                    <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${f.shortName ?? f.name} on ${s.key}`}
                      className="state-layer inline-flex size-12 items-center justify-center rounded-full border border-outline-variant">
                      <Brand name={s.key} />
                    </a>
                  ))}
                </div>
              )}
              {!wa && !f.phone && <p className="text-body-sm text-on-surface-variant">Contact details coming soon.</p>}
            </div>
          </aside>
        </div>
      </section>

      {sameDay.length > 0 && (
        <section aria-labelledby="same-day" className="section bg-surface-container-low">
          <div className="container-page">
            <h2 id="same-day" className="type-headline mb-8 text-headline-md">Other fellowships meeting on <span className="text-primary">{firstDay}</span></h2>
            <ul data-reveal-stagger className="snap-row auto-cols-[70%] gap-4 medium:auto-cols-[40%] expanded:grid-flow-row expanded:grid-cols-5">
              {sameDay.map((x) => <li key={x.slug}><FellowshipPhotoCard f={x} /></li>)}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
