import Link from 'next/link';
import type { Img } from '@/lib/types';
import { Icon } from '@/components/ui/Icon';
import { SmartImage } from '@/components/ui/SmartImage';

/**
 * "Start here" for new students. One large card for the page's main job (find a fellowship),
 * two smaller ones for the next jobs (watch, give). Not three equal boxes (ANTI-SLOP Part B).
 */
export function StartHere({ fellowshipCount, photo, sermon }: { fellowshipCount: number; photo: Img | null; sermon: { thumb: string; title: string } | null }) {
  return (
    <div className="grid gap-4 expanded:grid-cols-12 expanded:gap-6">
      <Link
        href="/fellowships"
        data-reveal="image"
        className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-xl text-white expanded:col-span-7 expanded:min-h-[520px]"
      >
        <SmartImage image={photo} sizes="(min-width: 840px) 58vw, 100vw" decorative imgClassName="transition-transform duration-500 ease-standard group-hover:scale-105" />
        <div className="overlay-card absolute inset-0" aria-hidden="true" />
        <div className="relative flex flex-col items-start gap-3 p-6 expanded:p-8">
          <h3 className="font-display text-headline-lg uppercase">Find a fellowship</h3>
          <p className="max-w-[40ch] text-body-lg text-white">
            {fellowshipCount} registered fellowships and Christian groups. Search by name and visit one this week.
          </p>
          <span className="mt-2 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-label-lg font-semibold text-stage">
            Search fellowships <Icon name="arrow_forward" size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>

      <div className="grid gap-4 expanded:col-span-5 expanded:grid-rows-2 expanded:gap-6">
        <Link href="/media" className="group grid grid-cols-[2fr_3fr] overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest transition-colors hover:bg-surface-container-low">
          <div className="relative min-h-36">
            <SmartImage image={sermon ? { url: sermon.thumb, alt: '' } : null} sizes="(min-width: 840px) 18vw, 40vw" decorative />
          </div>
          <div className="flex flex-col justify-center gap-2 p-5">
            <h3 className="text-title-lg font-semibold">Watch sermons</h3>
            <p className="line-clamp-2 text-body-lg text-on-surface-variant">{sermon ? `Latest: ${sermon.title}` : 'Recent services and teaching weeks.'}</p>
            <span className="inline-flex items-center gap-1 text-label-lg font-semibold text-primary">
              Go to sermons <Icon name="arrow_forward" size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
        <Link href="/give" className="group flex flex-col justify-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest p-6 transition-colors hover:bg-surface-container-low">
          <h3 className="text-title-lg font-semibold">Give to the Household</h3>
          <p className="text-body-lg text-on-surface-variant">Offerings and partnership pay for combined programmes, student welfare and outreach.</p>
          <span className="inline-flex items-center gap-1 text-label-lg font-semibold text-primary">
            Give online or by transfer <Icon name="arrow_forward" size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Link>
      </div>
    </div>
  );
}
