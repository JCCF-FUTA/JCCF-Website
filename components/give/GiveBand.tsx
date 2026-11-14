import type { GiveSettings } from '@/lib/types';
import { BankCard } from './BankCard';
import { GiveForm } from './GiveForm';

/**
 * Red Give band (DESIGN §C17): the one large red area on the site. The give card overlaps the band.
 */
export function GiveBand({ give, enabled }: { give: GiveSettings; enabled: boolean }) {
  return (
    <section aria-labelledby="give-band-title" className="relative">
      <div className="theme-brand-red pt-16 pb-28 expanded:pt-24 expanded:pb-40">
        <div className="container-page">
          <h2 id="give-band-title" className="type-display max-w-[20ch] text-display-md text-white">Support the work of the Household</h2>
          <p className="mt-4 max-w-[52ch] text-body-lg text-white">
            Offerings and partnership pay for combined programmes, the welfare of students and outreach on campus.
          </p>
        </div>
      </div>
      <div className="container-page relative -mt-20 grid gap-6 pb-16 expanded:-mt-28 expanded:grid-cols-12 expanded:pb-24">
        <div className="expanded:col-span-7" data-reveal="up">
          <GiveForm give={give} enabled={enabled} headingLevel="h3" />
        </div>
        <div className="expanded:col-span-5 expanded:pt-28" data-reveal="up">
          <BankCard give={give} />
        </div>
      </div>
    </section>
  );
}
