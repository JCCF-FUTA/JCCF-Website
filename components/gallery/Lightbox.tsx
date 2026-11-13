'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { GalleryAlbum } from '@/lib/types';
import { Icon } from '@/components/ui/Icon';

/** Album grid + lightbox (DESIGN §C29): swipe, keyboard arrows, Esc, captions. */
export function AlbumGallery({ album }: { album: GalleryAlbum }) {
  const [index, setIndex] = useState<number | null>(null);
  const ref = useRef<HTMLDialogElement>(null);
  const touch = useRef<number | null>(null);
  const n = album.images.length;
  const go = (d: number) => setIndex((i) => (i === null ? i : (i + d + n) % n));

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  const img = index !== null ? album.images[index] : null;
  return (
    <>
      <ul className="columns-2 gap-3 medium:columns-3 expanded:columns-4">
        {album.images.map((im, i) => (
          <li key={`${im.url}-${i}`} className="mb-3 break-inside-avoid">
            <button type="button" onClick={() => setIndex(i)} className="group relative block w-full overflow-hidden rounded-lg" aria-label={`Open photo: ${im.alt || `${album.title} ${i + 1}`}`}>
              <Image src={im.url} alt={im.alt} width={im.width ?? 1280} height={im.height ?? 720} sizes="(min-width: 840px) 25vw, 50vw" loading="lazy"
                placeholder={im.lqip ? 'blur' : 'empty'} blurDataURL={im.lqip} className="h-auto w-full transition-transform duration-500 group-hover:scale-105" />
            </button>
          </li>
        ))}
      </ul>
      <dialog
        ref={ref}
        onClose={() => setIndex(null)}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); }}
        onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touch.current === null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          touch.current = null;
        }}
        aria-label={`${album.title} photos`}
        data-lenis-prevent
        className="m-0 h-dvh max-h-none w-full max-w-none bg-black/95 p-0 text-white backdrop:bg-black/80"
      >
        {img && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between p-2">
              <p className="px-3 text-body-md tabular-nums text-white/80">{(index ?? 0) + 1} / {n}</p>
              <button type="button" onClick={() => setIndex(null)} aria-label="Close" className="inline-flex size-12 items-center justify-center rounded-full hover:bg-white/10"><Icon name="close" /></button>
            </div>
            <figure className="relative flex flex-1 flex-col items-center justify-center px-2">
              <div className="relative h-full w-full">
                <Image src={img.url} alt={img.alt} fill sizes="100vw" className="object-contain" />
              </div>
              {img.alt && <figcaption className="p-4 text-center text-body-md text-white/85">{img.alt}</figcaption>}
            </figure>
            <div className="flex justify-center gap-4 p-4">
              <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="inline-flex size-12 items-center justify-center rounded-full border border-white/25 hover:bg-white/10"><Icon name="arrow_back" /></button>
              <button type="button" onClick={() => go(1)} aria-label="Next photo" className="inline-flex size-12 items-center justify-center rounded-full border border-white/25 hover:bg-white/10"><Icon name="arrow_forward" /></button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
