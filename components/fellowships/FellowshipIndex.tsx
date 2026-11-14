import Link from 'next/link';
import type { Fellowship } from '@/lib/types';

/**
 * Every fellowship as a static list of links: short name (how students say it) and full name.
 * Replaces the auto-scrolling marquee (WCAG 2.2.2) and the placeholder photo tiles.
 */
export function FellowshipIndex({ fellowships }: { fellowships: Fellowship[] }) {
  return (
    <nav aria-labelledby="all-fellowships">
      <h3 id="all-fellowships" className="mb-4 text-title-lg font-semibold">All {fellowships.length} fellowships</h3>
      <ul className="grid border-t border-outline-variant medium:grid-cols-2 expanded:grid-cols-3 medium:gap-x-8">
        {fellowships.map((f) => (
          <li key={f.slug} className="border-b border-outline-variant">
            <Link href={`/fellowships/${f.slug}`} className="group flex min-h-16 items-center gap-4 py-3">
              {f.shortName && (
                <span className="w-32 shrink-0 font-display text-headline-sm uppercase leading-none text-on-surface group-hover:text-primary">{f.shortName}</span>
              )}
              <span className="min-w-0 flex-1 text-body-md text-on-surface-variant group-hover:text-on-surface">{f.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
