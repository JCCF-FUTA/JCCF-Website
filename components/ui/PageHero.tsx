import Link from 'next/link';
import { PHOTOS } from '@/lib/content/seed';
import type { Img } from '@/lib/types';
import { Icon } from './Icon';
import { SmartImage } from './SmartImage';
import { Title } from './Title';

/** Inner page hero on stage (DESIGN §C28). */
export function PageHero({
  title,
  intro,
  crumb,
  image,
  actions,
  compact,
}: {
  title: string;
  intro?: React.ReactNode;
  crumb: string;
  image?: Img | null;
  actions?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <section className="theme-stage relative isolate flex overflow-hidden" style={{ minHeight: compact ? 'max(300px, 40svh)' : 'max(360px, 50svh)' }}>
      <div className="absolute inset-0 -z-10" data-parallax>
        <SmartImage image={image ?? { ...PHOTOS.stage, alt: '' }} sizes="100vw" priority decorative imgClassName="scale-110" />
      </div>
      <div className="overlay-stage absolute inset-0 -z-10" aria-hidden="true" />
      <div className="container-page flex flex-col justify-end gap-5 pt-32 pb-12 expanded:pb-16">
        <nav aria-label="Breadcrumb" data-hero-item style={{ '--d': 0 } as React.CSSProperties}>
          <ol className="flex items-center gap-1.5 text-label-md font-semibold uppercase text-on-stage-variant">
            <li><Link href="/" className="inline-flex min-h-12 items-center hover:text-on-stage">Home</Link></li>
            <li aria-hidden="true"><Icon name="arrow_forward" size={16} /></li>
            <li aria-current="page" className="text-on-stage">{crumb}</li>
          </ol>
        </nav>
        <Title text={title} as="h1" size="display-lg" tone="stage" className="max-w-[18ch]" heroItem={1} />
        {intro && <div data-hero-item style={{ '--d': 2 } as React.CSSProperties} className="max-w-[60ch] text-body-lg text-on-stage-variant">{intro}</div>}
        {actions && <div data-hero-item style={{ '--d': 3 } as React.CSSProperties} className="flex flex-wrap gap-3">{actions}</div>}
      </div>
    </section>
  );
}
