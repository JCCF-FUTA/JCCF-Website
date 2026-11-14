import Image from 'next/image';
import type { Leader } from '@/lib/types';
import { LinkButton } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';

/** President split on stage (DESIGN §C15). */
export function PresidentSplit({ president, showLink = true, heading: H = 'h2' }: { president?: Leader; showLink?: boolean; heading?: 'h2' | 'h3' }) {
  if (!president) return null;
  return (
    <div className="grid items-center gap-10 expanded:grid-cols-12 expanded:gap-16">
      <div className="portrait relative aspect-[4/5] overflow-hidden rounded-xl expanded:col-span-5" data-reveal="image">
        {president.photo?.url ? (
          <Image src={president.photo.url} alt={president.photo.alt || `Portrait of ${president.name}`} fill sizes="(min-width: 840px) 40vw, 100vw" className="object-cover" />
        ) : (
          <div className="tile-brand absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <Icon name="person" size={48} className="scale-[2.5] text-white/20" />
          </div>
        )}
      </div>
      <div className="flex flex-col items-start gap-5 expanded:col-span-7">
        <div className="flex items-center gap-2">
          <p className="text-label-md font-semibold uppercase text-stage-accent-text">Household President</p>
          {president.placeholder && <StatusChip kind="stage-dashed">Sample</StatusChip>}
        </div>
        <H className={`font-display text-display-sm uppercase ${president.placeholder ? 'opacity-70' : ''}`}>{president.name}</H>
        <p className="text-body-lg text-on-stage-variant">
          {[president.office, president.department, president.level].filter(Boolean).join(' · ')}
        </p>
        {president.quote && (
          <blockquote className="border-l-4 border-stage-accent pl-5 text-[1.125rem] leading-8 text-on-stage" data-reveal="up">
            “{president.quote}”
          </blockquote>
        )}
        {showLink && <LinkButton href="/leadership" tone="stage" variant="outlined" trailingIcon="arrow_forward">Meet the executive</LinkButton>}
      </div>
    </div>
  );
}
