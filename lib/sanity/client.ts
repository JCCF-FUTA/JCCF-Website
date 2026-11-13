import 'server-only';
import { createClient, type QueryParams } from 'next-sanity';
import { apiVersion, dataset, projectId } from './env';

const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      token: process.env.SANITY_API_READ_TOKEN || undefined,
      perspective: 'published',
    })
  : null;

/** GROQ fetch, cached and revalidated on publish by the /api/revalidate webhook (and every 5 min as a safety net). */
export async function sanityFetch<T>(query: string, params: QueryParams = {}): Promise<T | null> {
  if (!client) return null;
  try {
    return await client.fetch<T>(query, params, { next: { revalidate: 300, tags: ['sanity'] } });
  } catch (err) {
    console.error('[sanity] query failed', err);
    return null;
  }
}
