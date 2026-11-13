'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/cn';
import { youtubeUrls } from '@/lib/youtube-urls';
import { Icon } from '@/components/ui/Icon';

/**
 * Lite embed: a thumbnail and a play button. The YouTube iframe only loads after a tap (saves data, DESIGN §C13).
 */
export function LiteYouTube({
  id, title, thumbnail, sizes, priority, className, badge, duration, live,
}: {
  id: string; title: string; thumbnail?: string; sizes: string; priority?: boolean; className?: string;
  badge?: React.ReactNode; duration?: string; live?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className={cn('relative aspect-video overflow-hidden bg-stage', className)}>
      {playing ? (
        <iframe
          src={youtubeUrls.embed(id)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 size-full"
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group/play absolute inset-0 size-full" aria-label={`Play: ${title}`}>
          <Image
            src={thumbnail ?? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
            alt=""
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-500 ease-standard group-hover/play:scale-105"
          />
          <span className="absolute inset-0 bg-black/10 transition-colors group-hover/play:bg-black/25" aria-hidden="true" />
          <span className="absolute inset-0 m-auto inline-flex size-14 items-center justify-center rounded-full bg-white/90 text-stage shadow-elev-2 transition-transform duration-300 group-hover/play:scale-110">
            <Icon name="play_arrow" filled size={32} />
          </span>
          {live && (
            <span className="absolute left-3 top-3 inline-flex h-7 items-center gap-1.5 rounded-full bg-live px-3 text-label-md font-semibold uppercase text-white">
              <span className="size-1.5 rounded-full bg-white animate-live-pulse" aria-hidden="true" /> Live
            </span>
          )}
          {duration && <span className="absolute bottom-2 right-2 rounded-xs bg-black/75 px-1.5 py-0.5 text-label-sm font-semibold text-white tabular-nums">{duration}</span>}
          {badge}
        </button>
      )}
    </div>
  );
}
