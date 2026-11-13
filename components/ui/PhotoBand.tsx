import type { Img } from '@/lib/types';
import { cn } from '@/lib/cn';
import { SmartImage } from './SmartImage';
import { Title } from './Title';

/** Full-bleed photo with red duotone or dark overlay (DESIGN §C16). */
export function PhotoBand({
  image,
  title,
  body,
  action,
  duotone = true,
}: {
  image?: Img | null;
  title: string;
  body: string;
  action?: React.ReactNode;
  duotone?: boolean;
}) {
  return (
    <section className="theme-stage relative isolate flex min-h-[480px] items-center overflow-hidden expanded:min-h-[560px]">
      <div className={cn('absolute inset-0 -z-10', duotone && 'duotone-red')} data-parallax>
        <SmartImage image={image} sizes="100vw" decorative imgClassName="scale-110" />
      </div>
      {!duotone && <div className="overlay-stage absolute inset-0 -z-10" aria-hidden="true" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/50 to-transparent" aria-hidden="true" />
      <div className="container-page flex flex-col items-start gap-5 py-16">
        <Title text={title} tone="stage" className="max-w-[16ch] [&_[data-hl]]:text-white" />
        <p data-reveal="up" className="max-w-[48ch] text-body-lg text-white/90">{body}</p>
        {action && <div data-reveal="up">{action}</div>}
      </div>
    </section>
  );
}
