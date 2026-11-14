import type { Metadata } from 'next';
import Link from 'next/link';
import { getFeaturedProgramme, getPastProgrammes, getUpcomingProgrammes } from '@/lib/data';
import { OTHER_PROGRAMMES } from '@/lib/content/seed';
import { formatDate } from '@/lib/format';
import { FeaturedProgramme, ProgrammeCard, calendarHref } from '@/components/programmes/ProgrammeCard';
import { Icon } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Tabs } from '@/components/ui/Tabs';
import type { Programme } from '@/lib/types';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Programmes',
  description: 'JCCF FUTA calendar 2026/27: Workers’ Retreat, Freshers’ Orientation, Pulpit Rotation, Prayer and Prophetic Week, Teaching Week, Handover Service and FUTA Prays.',
};

const isFutaPrays = (p: Programme) => p.kind === 'FUTA Prays';

function Grid({ items, now, empty }: { items: Programme[]; now: number; empty: string }) {
  if (!items.length) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-outline-variant px-6 py-16 text-center">
        <Icon name="event" size={40} className="text-on-surface-variant" />
        <p className="text-title-md font-semibold">{empty}</p>
      </div>
    );
  }
  return (
    <ul className="grid gap-6 medium:grid-cols-2 expanded:grid-cols-3">
      {items.map((p) => <li key={p.slug}><ProgrammeCard p={p} now={now} /></li>)}
    </ul>
  );
}

export default async function ProgrammesPage() {
  const now = Date.now();
  const [featured, upcoming, past] = await Promise.all([
    getFeaturedProgramme(now), getUpcomingProgrammes(now), getPastProgrammes(now),
  ]);
  const prays = [...past.filter(isFutaPrays).reverse(), ...upcoming.filter(isFutaPrays)];
  const nextPrays = upcoming.find(isFutaPrays);

  return (
    <>
      <PageHero
        crumb="Programmes"
        title="Household programmes"
        intro="The JCCF calendar for the 2026/27 session. When the Household gathers, every fellowship suspends its own meeting and we meet together."
      />
      {featured && (
        <section aria-label="Featured programme" className="theme-stage pb-16 expanded:pb-24">
          <div className="container-page"><FeaturedProgramme p={featured} now={now} /></div>
        </section>
      )}

      <section aria-label="All programmes" className="section">
        <div className="container-page">
          <Tabs
            tabs={[
              { label: 'Upcoming', count: upcoming.filter((p) => !isFutaPrays(p)).length, panel: <Grid items={upcoming.filter((p) => !isFutaPrays(p))} now={now} empty="No upcoming programmes yet. Check back soon." /> },
              { label: 'Past', count: past.filter((p) => !isFutaPrays(p)).length, panel: <Grid items={past.filter((p) => !isFutaPrays(p))} now={now} empty="No past programmes yet." /> },
            ]}
          />
        </div>
      </section>

      {prays.length > 0 && (
        <section aria-labelledby="futa-prays" className="section bg-surface-container-low">
          <div className="container-page grid gap-10 expanded:grid-cols-12">
            <div className="expanded:col-span-5">
              <SectionHeader
                id="futa-prays"
                title="FUTA Prays"
                lead="The Household prays together for the Federal University of Technology, Akure: its students, staff and management. Times and venues are announced before each date."
                className="mb-0"
              />
            </div>
            <ol className="divide-y divide-outline-variant border-y border-outline-variant expanded:col-span-7">
              {prays.map((p) => {
                const done = new Date(p.end ?? p.start).getTime() < now;
                const next = p.slug === nextPrays?.slug;
                return (
                  <li key={p.slug} className="flex min-h-16 items-center gap-4 py-3">
                    <Link href={`/programmes/${p.slug}`} className={`flex-1 text-title-md font-semibold transition-colors hover:text-primary ${done ? 'text-on-surface-variant' : ''}`}>
                      {formatDate(p.start)}
                    </Link>
                    {done ? (
                      <span className="text-body-md text-on-surface-variant">Past</span>
                    ) : (
                      <>
                        {next && <span className="rounded-full bg-primary-container px-3 py-1 text-label-md font-semibold uppercase text-on-primary-container">Next</span>}
                        <a href={calendarHref(p)} aria-label={`Add FUTA Prays on ${formatDate(p.start)} to your calendar`}
                          className="state-layer inline-flex size-12 items-center justify-center rounded-full text-primary">
                          <Icon name="event" />
                        </a>
                      </>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      )}

      <section aria-labelledby="other-programmes" className="section">
        <div className="container-page grid gap-10 expanded:grid-cols-12">
          <div className="expanded:col-span-5">
            <SectionHeader id="other-programmes" title="Other programmes" lead="These run through the session without fixed dates on the calendar." className="mb-0" />
          </div>
          <dl className="divide-y divide-outline-variant border-y border-outline-variant expanded:col-span-7">
            {OTHER_PROGRAMMES.map((o) => (
              <div key={o.title} className="grid gap-1 py-5 medium:grid-cols-[14rem_1fr] medium:gap-6">
                <dt className="text-title-md font-semibold">{o.title}</dt>
                <dd className="text-body-lg text-on-surface-variant">{o.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
