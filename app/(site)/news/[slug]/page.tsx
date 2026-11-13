import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPost, getPosts } from '@/lib/data';
import { formatLongDate } from '@/lib/format';
import { RichText } from '@/components/ui/RichText';
import { Icon } from '@/components/ui/Icon';
import { SmartImage } from '@/components/ui/SmartImage';
import { TYPE_LABEL } from '@/components/engage/NewsList';

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getPost((await params).slug);
  if (!p) return {};
  return { title: p.title, description: p.excerpt, openGraph: { type: 'article', publishedTime: p.date, images: p.image?.url ? [{ url: p.image.url }] : undefined } };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getPost((await params).slug);
  if (!p) notFound();
  return (
    <article>
      <div data-scroll-progress className="fixed inset-x-0 top-0 z-[55] h-0.5 origin-left bg-primary" style={{ transform: 'scaleX(0)' }} aria-hidden="true" />
      <header className="theme-stage">
        <div className="container-page flex flex-col gap-5 pt-32 pb-12 expanded:pb-16">
          <nav aria-label="Breadcrumb" data-hero-item>
            <ol className="flex items-center gap-1.5 text-label-md font-semibold uppercase text-on-stage-variant">
              <li><Link href="/news" className="inline-flex min-h-12 items-center hover:text-on-stage">News</Link></li>
              <li aria-hidden="true"><Icon name="arrow_forward" size={16} /></li>
              <li className="text-on-stage">{TYPE_LABEL[p.type]}</li>
            </ol>
          </nav>
          <h1 className="type-display max-w-[22ch] text-display-lg text-balance" data-hero-item style={{ '--d': 1 } as React.CSSProperties}>{p.title}</h1>
          <p data-hero-item className="text-body-lg text-on-stage-variant">
            <time dateTime={p.date}>{formatLongDate(p.date)}</time>{p.author ? ` · ${p.author}` : ''}
          </p>
        </div>
      </header>
      {p.image?.url && (
        <div className="container-page -mb-8 pt-10">
          <div className="relative mx-auto aspect-[16/9] max-w-prose overflow-hidden rounded-xl" data-reveal="image">
            <SmartImage image={p.image} sizes="(min-width: 840px) 672px, 100vw" priority />
          </div>
        </div>
      )}
      <div className="container-page section">
        <RichText value={p.body} className="mx-auto" />
        <div className="mx-auto mt-12 max-w-prose border-t border-outline-variant pt-6">
          <Link href="/news" className="inline-flex h-12 items-center gap-1 text-label-lg font-semibold text-primary"><Icon name="arrow_back" size={20} /> All news</Link>
        </div>
      </div>
    </article>
  );
}
