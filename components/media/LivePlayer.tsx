import type { LiveStatus } from '@/lib/types';
import { youtubeUrls } from '@/lib/youtube-urls';
import { LinkButton } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { LiteYouTube } from './LiteYouTube';

/** Live player on stage (DESIGN §C14). */
export function LivePlayer({ live, heading: H = 'h1', compactTop }: { live: LiveStatus; heading?: 'h1' | 'h2'; compactTop?: boolean }) {
  const share = `https://wa.me/?text=${encodeURIComponent(`JCCF FUTA is live now: ${live.videoId ? youtubeUrls.watch(live.videoId) : youtubeUrls.live}`)}`;
  return (
    <section id="live" className="theme-stage scroll-mt-24">
      <div className={compactTop ? 'container-page section' : 'container-page pt-28 pb-16 expanded:pt-32 expanded:pb-24'}>
        <div className="grid gap-8 expanded:grid-cols-12 expanded:items-center">
          <div className="expanded:col-span-8">
            {live.videoId ? (
              <LiteYouTube id={live.videoId} title={live.title ?? 'JCCF FUTA live'} thumbnail={`https://i.ytimg.com/vi/${live.videoId}/hqdefault_live.jpg`} sizes="(min-width: 840px) 66vw, 100vw" priority live className="rounded-xl" />
            ) : (
              <a href={youtubeUrls.live} target="_blank" rel="noopener noreferrer" className="tile-brand flex aspect-video items-center justify-center rounded-xl text-title-lg font-semibold">
                Open the live stream on YouTube
              </a>
            )}
          </div>
          <div className="flex flex-col items-start gap-5 expanded:col-span-4">
            <Eyebrow tone="stage" live>We are live</Eyebrow>
            <H className="font-display text-headline-lg uppercase">{live.title ?? 'JCCF FUTA live service'}</H>
            <p className="text-body-lg text-on-stage-variant">Join the Household from your hostel. Tap play to watch here, or open the stream on YouTube to chat.</p>
            <div className="flex flex-wrap gap-3">
              <LinkButton href={live.videoId ? youtubeUrls.watch(live.videoId) : youtubeUrls.live} tone="stage" variant="filled-inverse" icon="open_in_new">Open on YouTube</LinkButton>
              <LinkButton href={share} tone="stage" variant="outlined" icon="share">Share</LinkButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
