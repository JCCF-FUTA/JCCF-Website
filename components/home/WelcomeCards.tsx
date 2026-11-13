import Link from 'next/link';
import type { Img } from '@/lib/types';
import { Icon } from '@/components/ui/Icon';
import { SmartImage } from '@/components/ui/SmartImage';

type Card = { href: string; title: string; text: string; icon: string; image?: Img | null };

/** "Welcome to the Household": three large image cards (DESIGN §12 Home 5). */
export function WelcomeCards({ cards }: { cards: Card[] }) {
  return (
    <ul data-reveal-stagger className="grid gap-4 medium:grid-cols-3 medium:gap-6">
      {cards.map((c) => (
        <li key={c.href}>
          <Link href={c.href} className="group relative block aspect-[4/5] overflow-hidden rounded-xl text-white transition-transform duration-300 ease-standard hover:-translate-y-1 medium:aspect-[3/4]">
            <SmartImage image={c.image} sizes="(min-width: 600px) 33vw, 100vw" decorative imgClassName="transition-transform duration-500 ease-standard group-hover:scale-105" />
            <div className="overlay-card absolute inset-0" aria-hidden="true" />
            <span className="glass absolute left-5 top-5 inline-flex size-12 items-center justify-center rounded-full">
              <Icon name={c.icon} />
            </span>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 medium:p-6">
              <div>
                <h3 className="text-title-lg font-semibold">{c.title}</h3>
                <p className="mt-1 text-body-md text-white/80">{c.text}</p>
              </div>
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-stage transition-transform duration-300 group-hover:translate-x-1">
                <Icon name="arrow_forward" />
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
