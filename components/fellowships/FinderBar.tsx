'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

export type FinderValues = { q: string };
export const EMPTY_FINDER: FinderValues = { q: '' };

/**
 * Fellowship finder (DESIGN §C07). On Home it submits to /fellowships?q=.
 * On /fellowships it is controlled and filters live (pass `values` + `onChange`).
 */
export function FinderBar({
  values: controlled,
  onChange,
  flat,
  className,
}: {
  /** Sit inside another card: no own background, padding or shadow */
  flat?: boolean;
  values?: FinderValues;
  onChange?: (v: FinderValues) => void;
  className?: string;
}) {
  const router = useRouter();
  const [local, setLocal] = useState<FinderValues>(EMPTY_FINDER);
  const v = controlled ?? local;
  const set = (patch: Partial<FinderValues>) => {
    const next = { ...v, ...patch };
    if (onChange) onChange(next);
    else setLocal(next);
  };
  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (onChange) {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const params = new URLSearchParams(v.q.trim() ? { q: v.q.trim() } : {});
    router.push(`/fellowships${params.size ? `?${params}` : ''}#results`);
  };

  return (
    <form role="search" aria-label="Search fellowships by name" onSubmit={submit} className={cn(!flat && 'theme-light rounded-2xl shadow-elev-3', className)}>
      <div className={cn('flex items-center gap-2', !flat && 'p-2')}>
        <label className="flex h-14 min-w-0 flex-1 items-center gap-2 rounded-xl bg-surface-container px-4">
          <Icon name="search" className="text-on-surface-variant" />
          <span className="sr-only">Search fellowships by name</span>
          <input
            type="search"
            value={v.q}
            onChange={(e) => set({ q: e.target.value })}
            placeholder="Name, e.g. SUCF"
            className="min-w-0 flex-1 bg-transparent text-body-lg text-on-surface outline-none placeholder:text-on-surface-variant"
            enterKeyHint="search"
          />
        </label>
        <Button type="submit" className="h-14 rounded-xl px-5">Search</Button>
      </div>
    </form>
  );
}
