import Link from 'next/link';
import {
  getFeaturedProgramme, getFellowships, getGiveSettings, getLeaders, getPosts, getSiteSettings, getUpcomingProgrammes,
} from '@/lib/data';
import { getLiveStatus } from '@/lib/live';
import { getLatestVideos } from '@/lib/youtube';
import { youtubeUrls } from '@/lib/youtube-urls';
import { PHOTOS } from '@/lib/content/seed';
import { integrations, SITE } from '@/lib/site';
import { formatLongDate } from '@/lib/format';
import { Hero } from '@/components/home/Hero';
import { Stats } from '@/components/home/Stats';
import { WelcomeCards } from '@/components/home/WelcomeCards';
import { Pillars } from '@/components/about/Pillars';
import { FellowshipPhotoCard } from '@/components/fellowships/FellowshipCard';
import { Marquee } from '@/components/fellowships/Marquee';
import { FeaturedProgramme, ProgrammeCard } from '@/components/programmes/ProgrammeCard';
import { SermonCard } from '@/components/media/SermonCard';
import { LivePlayer } from '@/components/media/LivePlayer';
import { PresidentSplit } from '@/components/leadership/PresidentSplit';
import { GiveBand } from '@/components/give/GiveBand';
import { NewsletterCard } from '@/components/engage/NewsletterCard';
import { InstagramStrip } from '@/components/engage/InstagramStrip';
import { LinkButton } from '@/components/ui/Button';
import { Carousel } from '@/components/ui/Carousel';
import { Icon } from '@/components/ui/Icon';
import { PhotoBand } from '@/components/ui/PhotoBand';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatusChip } from '@/components/ui/Chip';

export const revalidate = 300;

