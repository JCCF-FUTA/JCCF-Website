'use client';

import { useMemo, useState } from 'react';
import type { Video } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { filterChipClasses } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { SermonCard } from './SermonCard';

const PAGE = 9;

/** Series filter chips + sermon grid + "Load more" (DESIGN §12 Media). */
export function MediaGrid({ videos }: { videos: Video[] }) {
  const series = useMemo(() => {
    const counts = new Map<string, number>();
    videos.forEach((v) => v.series && counts.set(v.series, (counts.get(v.series) ?? 0) + 1));
    return [...counts.entries()].filter(([, n]) => n > 1).map(([s]) => s);
  }, [videos]);
  const [active, setActive] = useState<string | null>(null);
  const [shown, setShown] = useState(PAGE);
  const list = active ? videos.filter((v) => v.series === active) : videos;

  return (
    <div>
      {series.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by series">
          {[null, ...series].map((s) => {
            const selected = active === s;
            return (
              <button key={s ?? 'all'} type="button" aria-pressed={selected} onClick={() => { setActive(s); setShown(PAGE); }} className={filterChipClasses(selected)}>
                {selected && <Icon name="check" size={16} />}
                {s ?? 'All sermons'}
              </button>
            );
          })}
        </div>
      )}
      <ul className="grid gap-x-6 gap-y-10 medium:grid-cols-2 expanded:grid-cols-3" aria-live="polite">
        {list.slice(0, shown).map((v, i) => <li key={v.id}><SermonCard v={v} priority={i < 3} /></li>)}
      </ul>
      {shown < list.length && (
        <div className="mt-10 flex justify-center">
          <Button variant="outlined" icon="add" onClick={() => setShown((n) => n + PAGE)}>Load more</Button>
        </div>
      )}
    </div>
  );
}
