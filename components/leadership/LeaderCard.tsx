import Image from 'next/image';
import type { Leader } from '@/lib/types';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/Icon';

/** Leader card (DESIGN §C15): B&W portrait → colour on hover / in view. */
export function LeaderCard({ l, tone = 'light' }: { l: Leader; tone?: 'light' | 'stage' }) {
  const stage = tone === 'stage';
  return (
    <article className="group flex flex-col gap-3">
      <div className={cn('portrait relative aspect-[4/5] overflow-hidden rounded-lg', stage ? 'bg-stage-container' : 'bg-surface-container-high')}>
        {l.photo?.url ? (
          <Image src={l.photo.url} alt={l.photo.alt || `Portrait of ${l.name}`} fill sizes="(min-width: 840px) 25vw, (min-width: 600px) 33vw, 50vw" className="object-cover" placeholder={l.photo.lqip ? 'blur' : 'empty'} blurDataURL={l.photo.lqip} />
        ) : (
          <div className={cn('absolute inset-0 flex items-center justify-center', stage ? 'tile-brand' : 'bg-gradient-to-br from-surface-container-high to-surface-container-highest')} aria-hidden="true">
            <Icon name="person" size={48} className={stage ? 'text-white/30' : 'text-on-surface-variant/40'} />
          </div>
        )}
      </div>
      <div>
        <p className={cn('text-label-md font-semibold uppercase', stage ? 'text-stage-accent-text' : 'text-primary')}>{l.office}</p>
        <h3 className={cn('mt-1 text-title-md font-semibold', l.placeholder && 'italic opacity-70')}>{l.name}</h3>
        {(l.department || l.level) && (
          <p className={cn('text-body-sm', stage ? 'text-on-stage-variant' : 'text-on-surface-variant')}>{[l.department, l.level].filter(Boolean).join(' · ')}</p>
        )}
      </div>
    </article>
  );
}
