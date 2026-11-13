import type { SiteSettings } from '@/lib/types';

/** Stat tiles (DESIGN §C08) with count-up (M4). The number is real text without JS. */
export function Stats({ stats }: { stats: SiteSettings['stats'] }) {
  return (
    <ul data-reveal-stagger className="grid grid-cols-2 gap-3 medium:gap-4 expanded:grid-cols-4">
      {stats.map((s) => (
        <li key={s.label} className="flex flex-col gap-1 rounded-xl border border-outline-variant bg-surface-container-low p-5 medium:p-6">
          <p className="font-display text-display-sm text-on-surface tabular-nums">
            <span data-count={s.value}>{s.value.toLocaleString('en-NG')}</span>
            {s.suffix && <span className="text-primary">{s.suffix}</span>}
          </p>
          <p className="text-body-md font-semibold text-on-surface">{s.label}</p>
          {s.note && <p className="text-body-sm text-on-surface-variant">{s.note}</p>}
        </li>
      ))}
    </ul>
  );
}
