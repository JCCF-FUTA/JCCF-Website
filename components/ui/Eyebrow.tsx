import { cn } from '@/lib/cn';
import type { Tone } from './Button';

/** Pill above a title (DESIGN §C03). */
export function Eyebrow({ children, tone = 'light', live, className }: { children: React.ReactNode; tone?: Tone; live?: boolean; className?: string }) {
  return (
    <p
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-label-md font-semibold uppercase',
        tone === 'stage' ? 'border border-stage-outline bg-white/8 text-on-stage-variant' : 'bg-surface-container text-on-surface-variant',
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', live ? 'bg-live animate-live-pulse' : tone === 'stage' ? 'bg-stage-accent' : 'bg-primary')} aria-hidden="true" />
      {children}
    </p>
  );
}
