import type { Img } from '@/lib/types';
import { SmartImage } from './SmartImage';

/**
 * Full-bleed photo band with a dark overlay (DESIGN §C16). The red duotone option was removed by the
 * anti-slop audit: red stays under ~10% of a screen everywhere except the Give band.
 */
export function PhotoBand({ image, title, cite, body, action }: { image?: Img | null; title: string; cite?: string; body: string; action?: React.ReactNode }) {
  return (
    <section className="theme-stage relative isolate flex min-h-[440px] items-center overflow-hidden expanded:min-h-[520px]">
      <div className="absolute inset-0 -z-10" data-parallax>
        <SmartImage image={image} sizes="100vw" decorative imgClassName="scale-110" />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/65 to-black/30" aria-hidden="true" />
      <figure className="container-page flex flex-col items-start gap-5 py-16">
        <blockquote>
          <p className="type-display max-w-[16ch] text-display-md text-white">“{title}”</p>
        </blockquote>
        {cite && <figcaption className="text-label-md font-semibold uppercase text-white">{cite}</figcaption>}
        <p data-reveal="up" className="max-w-[48ch] text-body-lg text-white">{body}</p>
        {action && <div data-reveal="up">{action}</div>}
      </figure>
    </section>
  );
}
