import Image from 'next/image';
import type { SiteSettings } from '@/lib/types';
import { Brand } from '@/components/ui/Brand';
import { BeholdWidget } from './BeholdWidget';

const BEHOLD = process.env.NEXT_PUBLIC_BEHOLD_FEED_ID;

/**
 * Instagram strip (PRD F9): a lazy-loaded Behold widget when NEXT_PUBLIC_BEHOLD_FEED_ID is set,
 * otherwise admin-picked posts from Site settings. Renders nothing when neither exists.
 */
export function InstagramStrip({ settings }: { settings: SiteSettings }) {
  const posts = settings.instagramPosts?.filter((p) => p.image?.url) ?? [];
  const profile = settings.socials.instagram;
  if (!BEHOLD && !posts.length) return null;
  return (
    <div className="flex flex-col gap-4" data-reveal="up">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-title-lg font-semibold"><Brand name="instagram" /> On Instagram</h3>
        {profile && <a href={profile} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center text-label-lg font-semibold text-primary">Follow us</a>}
      </div>
      {BEHOLD ? (
        <BeholdWidget feedId={BEHOLD} />
      ) : (
        <ul className="grid grid-cols-3 gap-2">
          {posts.slice(0, 6).map((p) => (
            <li key={p.url}>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="relative block aspect-square overflow-hidden rounded-sm">
                <Image src={p.image!.url} alt={p.image!.alt || 'Instagram post'} fill sizes="(min-width: 840px) 12vw, 33vw" className="object-cover transition-transform duration-500 hover:scale-105" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
