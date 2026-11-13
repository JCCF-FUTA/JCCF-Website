import type { Metadata } from 'next';
import { getPosts } from '@/lib/data';
import { NewsList } from '@/components/engage/NewsList';
import { PageHero } from '@/components/ui/PageHero';

export const revalidate = 300;
export const metadata: Metadata = { title: 'News & devotionals', description: 'Announcements, devotionals and stories from the JCCF FUTA Household.' };

export default async function NewsPage() {
  const posts = await getPosts();
  return (
    <>
      <PageHero crumb="News" compact title="News *& devotionals*" intro="Announcements from the Household Executive and devotionals to start your day." />
      <section className="section">
        <div className="container-page"><NewsList posts={posts} /></div>
      </section>
    </>
  );
}
