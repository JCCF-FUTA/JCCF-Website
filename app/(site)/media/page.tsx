import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/data';
import { getLiveStatus } from '@/lib/live';
import { getLatestVideos, getPlaylists, getPlaylistVideos } from '@/lib/youtube';
import { youtubeUrls } from '@/lib/youtube-urls';
import { PHOTOS } from '@/lib/content/seed';
import { LivePlayer } from '@/components/media/LivePlayer';
import { MediaGrid } from '@/components/media/MediaGrid';
import { Brand } from '@/components/ui/Brand';
import { LinkButton } from '@/components/ui/Button';
import { PageHero } from '@/components/ui/PageHero';

export const revalidate = 900;

export const metadata: Metadata = {
  title: 'Sermons & live',
  description: 'Watch JCCF FUTA live and catch up on recent sermons, teaching weeks and prayer meetings from the Household.',
};

export default async function MediaPage() {
  const settings = await getSiteSettings();
  const [live, videos, playlists] = await Promise.all([getLiveStatus(), getLatestVideos(48, settings.pinnedVideoId), getPlaylists()]);

  // With the Data API, series come from YouTube playlists (admins group videos there, PRD F3).
  if (playlists.length) {
    const lists = await Promise.all(playlists.slice(0, 8).map(async (pl) => ({ pl, items: await getPlaylistVideos(pl.id, 50) })));
    const byVideo = new Map<string, string>();
    lists.forEach(({ pl, items }) => items.forEach((v) => !byVideo.has(v.id) && byVideo.set(v.id, pl.title)));
    videos.forEach((v) => { v.series = byVideo.get(v.id) ?? v.series; });
  }

  return (
    <>
      {live.live ? (
        <LivePlayer live={live} />
      ) : (
        <PageHero
          crumb="Media"
          title="Sermons and live services"
          image={videos[0] ? { url: videos[0].thumbnail, alt: '' } : { ...PHOTOS.stage, alt: '' }}
          intro="Services, teaching weeks and prayer meetings from the Household. A video loads only when you tap play, to save your data."
          actions={<LinkButton href={youtubeUrls.subscribe} tone="stage" variant="outlined"><span className="inline-flex items-center gap-2"><Brand name="youtube" /> Subscribe on YouTube</span></LinkButton>}
        />
      )}

      <section aria-label="Sermons" className="section">
        <div className="container-page">
          <MediaGrid videos={videos} />
        </div>
      </section>

      <section className="theme-stage">
        <div className="container-page flex flex-col items-start gap-6 py-16 expanded:flex-row expanded:items-center expanded:justify-between">
          <div className="flex items-center gap-5">
            <span className="inline-flex size-16 shrink-0 items-center justify-center rounded-full bg-live text-white"><Brand name="youtube" size={32} /></span>
            <div>
              <p className="font-display text-headline-lg uppercase">Never miss a service</p>
              <p className="text-body-lg text-on-stage-variant">Subscribe to <span className="text-on-stage">@jccf_futa</span> and turn on notifications to know when we go live.</p>
            </div>
          </div>
          <LinkButton href={youtubeUrls.subscribe} tone="stage" variant="filled-inverse" trailingIcon="north_east">Subscribe</LinkButton>
        </div>
      </section>
    </>
  );
}
