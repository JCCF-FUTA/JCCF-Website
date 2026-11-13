import Image from 'next/image';
import { cn } from '@/lib/cn';
import type { Img } from '@/lib/types';

/**
 * Every image slot goes through here (DESIGN §10): a CMS or YouTube image when there is one,
 * otherwise a branded gradient tile with the JCCF logo watermark — never a stock photo.
 * Always `fill` — the parent sets the aspect ratio and `position: relative`.
 */
export function SmartImage({
  image,
  sizes,
  priority,
  className,
  imgClassName,
  fallbackLabel,
  labelPosition = 'center',
  decorative,
}: {
  image?: Img | null;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  /** Large text shown on the fallback tile (e.g. a fellowship's short name) */
  fallbackLabel?: string;
  /** Where the fallback label sits: centred, or near the top (when a caption covers the bottom) */
  labelPosition?: 'center' | 'top';
  decorative?: boolean;
}) {
  if (!image?.url) {
    return (
      <div className={cn('tile-brand absolute inset-0 overflow-hidden', className)} aria-hidden="true">
        <Image
          src="/brand/jccf-logo-160.webp"
          alt=""
          width={160}
          height={160}
          className="absolute -right-6 -bottom-6 size-40 opacity-[0.07] grayscale"
        />
        {fallbackLabel && (
          <span className={cn('absolute inset-0 flex justify-center p-4 text-center font-display uppercase leading-none text-white/90', labelPosition === 'top' ? 'items-start pt-[22%] text-[clamp(2.25rem,5vw,3rem)] text-white/25' : 'items-center text-[clamp(2rem,8vw,3.5rem)]')}>
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <Image
        src={image.url}
        alt={decorative ? '' : image.alt}
        fill
        sizes={sizes}
        priority={priority}
        fetchPriority={priority ? 'high' : undefined}
        placeholder={image.lqip ? 'blur' : 'empty'}
        blurDataURL={image.lqip}
        className={cn('object-cover', imgClassName)}
      />
    </div>
  );
}
