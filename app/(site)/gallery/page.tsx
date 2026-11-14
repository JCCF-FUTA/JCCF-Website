import type { Metadata } from 'next';
import { getGallery } from '@/lib/data';
import { formatLongDate } from '@/lib/format';
import { AlbumGallery } from '@/components/gallery/Lightbox';
import { MetaBadge } from '@/components/ui/Chip';
import { PageHero } from '@/components/ui/PageHero';

export const revalidate = 300;
export const metadata: Metadata = { title: 'Gallery', description: 'Photos from JCCF FUTA Household programmes.' };

export default async function GalleryPage() {
  const albums = await getGallery();
  return (
    <>
      <PageHero crumb="Gallery" compact title="Gallery" intro="Photos from Household programmes. Tap a photo to view it full screen." />
      {albums.map((a) => (
        <section key={a.slug} id={a.slug} aria-labelledby={`${a.slug}-title`} className="section scroll-mt-20 border-b border-outline-variant last:border-0">
          <div className="container-page">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id={`${a.slug}-title`} className="type-headline text-headline-md">{a.title}</h2>
                <p className="text-body-md text-on-surface-variant">{formatLongDate(a.date)}</p>
              </div>
              <MetaBadge className="bg-surface-container text-on-surface-variant">{a.images.length} photos</MetaBadge>
            </div>
            <AlbumGallery album={a} />
          </div>
        </section>
      ))}
    </>
  );
}
