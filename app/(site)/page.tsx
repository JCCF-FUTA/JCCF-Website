import Link from 'next/link';
import {
  getFeaturedProgramme, getFellowships, getLeaders, getPosts, getSiteSettings, getUpcomingProgrammes,
} from '@/lib/data';
import { getLiveStatus } from '@/lib/live';
import { getLatestVideos } from '@/lib/youtube';
import { youtubeUrls } from '@/lib/youtube-urls';
import { PHOTOS } from '@/lib/content/seed';
import { SITE } from '@/lib/site';
import { formatLongDate } from '@/lib/format';
import { Hero } from '@/components/home/Hero';
import { GiveCta } from '@/components/home/GiveCta';
import { Stats } from '@/components/home/Stats';
import { StartHere } from '@/components/home/StartHere';
import { Pillars } from '@/components/about/Pillars';
import { FeaturedProgramme, ProgrammeCard } from '@/components/programmes/ProgrammeCard';
import { SermonCard } from '@/components/media/SermonCard';
import { LivePlayer } from '@/components/media/LivePlayer';
import { PresidentSplit } from '@/components/leadership/PresidentSplit';
import { LinkButton } from '@/components/ui/Button';
import { Carousel } from '@/components/ui/Carousel';
import { Icon } from '@/components/ui/Icon';
import { PhotoBand } from '@/components/ui/PhotoBand';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatusChip } from '@/components/ui/Chip';

export const revalidate = 300;

/**
 * Home. Purpose (ANTI-SLOP Part B): help a FUTA student find a fellowship.
 * Second: see the next programme and watch live. Third: give.
 */
export default async function HomePage() {
  const now = Date.now();
  const settings = await getSiteSettings();
  const [live, featured, upcoming, fellowships, videos, leaders, posts] = await Promise.all([
    getLiveStatus(),
    getFeaturedProgramme(now),
    getUpcomingProgrammes(now),
    getFellowships(),
    getLatestVideos(9, settings.pinnedVideoId),
    getLeaders(),
    getPosts(),
  ]);

  const nextThree = upcoming.filter((p) => p.slug !== featured?.slug).slice(0, 3);
  const president = leaders.find((l) => l.group === 'executive' && l.order === 1);
  const announcement = posts.find((p) => p.type === 'announcement' && new Date(p.date).getTime() <= now);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.fullName,
    alternateName: 'JCCF FUTA',
    url: SITE.url,
    logo: `${SITE.url}/brand/jccf-logo.png`,
    slogan: SITE.motto,
    foundingDate: '1997',
    sameAs: Object.values(settings.socials).filter(Boolean),
    parentOrganization: { '@type': 'CollegeOrUniversity', name: SITE.institution },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Hero programme={featured} live={live} now={now} fellowshipCount={fellowships.length} />

      {/* Latest announcement + facts */}
      <section aria-label="JCCF at a glance" className="section">
        <div className="container-page flex flex-col gap-6">
          {announcement && (
            <Link href={`/news/${announcement.slug}`}
              className="group flex flex-col gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 transition-colors hover:bg-surface-container-low medium:flex-row medium:items-center medium:gap-4 medium:px-6">
              <StatusChip kind="new" icon="campaign" className="self-start medium:self-auto">Announcement</StatusChip>
              <span className="flex-1 text-title-md font-semibold">{announcement.title}</span>
              <span className="text-body-md text-on-surface-variant">{formatLongDate(announcement.date)}</span>
              <Icon name="arrow_forward" className="hidden text-primary transition-transform group-hover:translate-x-1 medium:block" />
            </Link>
          )}
          <Stats stats={settings.stats} />
        </div>
      </section>

      {/* Start here */}
      <section aria-labelledby="start-title" className="section pt-0">
        <div className="container-page">
          <SectionHeader id="start-title" title="New to FUTA? Start here" />
          <StartHere
            fellowshipCount={fellowships.length}
            photo={{ ...PHOTOS.hall, alt: '' }}
            sermon={videos[0] ? { thumb: videos[0].thumbnail, title: videos[0].title } : null}
          />
        </div>
      </section>

      <Pillars />

      {/* Upcoming programmes */}
      {(featured || nextThree.length > 0) && (
        <section aria-labelledby="next-title" className="theme-stage section">
          <div className="container-page">
            <SectionHeader
              id="next-title"
              tone="stage"
              title="Upcoming programmes"
              lead="During Household programmes every fellowship suspends its own meetings and the whole Household meets together."
              action={<LinkButton href="/programmes" tone="stage" variant="outlined" trailingIcon="arrow_forward">All programmes</LinkButton>}
            />
            {featured && <FeaturedProgramme p={featured} now={now} />}
            {nextThree.length > 0 && (
              <ul data-reveal-stagger className="mt-6 grid gap-6 medium:grid-cols-2 expanded:grid-cols-3">
                {nextThree.map((p) => <li key={p.slug}><ProgrammeCard p={p} tone="stage" now={now} /></li>)}
              </ul>
            )}
          </div>
        </section>
      )}

      <PhotoBand
        image={{ ...PHOTOS.hall, alt: '' }}
        title="One Lord, one faith, one baptism"
        cite="Ephesians 4:5"
        body="At combined programmes every constituent fellowship sets aside its own meeting, and the whole Household worships together."
        action={<LinkButton href="/about" tone="stage" variant="filled-inverse" trailingIcon="arrow_forward">Read our history</LinkButton>}
      />

      {/* Latest sermons, or the live player when live */}
      {live.live ? (
        <LivePlayer live={live} heading="h2" compactTop />
      ) : (
        <section aria-labelledby="sermons-title" className="section">
          <div className="container-page">
            <SectionHeader
              id="sermons-title"
              title="Latest sermons"
              lead={<>From the JCCF FUTA YouTube channel. A video loads only when you tap play, to save data. <a href={youtubeUrls.subscribe} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary">Subscribe on YouTube</a> to know when we go live.</>}
              action={<LinkButton href="/media" variant="outlined" trailingIcon="arrow_forward">All sermons</LinkButton>}
            />
            <Carousel label="Latest sermons" trackClassName="auto-cols-[85%] medium:auto-cols-[calc((100%-24px)/2)] expanded:auto-cols-[calc((100%-48px)/3)]">
              {videos.slice(0, 6).map((v) => <li key={v.id}><SermonCard v={v} /></li>)}
            </Carousel>
          </div>
        </section>
      )}

      {president && (
        <section aria-label="Household President" className="theme-stage section">
          <div className="container-page">
            <PresidentSplit president={president} />
          </div>
        </section>
      )}

      <GiveCta image={{ ...PHOTOS.stage, alt: '' }} />
    </>
  );
}
