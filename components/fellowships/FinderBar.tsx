'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { DAYS } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

export type FinderValues = { q: string; day: string; venue: string; type: string };
export const EMPTY_FINDER: FinderValues = { q: '', day: '', venue: '', type: '' };

/**
 * Fellowship finder (DESIGN §C07). On Home it submits to /fellowships?q=&day=&venue=&type=.
 * On /fellowships it is controlled and filters live (pass `values` + `onChange`).
 */
export function FinderBar({
  venues,
  values: controlled,
  onChange,
  className,
}: {
  venues: string[];
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
  const [sheetOpen, setSheetOpen] = useState(false);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setSheetOpen(false);
    if (onChange) {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const params = new URLSearchParams(Object.entries(v).filter(([, x]) => x) as [string, string][]);
    router.push(`/fellowships${params.size ? `?${params}` : ''}#results`);
  };

  const activeFilters = [v.day, v.venue, v.type].filter(Boolean).length;

  const selects = (layout: 'bar' | 'sheet') => (
    <>
      <Segment label="Meeting day" layout={layout}>
        <select value={v.day} onChange={(e) => set({ day: e.target.value })} className={selectCls(layout)} aria-label="Meeting day">
          <option value="">Any day</option>
          {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </Segment>
      <Segment label="Venue" layout={layout}>
        <select value={v.venue} onChange={(e) => set({ venue: e.target.value })} className={selectCls(layout)} aria-label="Venue">
          <option value="">Any venue</option>
          {venues.map((x) => <option key={x} value={x}>{x}</option>)}
        </select>
      </Segment>
      <Segment label="Type" layout={layout}>
        <select value={v.type} onChange={(e) => set({ type: e.target.value })} className={selectCls(layout)} aria-label="Type">
          <option value="">All</option>
          <option value="fellowship">Fellowship</option>
          <option value="group">Christian group</option>
        </select>
      </Segment>
    </>
  );

  return (
    <form role="search" aria-label="Find a fellowship" onSubmit={submit} className={cn('theme-light rounded-2xl shadow-elev-3', className)}>
      {/* Expanded+: one segmented bar */}
      <div className="hidden h-[72px] items-stretch expanded:flex">
        <Segment label="Search" layout="bar" grow>
          <input
            type="search"
            value={v.q}
            onChange={(e) => set({ q: e.target.value })}
            placeholder="Fellowship name, e.g. SUCF"
            aria-label="Search fellowships by name"
            className="w-full bg-transparent text-body-md text-on-surface outline-none placeholder:text-on-surface-variant"
          />
        </Segment>
        {selects('bar')}
        <div className="p-2">
          <Button type="submit" className="h-full rounded-xl px-7" icon="search">Find</Button>
        </div>
      </div>

      {/* Compact/medium: search field + filter button → bottom sheet */}
      <div className="flex items-center gap-2 p-2 expanded:hidden">
        <label className="flex h-14 min-w-0 flex-1 items-center gap-2 rounded-xl bg-surface-container px-4">
          <Icon name="search" className="text-on-surface-variant" />
          <span className="sr-only">Search fellowships by name</span>
          <input
            type="search"
            value={v.q}
            onChange={(e) => set({ q: e.target.value })}
            placeholder="Find a fellowship"
            className="min-w-0 flex-1 bg-transparent text-body-lg text-on-surface outline-none placeholder:text-on-surface-variant"
            enterKeyHint="search"
          />
        </label>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-label={`Filters${activeFilters ? ` (${activeFilters} active)` : ''}`}
          className="state-layer relative inline-flex size-14 items-center justify-center rounded-xl bg-primary text-on-primary"
        >
          <Icon name="tune" />
          {activeFilters > 0 && (
            <span className="absolute -right-1 -top-1 inline-flex size-5 items-center justify-center rounded-full bg-tertiary text-label-sm text-on-tertiary">{activeFilters}</span>
          )}
        </button>
      </div>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Filter fellowships">
        <div className="flex flex-col gap-4">{selects('sheet')}</div>
        <div className="mt-6 flex gap-3">
          <Button variant="outlined" className="flex-1" onClick={() => set({ day: '', venue: '', type: '' })}>Clear</Button>
          <Button className="flex-1" onClick={() => submit()}>Show results</Button>
        </div>
      </BottomSheet>
    </form>
  );
}

const selectCls = (layout: 'bar' | 'sheet') =>
  layout === 'bar'
    ? 'w-full cursor-pointer appearance-none bg-transparent pr-6 text-body-md text-on-surface outline-none'
    : 'h-14 w-full cursor-pointer appearance-none rounded-md border border-outline bg-surface-container-lowest px-4 pr-10 text-body-lg text-on-surface';

function Segment({ label, layout, grow, children }: { label: string; layout: 'bar' | 'sheet'; grow?: boolean; children: React.ReactNode }) {
  if (layout === 'sheet') {
    return (
      <label className="flex flex-col gap-1.5">
        <span className="text-label-md font-semibold uppercase text-on-surface-variant">{label}</span>
        <span className="relative">
          {children}
          <Icon name="keyboard_arrow_down" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
        </span>
      </label>
    );
  }
  return (
    <label className={cn('relative flex min-w-0 flex-col justify-center border-r border-outline-variant px-6 first:rounded-l-2xl', grow ? 'flex-[1.6]' : 'flex-1')}>
      <span className="text-label-md font-semibold uppercase text-on-surface-variant">{label}</span>
      <span className="relative mt-0.5">
        {children}
        {!grow && <Icon name="keyboard_arrow_down" size={20} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant" />}
      </span>
    </label>
  );
}

/** Bottom sheet (DESIGN §C24): native modal dialog — focus trapped, Esc and scrim close it. */
export function BottomSheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      aria-label={title}
      data-lenis-prevent
      className="theme-light mx-0 mt-auto mb-0 max-h-[85vh] w-full max-w-none rounded-t-2xl bg-surface-container-low p-0 text-on-surface backdrop:bg-black/40 open:animate-[sheet-up_300ms_cubic-bezier(.05,.7,.1,1)_both]"
    >
      <div className="px-4 pt-3 pb-6">
        <div className="mx-auto mb-4 h-1 w-8 rounded-full bg-outline" aria-hidden="true" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-title-lg font-semibold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="state-layer -mr-2 inline-flex size-12 items-center justify-center rounded-full">
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
