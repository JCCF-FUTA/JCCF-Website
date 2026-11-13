import type { MetadataRoute } from 'next';
import { getFellowships, getPosts, getProgrammes } from '@/lib/data';
import { SITE } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [fellowships, programmes, posts] = await Promise.all([getFellowships(), getProgrammes(), getPosts()]);
  const pages = ['', '/about', '/leadership', '/fellowships', '/programmes', '/media', '/give', '/prayer', '/contact', '/news', '/gallery', '/alumni'];
  return [
    ...pages.map((p) => ({ url: `${SITE.url}${p}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.7 })),
    ...fellowships.map((f) => ({ url: `${SITE.url}/fellowships/${f.slug}`, changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...programmes.map((p) => ({ url: `${SITE.url}/programmes/${p.slug}`, lastModified: p.start, priority: 0.6 })),
    ...posts.map((p) => ({ url: `${SITE.url}/news/${p.slug}`, lastModified: p.date, priority: 0.5 })),
  ];
}
