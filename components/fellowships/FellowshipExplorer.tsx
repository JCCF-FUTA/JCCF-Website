'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { Fellowship } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { filterChipClasses } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { EMPTY_FINDER, FinderBar, type FinderValues } from './FinderBar';
import { FellowshipListingCard } from './FellowshipCard';

function matches(f: Fellowship, v: FinderValues) {
  const q = v.q.trim().toLowerCase();
  if (q && !`${f.name} ${f.shortName ?? ''} ${f.venue ?? ''}`.toLowerCase().includes(q)) return false;
  if (v.day && !f.meetingDays.includes(v.day as Fellowship['meetingDays'][number])) return false;
  if (v.venue && f.venue !== v.venue) return false;
  if (v.type && f.type !== v.type) return false;
  return true;
}

/** Finder + live-filtered grid for /fellowships (DESIGN §12). Filters are kept in the URL. */
export function FellowshipExplorer({ fellowships, venues }: { fellowships: Fellowship[]; venues: string[] }) {
  const params = useSearchParams();
  const [v, setV] = useState<FinderValues>(() => ({
    q: params.get('q') ?? '', day: params.get('day') ?? '', venue: params.get('venue') ?? '', type: params.get('type') ?? '',
  }));

  useEffect(() => {
    const p = new URLSearchParams(Object.entries(v).filter(([, x]) => x) as [string, string][]);
    const url = `${window.location.pathname}${p.size ? `?${p}` : ''}${window.location.hash}`;
    window.history.replaceState(window.history.state, '', url);
  }, [v]);

  const results = useMemo(() => fellowships.filter((f) => matches(f, v)), [fellowships, v]);
  const active = (['q', 'day', 'venue', 'type'] as const).filter((k) => v[k]);
  const labels: Record<string, string> = { fellowship: 'Fellowships', group: 'Christian groups' };

  return (
    <>
      <div className="sticky top-20 z-30 -mt-10 mb-8 expanded:top-[5.25rem]">
        <FinderBar
          venues={venues}
          days={[...new Set(fellowships.flatMap((f) => f.meetingDays))]}
          showType={new Set(fellowships.map((f) => f.type)).size > 1}
          values={v}
          onChange={setV}
        />
      </div>

      <div id="results" className="scroll-mt-32">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <p className="mr-2 text-title-md font-semibold" aria-live="polite">
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </p>
          {active.map((k) => (
            <button key={k} type="button" onClick={() => setV({ ...v, [k]: '' })} className={filterChipClasses(true)} aria-label={`Remove filter ${v[k]}`}>
              {k === 'q' ? `“${v.q}”` : k === 'type' ? labels[v.type] : v[k]}
              <Icon name="close" size={16} />
            </button>
          ))}
          {active.length > 1 && (
            <button type="button" onClick={() => setV(EMPTY_FINDER)} className="inline-flex h-12 items-center px-2 text-label-lg font-semibold text-primary">Clear all</button>
          )}
        </div>

        {!fellowships.some((f) => f.meetingDays.length || f.venue) && (
          <p className="mb-6 max-w-prose text-body-lg text-on-surface-variant">
            Meeting days, times and venues will appear here as each fellowship confirms them. Until then, open a fellowship’s profile to contact it.
          </p>
        )}
        {results.length ? (
          <ul className="grid gap-4 medium:grid-cols-2 medium:gap-6 expanded:grid-cols-3">
            {results.map((f) => <li key={f.slug}><FellowshipListingCard f={f} /></li>)}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-outline-variant px-6 py-16 text-center">
            <Icon name="search" size={40} className="text-on-surface-variant" />
            <p className="text-title-md font-semibold">No fellowship matches those filters.</p>
            <p className="text-body-lg text-on-surface-variant">Try another day or venue, or clear the filters to see everyone.</p>
            <Button variant="tonal" onClick={() => setV(EMPTY_FINDER)} className="mt-2">Clear filters</Button>
          </div>
        )}
      </div>
    </>
  );
}
