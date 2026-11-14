'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import { StatusChip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';

type Props = {
  title: string;
  href?: string;
  start: string;
  end?: string;
  /** "Sun 14 Feb 2027 · 4:00 PM · Chapel of Faith" — always shown next to the countdown */
  dateLine: string;
  /** Server time at render, so the first client render matches the HTML */
  now: number;
  variant?: 'stage' | 'light' | 'chip';
  live?: boolean;
  /** Hide the title (when the card around it already shows it); the date line stays. */
  hideTitle?: boolean;
  className?: string;
};

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Countdown to a programme (DESIGN §C06). */
export function Countdown({ title, href, start, end, dateLine, now: serverNow, variant = 'stage', live, hideTitle, className }: Props) {
  const [now, setNow] = useState(serverNow);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const startMs = new Date(start).getTime();
  const endMs = end ? new Date(end).getTime() : startMs + 3 * 3_600_000;
  const left = startMs - now;
  const running = left <= 0 && now < endMs;
  const ended = now >= endMs;
  const soon = left > 0 && left < 3_600_000;
  const t = parts(left);

  if (variant === 'chip') {
    if (ended) return null;
    if (live) return <StatusChip kind="live">Live now</StatusChip>;
    if (running) return <StatusChip kind="soon">Happening now</StatusChip>;
    const days = Math.ceil(left / 86_400_000);
    return <StatusChip kind={soon ? 'soon' : 'image'} icon="schedule">{soon ? 'Starting soon' : days <= 1 ? 'Tomorrow' : `In ${days} days`}</StatusChip>;
  }

  if (ended) return null;
  const stage = variant === 'stage';

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex flex-wrap items-center gap-2">
        {live ? (
          <StatusChip kind="live">Live now</StatusChip>
        ) : running ? (
          <StatusChip kind="soon">Happening now</StatusChip>
        ) : soon ? (
          <StatusChip kind="soon">Starting soon</StatusChip>
        ) : (
          <span className={cn('text-label-md font-semibold uppercase', stage ? 'text-on-stage-variant' : 'text-on-surface-variant')}>Next programme</span>
        )}
      </div>
      <div>
        {hideTitle ? null : href ? (
          <Link href={href} className="text-title-lg font-semibold transition-opacity hover:opacity-80">{title}</Link>
        ) : (
          <p className="text-title-lg font-semibold">{title}</p>
        )}
        <p className={cn('mt-1 flex items-start gap-1.5 text-body-md', stage ? 'text-on-stage-variant' : 'text-on-surface-variant')}>
          <Icon name="calendar_month" size={20} className="shrink-0" /> {dateLine}
        </p>
      </div>

      {live || running ? (
        <Link
          href={live ? '/media#live' : href ?? '/programmes'}
          className="inline-flex h-12 items-center gap-2 self-start rounded-full bg-white px-6 text-label-lg font-semibold text-stage"
        >
          {live && <span className="size-2 rounded-full bg-live animate-live-pulse" aria-hidden="true" />}
          {live ? 'Watch the live service' : 'See programme details'}
        </Link>
      ) : (
        <>
          <p className="sr-only">{title} starts {dateLine}.</p>
          <div className="flex items-start gap-1 medium:gap-2" aria-hidden="true">
            {([['d', 'Days'], ['h', 'Hrs'], ['m', 'Min'], ['s', 'Sec']] as const).map(([k, label], i) => (
              <div key={k} className="flex items-start gap-1 medium:gap-2">
                {i > 0 && <span className={cn('font-display text-display-sm leading-[1.1]', stage ? 'text-glow' : 'text-tertiary')}>:</span>}
                <div className="flex min-w-[3.25rem] flex-col items-center">
                  <span className="relative block h-[2.5rem] overflow-hidden font-display text-display-sm leading-[1.12] tabular-nums">
                    <span key={t[k]} className="block animate-[digit-in_250ms_cubic-bezier(.05,.7,.1,1)_both]">{k === 'd' ? t.d : pad(t[k])}</span>
                  </span>
                  <span className={cn('mt-1 text-label-sm font-semibold uppercase', stage ? 'text-on-stage-variant' : 'text-on-surface-variant')}>{label}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
