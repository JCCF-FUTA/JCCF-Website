import type { Metadata } from 'next';
import { getFeaturedProgramme, getPastProgrammes, getUpcomingProgrammes } from '@/lib/data';
import { FeaturedProgramme, ProgrammeCard } from '@/components/programmes/ProgrammeCard';
import { Icon } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { Tabs } from '@/components/ui/Tabs';
import type { Programme } from '@/lib/types';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Programmes',
  description: 'Upcoming and past Household programmes of JCCF FUTA: combined services, the Prayer and Prophetic Week, Change of Pulpit, Teaching Week and more.',
};

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
  return (
    <>
      <PageHero
        crumb="Programmes"
        title="Household programmes"
        intro="When the Household gathers, every fellowship suspends its own meeting and we meet together. Add a programme to your calendar or share it on WhatsApp."
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
              { label: 'Upcoming', count: upcoming.length, panel: <Grid items={upcoming} now={now} empty="No upcoming programmes yet. Check back soon." /> },
              { label: 'Past', count: past.length, panel: <Grid items={past} now={now} empty="No past programmes yet." /> },
            ]}
          />
        </div>
      </section>
    </>
  );
}
