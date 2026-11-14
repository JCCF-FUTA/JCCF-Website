import type { Metadata } from 'next';
import { getLeaders } from '@/lib/data';
import type { Leader } from '@/lib/types';
import { LeaderCard } from '@/components/leadership/LeaderCard';
import { PresidentSplit } from '@/components/leadership/PresidentSplit';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Leadership',
  description: 'The current Household Executive, unit coordinators, staff advisers and patrons of JCCF FUTA.',
};

function Grid({ leaders, tone = 'light' }: { leaders: Leader[]; tone?: 'light' | 'stage' }) {
  return (
    <ul data-reveal-stagger className="grid grid-cols-2 gap-x-4 gap-y-8 medium:grid-cols-3 expanded:grid-cols-4 expanded:gap-x-6">
      {leaders.map((l) => <li key={`${l.office}-${l.name}`}><LeaderCard l={l} tone={tone} /></li>)}
    </ul>
  );
}

export default async function LeadershipPage() {
  const leaders = await getLeaders();
  const exec = leaders.filter((l) => l.group === 'executive');
  const president = exec.find((l) => l.order === 1);
  const units = leaders.filter((l) => l.group === 'unit');
  const advisers = leaders.filter((l) => l.group === 'adviser');

  return (
    <>
      <PageHero
        crumb="Leadership"
        title="Leadership"
        intro="The Household Executive is chosen prayerfully each session from final-year students of FUTA, nominated by their fellowships and approved by the Committee of Presidents."
      />

      {president && (
        <section aria-label="Household President" className="theme-stage section pt-12">
          <div className="container-page">
            <PresidentSplit president={president} showLink={false} />
          </div>
        </section>
      )}

      <section aria-labelledby="exec-title" className="section">
        <div className="container-page">
          <SectionHeader id="exec-title" title="Household Executive" lead="Each officer reports to the President and gives a report at the end of every semester." />
          {exec.length ? (
            <Grid leaders={exec.filter((l) => l !== president)} />
          ) : (
            <p className="max-w-prose rounded-xl border border-dashed border-outline-variant p-6 text-body-lg text-on-surface-variant">
              The current Household Executive will be listed here with their offices, departments and photos once the names are confirmed.
            </p>
          )}
        </div>
      </section>

      {units.length > 0 && (
        <section aria-labelledby="units-title" className="section bg-surface-container-low">
          <div className="container-page">
            <SectionHeader id="units-title" title="Unit coordinators" lead="They lead the choir, drama and ushering units with coordinators from member fellowships." />
            <Grid leaders={units} />
          </div>
        </section>
      )}

      {advisers.length > 0 && (
        <section aria-labelledby="advisers-title" className="section">
          <div className="container-page">
            <SectionHeader id="advisers-title" title="Staff advisers and patrons" lead="Born-again members of staff who guide the Household and stand with it before the University." />
            <ul data-reveal-stagger className="grid gap-4 medium:grid-cols-2 expanded:grid-cols-3">
              {advisers.map((a) => (
                <li key={a.name} className="flex items-center gap-4 rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
                  <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-container font-display text-title-lg text-on-primary-container">
                    {a.name.replace(/^(Prof\.|Dr\.|Venerable|Ven\.|Rev\.)\s*/i, '').slice(0, 1)}
                  </span>
                  <div>
                    <p className="text-title-md font-semibold">{a.name}</p>
                    <p className="text-label-md font-semibold uppercase text-primary">{a.office}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
