import { cn } from '@/lib/cn';
import type { Tone } from './Button';
import { Eyebrow } from './Eyebrow';
import { Title } from './Title';

/** Eyebrow · display title with one highlighted word · optional lead · optional action (DESIGN §C09). */
export function SectionHeader({
  eyebrow,
  title,
  lead,
  action,
  tone = 'light',
  align = 'left',
  className,
  id,
}: {
  eyebrow?: string;
  title: string;
  lead?: React.ReactNode;
  action?: React.ReactNode;
  tone?: Tone;
  align?: 'left' | 'center';
  className?: string;
  id?: string;
}) {
  return (
    <div
      className={cn(
        'mb-10 flex flex-col gap-6 expanded:mb-14',
        align === 'center' ? 'items-center text-center' : 'expanded:flex-row expanded:items-end expanded:justify-between',
        className,
      )}
    >
      <div className={cn('flex flex-col gap-4', align === 'center' ? 'items-center' : 'items-start')}>
        {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
        <Title text={title} tone={tone} id={id} />
        {lead && (
          <p data-reveal="up" className={cn('max-w-[56ch] text-body-lg', tone === 'stage' ? 'text-on-stage-variant' : 'text-on-surface-variant')}>
            {lead}
          </p>
        )}
      </div>
      {action && <div className="shrink-0" data-reveal="up">{action}</div>}
    </div>
  );
}
