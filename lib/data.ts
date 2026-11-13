import 'server-only';
import { cache } from 'react';
import { sanityFetch } from './sanity/client';
import * as Q from './sanity/queries';
import * as seed from './content/seed';
import { isPast } from './format';
import { integrations } from './site';
import type {
  Fellowship, GalleryAlbum, GiveSettings, Leader, Post, Programme, SiteSettings, Unit,
} from './types';

/**
 * One place every page reads content from.
 * Sanity when configured; the seed content otherwise (or when a Sanity query fails / returns nothing).
 */
async function fromCms<T>(query: string, fallback: T, params?: Record<string, string>): Promise<T> {
  if (!integrations.sanity) return fallback;
  const data = await sanityFetch<T>(query, params);
  if (data == null || (Array.isArray(data) && data.length === 0)) return fallback;
  return data;
}

const clean = <T extends object>(o: T): T =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== undefined)) as T;

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const cms = integrations.sanity ? await sanityFetch<Partial<SiteSettings>>(Q.SITE_SETTINGS_QUERY) : null;
  if (!cms) return seed.SITE_SETTINGS;
  const merged = { ...seed.SITE_SETTINGS, ...clean(cms) };
  merged.socials = { ...seed.SITE_SETTINGS.socials, ...clean(cms.socials ?? {}) };
  if (!cms.stats?.length) merged.stats = seed.SITE_SETTINGS.stats;
  if (!cms.liveWindows?.length) merged.liveWindows = seed.SITE_SETTINGS.liveWindows;
  return merged;
});

export const getGiveSettings = cache(async (): Promise<GiveSettings> => {
  const cms = integrations.sanity ? await sanityFetch<Partial<GiveSettings>>(Q.GIVE_SETTINGS_QUERY) : null;
  if (!cms) return seed.GIVE_SETTINGS;
  return {
    ...seed.GIVE_SETTINGS,
    ...clean(cms),
    categories: cms.categories?.length ? cms.categories : seed.GIVE_SETTINGS.categories,
    presetAmounts: cms.presetAmounts?.length ? cms.presetAmounts : seed.GIVE_SETTINGS.presetAmounts,
  };
});

export const getFellowships = cache(async (): Promise<Fellowship[]> =>
  (await fromCms(Q.FELLOWSHIPS_QUERY, seed.FELLOWSHIPS)).filter((f) => f.status !== 'inactive'));

export const getFellowship = cache(async (slug: string): Promise<Fellowship | null> => {
  if (integrations.sanity) {
    const f = await sanityFetch<Fellowship>(Q.FELLOWSHIP_QUERY, { slug });
    if (f) return f;
  }
  return seed.FELLOWSHIPS.find((f) => f.slug === slug) ?? null;
});

export const getProgrammes = cache(async (): Promise<Programme[]> =>
  [...(await fromCms(Q.PROGRAMMES_QUERY, seed.PROGRAMMES))].sort((a, b) => a.start.localeCompare(b.start)));

export const getProgramme = cache(async (slug: string): Promise<Programme | null> => {
  if (integrations.sanity) {
    const p = await sanityFetch<Programme>(Q.PROGRAMME_QUERY, { slug });
    if (p) return p;
  }
  return seed.PROGRAMMES.find((p) => p.slug === slug) ?? null;
});

export async function getUpcomingProgrammes(now = Date.now()) {
  return (await getProgrammes()).filter((p) => !isPast(p, now));
}

export async function getPastProgrammes(now = Date.now()) {
  return (await getProgrammes()).filter((p) => isPast(p, now)).reverse();
}

/**
 * The programme the Home countdown points at (PRD F4): the CMS-featured one while it hasn't ended,
 * otherwise the next featured programme, otherwise the next upcoming programme.
 */
export async function getFeaturedProgramme(now = Date.now()): Promise<Programme | null> {
  const [settings, upcoming] = await Promise.all([getSiteSettings(), getUpcomingProgrammes(now)]);
  return (
    upcoming.find((p) => p.slug === settings.featuredProgrammeSlug) ??
    upcoming.find((p) => p.featured) ??
    upcoming[0] ??
    null
  );
}

export const getLeaders = cache(async (): Promise<Leader[]> => fromCms(Q.LEADERS_QUERY, seed.LEADERS));

export const getPosts = cache(async (): Promise<Post[]> => fromCms(Q.POSTS_QUERY, seed.POSTS));

export const getPost = cache(async (slug: string): Promise<Post | null> => {
  if (integrations.sanity) {
    const p = await sanityFetch<Post>(Q.POST_QUERY, { slug });
    if (p) return p;
  }
  return seed.POSTS.find((p) => p.slug === slug) ?? null;
});

export const getUnits = cache(async (): Promise<Unit[]> => fromCms(Q.UNITS_QUERY, seed.UNITS));

export const getGallery = cache(async (): Promise<GalleryAlbum[]> => fromCms(Q.GALLERY_QUERY, seed.GALLERY));
