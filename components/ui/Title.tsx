import { Fragment } from 'react';
import { cn } from '@/lib/cn';
import type { Tone } from './Button';

/** "\n" in a title becomes a line break. */
function lines(s: string) {
  const ls = s.split('\n');
  return ls.map((l, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {l}
    </Fragment>
  ));
}

/**
 * Display title with an optional highlighted phrase marked with *asterisks*: "Till we all come … *of the faith*".
 * The highlight is red only, never underlined. Use it only in the Home hero and the Give card (DESIGN §17).
 */
export function Title({
  text,
  as: Tag = 'h2',
  size = 'display-md',
  tone = 'light',
  className,
  split = true,
  heroItem,
  id,
}: {
  text: string;
  as?: 'h1' | 'h2' | 'h3';
  size?: 'hero' | 'display-lg' | 'display-md' | 'headline-lg' | 'headline-md' | 'headline-sm';
  tone?: Tone;
  className?: string;
  split?: boolean;
  /** Above-the-fold title: animated by CSS at first paint (order index), never hidden waiting for JS */
  heroItem?: number;
  id?: string;
}) {
  const parts = text.split('*');
  const sizeCls = {
    hero: 'text-hero type-hero',
    'display-lg': 'text-display-lg type-display',
    'display-md': 'text-display-md type-display',
    'headline-lg': 'text-headline-lg type-headline',
    'headline-md': 'text-headline-md type-headline',
    'headline-sm': 'text-headline-sm type-headline',
  }[size];
  return (
    <Tag
      id={id}
      className={cn(sizeCls, 'text-balance', className)}
      data-hero-item={heroItem !== undefined ? '' : undefined}
      style={heroItem !== undefined ? ({ '--d': heroItem } as React.CSSProperties) : undefined}
    >
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className={cn('hl', tone === 'stage' ? 'text-stage-accent' : 'text-primary')} data-hl>
            {lines(part)}
          </span>
        ) : (
          <Fragment key={i}>{lines(part)}</Fragment>
        ),
      )}
    </Tag>
  );
}
