import Image from 'next/image';
import Link from 'next/link';
import { PHOTOS } from '@/lib/content/seed';
import { formatDate, programmeLine, relativeDays } from '@/lib/format';
import type { LiveStatus, Programme } from '@/lib/types';
import { LinkButton } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Icon } from '@/components/ui/Icon';
import { SmartImage } from '@/components/ui/SmartImage';
import { Title } from '@/components/ui/Title';
import { Countdown } from '@/components/programmes/Countdown';
import { FinderBar } from '@/components/fellowships/FinderBar';

const d = (n: number) => ({ '--d': n }) as React.CSSProperties;

/**
 * Home hero on stage (DESIGN §C05, amended by ANTI-SLOP.md).
 * Purpose: find a fellowship. The finder bar is the one primary action; the motto is the one bold element.
 * The next programme is a glass card on wide screens and a single quiet line on phones.
 */
export function Hero({ programme, live, venues, days, now }: { programme: Programme | null; live: LiveStatus; venues: string[]; days: string[]; now: number }) {
  const inDays = programme ? relativeDays(programme.start, now) : null;
  return (
    <section data-hero className="theme-stage relative isolate">
      <div className="relative flex min-h-[100svh] flex-col overflow-hidden expanded:max-h-[960px]">
        <div className="absolute inset-0 -z-10" data-hero-bg>
          <SmartImage image={PHOTOS.stage} sizes="100vw" priority decorative imgClassName="object-[50%_35%]" />
        </div>
        <div className="overlay-stage absolute inset-0 -z-10" aria-hidden="true" />
        {/* Readability behind the text column on wide screens (keeps on-stage-variant above 4.5:1) */}
        <div className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-black/70 via-black/30 to-transparent expanded:block" aria-hidden="true" />

        <div className="container-page grid flex-1 items-end gap-8 pt-28 pb-6 expanded:grid-cols-12 expanded:items-center expanded:pt-36 expanded:pb-32">
          <div className="flex flex-col items-start gap-5 expanded:col-span-7">
            <div data-hero-item style={d(0)}>
              <Eyebrow tone="stage">Ephesians 4:13</Eyebrow>
            </div>
            <Title
              as="h1"
              size="hero"
              tone="stage"
              text={'Till we all come\nin the unity\n*of the faith*'}
              heroItem={1}
              className="text-[clamp(3rem,13vw,6.75rem)] expanded:text-[clamp(4rem,7.6vw,7rem)]"
            />
            <p data-hero-item style={d(2)} className="max-w-[46ch] text-body-lg text-white/90 medium:text-[1.125rem] medium:leading-7">
              Every Protestant fellowship and Christian group at FUTA belongs to one Household, the Joint Christian Campus Fellowship. Find one that meets on your day, near your hostel.
            </p>
            <div data-hero-item style={d(3)} className="flex flex-wrap gap-3">
              {live.live ? (
                <LinkButton href="/media#live" tone="stage" variant="filled-inverse">
                  <span className="mr-2 inline-block size-2 rounded-full bg-live animate-live-pulse" aria-hidden="true" />
                  Watch the live service
                </LinkButton>
              ) : (
                <LinkButton href="/media" tone="stage" variant="outlined" icon="play_arrow">Watch sermons</LinkButton>
              )}
            </div>
          </div>

          {/* Expanded+: next programme card (the site's one glass element: it sits over a photo) */}
          <div data-hero-item style={d(4)} className="hidden w-full expanded:col-span-5 expanded:block expanded:justify-self-end expanded:max-w-[420px]">
            {live.live ? (
              <LiveTeaser live={live} />
            ) : programme ? (
              <div className="glass rounded-xl p-6">
                <Countdown
                  title={programme.title}
                  href={`/programmes/${programme.slug}`}
                  start={programme.start}
                  end={programme.end}
                  dateLine={programmeLine(programme)}
                  now={now}
                />
              </div>
            ) : null}
          </div>
        </div>

        {/* Compact: the finder is the main action; the next programme is one quiet line under it */}
        <div className="container-page flex flex-col gap-3 pb-8 expanded:hidden" data-hero-item style={d(4)}>
          <FinderBar venues={venues} days={days} />
          {!live.live && programme && (
            <Link href={`/programmes/${programme.slug}`} className="flex min-h-12 items-center gap-2 text-body-md text-white/90">
              <Icon name="event" size={20} className="shrink-0" />
              <span className="min-w-0 flex-1 truncate">
                Next: <span className="font-semibold text-white">{programme.title}</span>, {formatDate(programme.start)}{inDays ? ` (${inDays.toLowerCase()})` : ''}
              </span>
              <Icon name="arrow_forward" size={20} className="shrink-0" />
            </Link>
          )}
        </div>
      </div>

      {/* Expanded+: finder overlaps the hero's bottom edge by half its height */}
      <div className="container-page absolute inset-x-0 bottom-0 z-10 hidden translate-y-1/2 expanded:block">
        <FinderBar venues={venues} days={days} />
      </div>
    </section>
  );
}

function LiveTeaser({ live }: { live: LiveStatus }) {
  return (
    <Link href="/media#live" className="group glass block overflow-hidden rounded-xl">
      <div className="relative aspect-video">
        {live.videoId ? (
          <Image src={`https://i.ytimg.com/vi/${live.videoId}/hqdefault_live.jpg`} alt="" fill sizes="(min-width: 840px) 420px, 100vw" className="object-cover" />
        ) : (
          <div className="tile-brand absolute inset-0" />
        )}
        <span className="absolute left-3 top-3 inline-flex h-7 items-center gap-1.5 rounded-full bg-live px-3 text-label-md font-semibold uppercase text-white">
          <span className="size-1.5 rounded-full bg-white animate-live-pulse" aria-hidden="true" /> Live
        </span>
        <span className="absolute inset-0 m-auto inline-flex size-16 items-center justify-center rounded-full bg-white/90 text-stage transition-transform group-hover:scale-105">
          <Icon name="play_arrow" filled size={32} />
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 p-5">
        <div className="min-w-0">
          <p className="text-label-md font-semibold uppercase text-on-stage-variant">We are live</p>
          <p className="truncate text-title-md font-semibold">{live.title}</p>
        </div>
        <span className="inline-flex h-10 shrink-0 items-center rounded-full bg-white px-4 text-label-lg font-semibold text-stage">Join now</span>
      </div>
    </Link>
  );
}
