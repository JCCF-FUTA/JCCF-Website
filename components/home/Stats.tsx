import type { SiteSettings } from '@/lib/types';

/** Stat tiles (DESIGN §C08): only real numbers, each with a plain label and its source. */
export function Stats({ stats }: { stats: SiteSettings['stats'] }) {
  return (
    <ul className="grid gap-3 medium:grid-cols-3 medium:gap-4">
      {stats.map((s) => (
        <li key={s.label} className="grid grid-cols-[4.5rem_1fr] items-baseline gap-x-3 rounded-xl border border-outline-variant bg-surface-container-low p-4 medium:flex medium:flex-col medium:gap-1 medium:p-6">
          <p className="font-display text-display-sm text-on-surface tabular-nums">
            <span>{s.value.toLocaleString('en-NG')}</span>
            {s.suffix && <span className="text-primary">{s.suffix}</span>}
          </p>
          <p className="text-title-md font-semibold text-on-surface">{s.label}</p>
          {s.note && <p className="col-start-2 text-body-md text-on-surface-variant medium:col-auto">{s.note}</p>}
        </li>
      ))}
    </ul>
  );
}
