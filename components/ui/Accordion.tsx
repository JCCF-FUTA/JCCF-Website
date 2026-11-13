import { Icon } from './Icon';

/** FAQ accordion built on <details> — works without JavaScript. */
export function Accordion({ items }: { items: { q: string; a: React.ReactNode }[] }) {
  return (
    <div className="divide-y divide-outline-variant border-y border-outline-variant">
      {items.map((it) => (
        <details key={it.q} className="group">
          <summary className="flex min-h-16 items-center justify-between gap-4 py-4 text-title-md font-semibold">
            {it.q}
            <Icon name="keyboard_arrow_down" className="shrink-0 text-on-surface-variant transition-transform duration-300 group-open:rotate-180" />
          </summary>
          <div className="max-w-prose pb-5 text-body-lg text-on-surface-variant">{it.a}</div>
        </details>
      ))}
    </div>
  );
}
