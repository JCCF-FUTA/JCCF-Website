import type { Fellowship } from '@/lib/types';

/** Endless strip of every fellowship name (DESIGN §C22, M8). Pauses on hover/focus. */
export function Marquee({ fellowships }: { fellowships: Fellowship[] }) {
  const names = fellowships.map((f) => f.shortName ?? f.name);
  const row = (hidden?: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {names.map((n, i) => (
        <li key={`${n}-${i}`} className="flex items-center">
          <span className="px-6 font-display text-[1.75rem] uppercase leading-none text-on-surface-variant/70">{n}</span>
          <span className="text-primary" aria-hidden="true">✦</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee overflow-hidden border-y border-outline-variant py-6 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]" tabIndex={0} aria-label="Constituent fellowships">
      <div className="marquee-track flex w-max animate-marquee motion-reduce:animate-none">
        {row()}
        {row(true)}
      </div>
    </div>
  );
}
