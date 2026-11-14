import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getFellowships } from '@/lib/data';
import { FellowshipExplorer } from '@/components/fellowships/FellowshipExplorer';
import { FellowshipListingCard } from '@/components/fellowships/FellowshipCard';
import { PageHero } from '@/components/ui/PageHero';
import { PHOTOS } from '@/lib/content/seed';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Find a fellowship',
  description: 'Every registered Protestant fellowship and Christian group at FUTA. Search by name, meeting day or venue and visit one this week.',
};

export default async function FellowshipsPage() {
  const fellowships = await getFellowships();
  const venues = [...new Set(fellowships.map((f) => f.venue).filter(Boolean) as string[])].sort();
  return (
    <>
      <PageHero
        crumb="Fellowships"
        compact
        image={{ ...PHOTOS.hall, alt: '' }}
        title="Find a fellowship"
        intro={`${fellowships.length} fellowships and Christian groups, one Household. Filter by meeting day or venue and visit one this week.`}
      />
      <section aria-label="Fellowships" className="relative pb-24">
        <div className="container-page">
          <Suspense
            fallback={
              <ul className="mt-16 grid gap-4 medium:grid-cols-2 medium:gap-6 expanded:grid-cols-3">
                {fellowships.map((f) => <li key={f.slug}><FellowshipListingCard f={f} /></li>)}
              </ul>
            }
          >
            <FellowshipExplorer fellowships={fellowships} venues={venues} />
          </Suspense>
          <p className="mt-12 max-w-prose text-body-lg text-on-surface-variant">
            Is your fellowship’s information wrong or missing? Ask your president to send the update to the Publicity Unit through the{' '}
            <a className="font-semibold text-primary underline-offset-4 hover:underline" href="/contact">contact page</a>.
          </p>
        </div>
      </section>
    </>
  );
}