export default async function HomePage() {
  const now = Date.now();
  const [settings, live, featured, upcoming, fellowships, videos, leaders, give, posts] = await Promise.all([
    getSiteSettings(),
    getLiveStatus(),
    getFeaturedProgramme(now),
    getUpcomingProgrammes(now),
    getFellowships(),
    getSiteSettings().then((s) => getLatestVideos(9, s.pinnedVideoId)),
    getLeaders(),
    getGiveSettings(),
    getPosts(),
  ]);

  const venues = [...new Set(fellowships.map((f) => f.venue).filter(Boolean) as string[])].sort();
  const nextThree = upcoming.filter((p) => p.slug !== featured?.slug).slice(0, 3);
  const president = leaders.find((l) => l.group === 'executive' && l.order === 1) ?? leaders[0];
  const announcement = posts.find((p) => p.type === 'announcement' && new Date(p.date).getTime() <= now) ?? posts.find((p) => p.type === 'announcement');
  const hasInstagram = Boolean(process.env.NEXT_PUBLIC_BEHOLD_FEED_ID) || Boolean(settings.instagramPosts?.some((p) => p.image?.url));
  const latestThumb = (i: number) => (videos[i] ? { url: videos[i].thumbnail, alt: '' } : null);

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

      <Hero programme={featured} live={live} venues={venues} now={now} />

      {/* Stats + latest announcement */}
      <section aria-label="JCCF at a glance" className="section expanded:pt-36">
        <div className="container-page flex flex-col gap-6">
          {announcement && (
            <Link href={`/news/${announcement.slug}`} data-reveal="up"
              className="group flex flex-col gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 transition-colors hover:bg-surface-container-low medium:flex-row medium:items-center medium:gap-4 medium:px-6">
              <StatusChip kind="new" icon="campaign" className="self-start">Announcement</StatusChip>
              <span className="flex-1 text-title-md font-semibold">{announcement.title}</span>
              <span className="text-body-sm text-on-surface-variant">{formatLongDate(announcement.date)}</span>
              <Icon name="arrow_forward" className="hidden text-primary transition-transform group-hover:translate-x-1 medium:block" />
            </Link>
          )}
          <Stats stats={settings.stats} />
        </div>
      </section>

      {/* Welcome to the Household */}
      <section aria-labelledby="welcome-title" className="section pt-0">
        <div className="container-page">
          <SectionHeader
            id="welcome-title"
            eyebrow="Welcome home"
            title="Welcome to *the Household*"
            lead="New on campus? Start here. Find a fellowship that meets this week, catch up on sermons, and give to the work."
          />
          <WelcomeCards
            cards={[
              { href: '/fellowships', title: 'Find a fellowship', text: `${fellowships.length} fellowships, one family.`, icon: 'diversity_3', image: { ...PHOTOS.hall, alt: '' } },
              { href: '/media', title: 'Watch & listen', text: 'Sermons and live services from the Household.', icon: 'play_arrow', image: latestThumb(0) },
              { href: '/give', title: 'Give', text: 'Support programmes, welfare and outreach.', icon: 'volunteer_activism', image: null },
            ]}
          />
        </div>
      </section>

      <Pillars />

      {/* One Household, many fellowships */}
      <section aria-labelledby="fellowships-title" className="section overflow-hidden">
        <div className="container-page">
          <SectionHeader
            id="fellowships-title"
            eyebrow="Find your family"
            title="One Household, *many fellowships*"
            lead="Every registered Protestant fellowship and Christian group at FUTA belongs to JCCF. Find one that meets on your day and near your hostel."
            action={<LinkButton href="/fellowships" variant="outlined" trailingIcon="arrow_forward">See all fellowships</LinkButton>}
          />
          <Carousel label="Fellowships" trackClassName="auto-cols-[75%] medium:auto-cols-[40%] expanded:auto-cols-[calc((100%-96px)/5)]">
            {fellowships.slice(0, 10).map((f) => (
              <li key={f.slug}><FellowshipPhotoCard f={f} /></li>
            ))}
          </Carousel>
        </div>
        <div className="mt-12">
          <Marquee fellowships={fellowships} />
        </div>
      </section>

      {/* What's next */}
      {(featured || nextThree.length > 0) && (
        <section aria-labelledby="next-title" className="theme-stage section">
          <div className="container-page">
            <SectionHeader
              id="next-title"
              tone="stage"
              eyebrow="Household programmes"
              title="What’s *next*"
              lead="During Household programmes every fellowship suspends its meetings and we gather as one."
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
        title={'One Household.\n*One faith.*'}
        body="Every combined service, every fellowship suspends its meeting and we gather as one — because Christ is the head of one body."
        action={<LinkButton href="/about" tone="stage" variant="filled-inverse" trailingIcon="arrow_forward">Our story</LinkButton>}
      />

      {/* Latest sermons, or the live player when live */}
      {live.live ? (
        <LivePlayer live={live} heading="h2" compactTop />
      ) : (
        <section aria-labelledby="sermons-title" className="section overflow-hidden">
          <div className="container-page">
            <SectionHeader
              id="sermons-title"
              eyebrow="Watch & listen"
              title="Latest *sermons*"
              lead="Straight from the JCCF FUTA YouTube channel. Videos load only when you tap play."
              action={<LinkButton href="/media" variant="outlined" trailingIcon="arrow_forward">All sermons</LinkButton>}
            />
            <Carousel label="Latest sermons" trackClassName="auto-cols-[85%] medium:auto-cols-[calc((100%-24px)/2)] expanded:auto-cols-[calc((100%-48px)/3)]">
              {videos.slice(0, 6).map((v) => <li key={v.id}><SermonCard v={v} /></li>)}
            </Carousel>
            <p className="mt-6 text-body-md text-on-surface-variant">
              <a href={youtubeUrls.subscribe} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline-offset-4 hover:underline">Subscribe on YouTube</a> to get notified when we go live.
            </p>
          </div>
        </section>
      )}

      {/* President */}
      <section aria-label="Household President" className="theme-stage section">
        <div className="container-page">
          <PresidentSplit president={president} />
        </div>
      </section>

      <GiveBand give={give} enabled={integrations.paystack} />

      {/* Newsletter + Instagram */}
      <section aria-label="Stay connected" className="section pt-0">
        {hasInstagram ? (
          <div className="container-page grid gap-10 expanded:grid-cols-12">
            <NewsletterCard source="home" whatsapp={settings.whatsappChannel} className="expanded:col-span-7" />
            <div className="expanded:col-span-5">
              <InstagramStrip settings={settings} />
            </div>
          </div>
        ) : (
          <div className="container-page">
            <NewsletterCard source="home" whatsapp={settings.whatsappChannel} wide />
          </div>
        )}
      </section>
    </>
  );
}
