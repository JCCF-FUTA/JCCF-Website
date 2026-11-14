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
  if (q && !`${f.name} ${f.shortName ?? ''}`.toLowerCase().includes(q)) return false;
  return true;
}

/** Finder + live-filtered grid for /fellowships (DESIGN §12). Search is kept in the URL. */
export function FellowshipExplorer({ fellowships }: { fellowships: Fellowship[] }) {
  const params = useSearchParams();
  const [v, setV] = useState<FinderValues>(() => ({ q: params.get('q') ?? '' }));

  useEffect(() => {
    const p = new URLSearchParams(v.q.trim() ? { q: v.q.trim() } : {});
    const url = `${window.location.pathname}${p.size ? `?${p}` : ''}${window.location.hash}`;
    window.history.replaceState(window.history.state, '', url);
  }, [v]);

  const results = useMemo(() => fellowships.filter((f) => matches(f, v)), [fellowships, v]);
  const active = (['q'] as const).filter((k) => v[k]);

  return (
    <>
      <div className="sticky top-20 z-30 -mt-10 mb-8 expanded:top-[5.25rem]">
        <FinderBar values={v} onChange={setV} />
      </div>

      <div id="results" className="scroll-mt-32">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <p className="mr-2 text-title-md font-semibold" aria-live="polite">
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </p>
          {active.map((k) => (
            <button key={k} type="button" onClick={() => setV({ ...v, [k]: '' })} className={filterChipClasses(true)} aria-label={`Remove search ${v[k]}`}>
              {`“${v.q}”`}
              <Icon name="close" size={16} />
            </button>
          ))}
          {active.length > 0 && (
            <button type="button" onClick={() => setV(EMPTY_FINDER)} className="inline-flex h-12 items-center px-2 text-label-lg font-semibold text-primary">Clear all</button>
          )}
        </div>

        {results.length ? (
          <ul className="grid gap-4 medium:grid-cols-2 medium:gap-6 expanded:grid-cols-3">
            {results.map((f) => <li key={f.slug}><FellowshipListingCard f={f} /></li>)}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-outline-variant px-6 py-16 text-center">
            <Icon name="search" size={40} className="text-on-surface-variant" />
            <p className="text-title-md font-semibold">No fellowship matches that name.</p>
            <p className="text-body-lg text-on-surface-variant">Try another name or abbreviation, or clear the search to see everyone.</p>
            <Button variant="tonal" onClick={() => setV(EMPTY_FINDER)} className="mt-2">Clear filters</Button>
          </div>
        )}
      </div>
    </>
  );
}
