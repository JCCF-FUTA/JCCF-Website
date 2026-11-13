import { cn } from '@/lib/cn';
import { Icon } from './Icon';

export type ChipStatus = 'upcoming' | 'live' | 'past' | 'new' | 'soon' | 'neutral' | 'placeholder' | 'image' | 'stage' | 'stage-dashed';

const status: Record<ChipStatus, string> = {
  upcoming: 'bg-surface-container-high text-on-surface',
  live: 'bg-live text-white',
  past: 'bg-surface-container text-on-surface-variant',
  new: 'bg-tertiary-container text-on-tertiary-container',
  soon: 'bg-tertiary-container text-on-tertiary-container',
  neutral: 'bg-surface-container text-on-surface-variant',
  placeholder: 'border border-dashed border-outline text-on-surface-variant',
  /** on top of a photo */
  image: 'bg-black/60 text-white backdrop-blur',
  /** on a dark stage section */
  stage: 'bg-white/10 text-on-stage',
  'stage-dashed': 'border border-dashed border-stage-outline text-on-stage-variant',
};

/** Status chip / badge (DESIGN §C20). Not interactive. */
export function StatusChip({ kind = 'neutral', children, className, icon }: { kind?: ChipStatus; children: React.ReactNode; className?: string; icon?: string }) {
  return (
    <span className={cn('inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-label-md font-semibold uppercase', status[kind], className)}>
      {kind === 'live' && <span className="size-1.5 rounded-full bg-white animate-live-pulse" aria-hidden="true" />}
      {icon && <Icon name={icon} size={16} />}
      {children}
    </span>
  );
}

/** Translucent meta badge on images. */
export function MetaBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-label-sm font-semibold uppercase text-white backdrop-blur', className)}>
      {children}
    </span>
  );
}

/** Classes for a selectable filter chip (button or label). */
export function filterChipClasses(selected: boolean) {
  return cn(
    'state-layer relative inline-flex h-8 items-center gap-1.5 rounded-full px-4 text-label-lg font-semibold whitespace-nowrap',
    'before:absolute before:-inset-y-2 before:inset-x-0 before:content-[""]',
    selected ? 'bg-primary-container text-on-primary-container' : 'border border-outline-variant text-on-surface-variant',
  );
}
