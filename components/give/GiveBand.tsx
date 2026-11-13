import type { GiveSettings } from '@/lib/types';
import { BankCard } from './BankCard';
import { GiveForm } from './GiveForm';

/**
 * Red Give band (DESIGN §C17): the one large red area. The give card rises over the band top (M13).
 */
export function GiveBand({ give, enabled }: { give: GiveSettings; enabled: boolean }) {
  return (
    <section aria-label="Give" className="relative">
      <div className="theme-brand-red relative overflow-hidden pt-16 pb-28 expanded:pt-24 expanded:pb-40">
        <DoveLines />
        <div className="container-page relative text-center">
          <p className="text-label-md font-semibold uppercase text-white/80">Give</p>
          <p className="mx-auto mt-3 max-w-[22ch] font-display text-display-md uppercase">Every gift builds one Household</p>
          <p className="mx-auto mt-4 max-w-[52ch] text-body-lg text-white/85">
            Offerings and partnership fund combined programmes, the welfare of students and outreach on campus.
          </p>
        </div>
      </div>
      <div className="container-page relative -mt-20 grid gap-6 pb-16 expanded:-mt-28 expanded:grid-cols-12 expanded:pb-24">
        <div className="expanded:col-span-7" data-reveal="up">
          <GiveForm give={give} enabled={enabled} />
        </div>
        <div className="expanded:col-span-5 expanded:pt-28" data-reveal="up">
          <BankCard give={give} />
        </div>
      </div>
    </section>
  );
}

/** Faint dove/olive line illustration, white at 12% (decorative). */
function DoveLines() {
  return (
    <svg aria-hidden="true" viewBox="0 0 600 400" className="pointer-events-none absolute -right-20 -top-10 h-[130%] text-white/12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M90 250c60-10 110-40 150-90 20 40 60 60 110 60-30 30-80 50-140 50 40 20 90 20 140 0-50 50-130 70-200 40-30 20-50 30-60 30" />
      <path d="M240 160c-10-50 10-100 60-130-5 40 5 80 40 110" />
      <path d="M350 220c40-10 80-30 110-70m-60 20c20 0 40-10 55-25m-35 45c25 5 50 0 70-15" />
      <circle cx="300" cy="200" r="180" />
      <circle cx="300" cy="200" r="150" />
    </svg>
  );
}
