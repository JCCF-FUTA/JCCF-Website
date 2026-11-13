import Image from 'next/image';
import Link from 'next/link';
import { PHOTOS } from '@/lib/content/seed';
import { programmeLine } from '@/lib/format';
import type { LiveStatus, Programme } from '@/lib/types';
import { LinkButton } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Icon } from '@/components/ui/Icon';
import { SmartImage } from '@/components/ui/SmartImage';
import { Title } from '@/components/ui/Title';
import { Countdown } from '@/components/programmes/Countdown';
import { FinderBar } from '@/components/fellowships/FinderBar';

/** Home hero on stage (DESIGN §C05): headline, CTAs, countdown card, finder bar. */
export function Hero({ programme, live, venues, now }: { programme: Programme | null; live: LiveStatus; venues: string[]; now: number }) {
  return (
    <section data-hero className="theme-stage relative isolate">
      <div className="relative flex min-h-[100svh] flex-col overflow-hidden expanded:max-h-[960px]">
        <div className="absolute inset-0 -z-10" data-hero-bg>
          <SmartImage image={PHOTOS.stage} sizes="100vw" priority decorative imgClassName="object-[50%_35%]" />
        </div>
        <div className="overlay-stage absolute inset-0 -z-10" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_0%_100%,rgb(250_4_4/0.22),transparent_60%)]" aria-hidden="true" />

        <div className="container-page grid flex-1 items-end gap-10 pt-32 pb-8 expanded:grid-cols-12 expanded:items-center expanded:pt-36 expanded:pb-32">
          <div className="flex flex-col items-center gap-6 text-center expanded:col-span-7 expanded:items-start expanded:text-left">
            <div data-hero-item style={{ '--d': 0 } as React.CSSProperties}>
              <Eyebrow tone="stage">Our vision · Ephesians 4:13</Eyebrow>
            </div>
            <Title
              as="h1"
              size="hero"
              tone="stage"
              text={'Till we all come\nin the unity\n*of the faith*'}
              heroItem={1}
              className="text-[clamp(3rem,10.5vw,6.75rem)] expanded:text-[clamp(4rem,7.6vw,7rem)]"
            />
            <p data-hero-item style={{ '--d': 2 } as React.CSSProperties} className="max-w-[46ch] text-body-lg text-on-stage-variant medium:text-[1.125rem] medium:leading-7">
              The Joint Christian Campus Fellowship, FUTA — one Household of every fellowship on campus since 1996/97.
            </p>
            <div data-hero-item style={{ '--d': 3 } as React.CSSProperties} className="flex flex-wrap justify-center gap-3 expanded:justify-start">
              <LinkButton href="/fellowships" size="lg" tone="stage" trailingIcon="arrow_forward" data-magnetic>
                Find a fellowship
              </LinkButton>
              {live.live ? (
                <LinkButton href="/media#live" size="lg" tone="stage" variant="filled-inverse" data-magnetic>
                  <span className="mr-2 inline-block size-2 rounded-full bg-live animate-live-pulse" aria-hidden="true" />
                  Watch live
                </LinkButton>
              ) : (
                <LinkButton href="/media" size="lg" tone="stage" variant="outlined" icon="play_arrow" data-magnetic>
                  Watch sermons
                </LinkButton>
              )}
            </div>
          </div>

          <div data-hero-item style={{ '--d': 4 } as React.CSSProperties} className="w-full expanded:col-span-5 expanded:justify-self-end expanded:max-w-[420px]">
            {live.live ? (
              <LiveTeaser live={live} />
            ) : programme ? (
              <div className="glass rounded-xl p-5 medium:p-6">
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

        {/* Compact: finder sits in the hero flow */}
        <div className="container-page pb-10 expanded:hidden" data-hero-item style={{ '--d': 5 } as React.CSSProperties}>
          <FinderBar venues={venues} />
        </div>
      </div>

      {/* Expanded+: finder overlaps the hero's bottom edge by half its height */}
      <div className="container-page absolute inset-x-0 bottom-0 z-10 hidden translate-y-1/2 expanded:block">
        <FinderBar venues={venues} />
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
