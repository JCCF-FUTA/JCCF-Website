import { formatLongDate } from '@/lib/format';
import type { Video } from '@/lib/types';
import { cn } from '@/lib/cn';
import { youtubeUrls } from '@/lib/youtube-urls';
import { LiteYouTube } from './LiteYouTube';

/** Sermon video card (DESIGN §C13). */
export function SermonCard({ v, tone = 'light', priority }: { v: Video; tone?: 'light' | 'stage'; priority?: boolean }) {
  return (
    <article className="flex flex-col gap-3">
      <LiteYouTube id={v.id} title={v.title} thumbnail={v.thumbnail} duration={v.duration} sizes="(min-width: 840px) 33vw, (min-width: 600px) 50vw, 85vw" priority={priority} className="rounded-lg" />
      <div>
        <h3 className="line-clamp-2 text-title-md font-semibold">
          <a href={youtubeUrls.watch(v.id)} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">{v.title}</a>
        </h3>
        <p className={cn('mt-1 text-body-sm', tone === 'stage' ? 'text-on-stage-variant' : 'text-on-surface-variant')}>
          {[v.published && formatLongDate(v.published), v.series].filter(Boolean).join(' · ')}
        </p>
      </div>
    </article>
  );
}
