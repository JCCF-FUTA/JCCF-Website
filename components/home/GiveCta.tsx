import type { Img } from '@/lib/types';
import { LinkButton } from '@/components/ui/Button';
import { SmartImage } from '@/components/ui/SmartImage';

/**
 * Home → Give. A photo band with a dark overlay and one clear action that goes to /give
 * (the full giving form and bank details live there, not on Home).
 */
export function GiveCta({ image }: { image: Img }) {
  return (
    <section aria-labelledby="home-give-title" className="theme-stage relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10" data-parallax>
        <SmartImage image={image} sizes="100vw" decorative imgClassName="scale-110 object-[50%_40%]" />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/70 to-black/40" aria-hidden="true" />
      <div className="container-page flex min-h-[420px] flex-col items-start justify-center gap-5 py-16 expanded:min-h-[480px]">
        <h2 id="home-give-title" className="type-display max-w-[18ch] text-display-md text-white">Support the work of the Household</h2>
        <p className="max-w-[48ch] text-body-lg text-white">
          Your offering and partnership pay for combined programmes, the welfare of students and outreach on campus. Give online or by bank transfer.
        </p>
        <LinkButton href="/give" size="lg" tone="stage" icon="volunteer_activism" className="mt-2">
          Give to the Household
        </LinkButton>
      </div>
    </section>
  );
}
