'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import type { Tone } from './Button';
import { IconButton } from './Button';

/**
 * Native scroll-snap carousel with prev/next buttons and a progress bar (DESIGN §C21).
 * Buttons scroll by one card; disabled at the ends; arrow keys scroll when focused.
 */
export function Carousel({
  label,
  children,
  trackClassName,
  tone = 'light',
  controlsClassName,
  pinTrack,
}: {
  label: string;
  children: React.ReactNode;
  trackClassName?: string;
  tone?: Tone;
  controlsClassName?: string;
  /** Also mark the track for the pinned horizontal scroll (M6) on expanded+ */
  pinTrack?: boolean;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const [state, setState] = useState({ start: true, end: false, progress: 0 });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setState({ start: el.scrollLeft <= 4, end: el.scrollLeft >= max - 4, progress: max > 0 ? el.scrollLeft / max : 1 });
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    el?.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el?.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [update]);

  const by = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap || '16') || 16;
    const step = card ? card.offsetWidth + gap : el.clientWidth * 0.8;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * step, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <div>
      <ul
        ref={ref}
        tabIndex={0}
        role="list"
        aria-label={label}
        data-pin-track={pinTrack ? '' : undefined}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); by(1); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); by(-1); }
        }}
        className={cn('snap-row gap-4 medium:gap-6 rounded-xl', trackClassName)}
      >
        {children}
      </ul>
      <div className={cn('mt-6 flex items-center gap-4', controlsClassName)}>
        <div className={cn('h-0.5 flex-1 overflow-hidden rounded-full', tone === 'stage' ? 'bg-white/15' : 'bg-outline-variant')} aria-hidden="true">
          <div
            data-pin-progress={pinTrack ? '' : undefined}
            className={cn('h-full origin-left rounded-full transition-transform duration-200', tone === 'stage' ? 'bg-stage-accent' : 'bg-primary')}
            style={{ transform: `scaleX(${Math.max(0.08, state.progress)})` }}
          />
        </div>
        <div className="flex gap-2" data-carousel-arrows>
          <IconButton icon="arrow_back" label="Previous" variant="outlined" tone={tone} onClick={() => by(-1)} disabled={state.start} />
          <IconButton icon="arrow_forward" label="Next" variant="outlined" tone={tone} onClick={() => by(1)} disabled={state.end} />
        </div>
      </div>
    </div>
  );
}
