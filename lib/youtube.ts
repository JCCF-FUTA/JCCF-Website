import 'server-only';
import { SITE } from './site';
import { SEED_VIDEOS } from './content/seed';
import type { LiveStatus, Playlist, Video } from './types';

/**
 * YouTube sermons (PRD F3).
 * - With YOUTUBE_API_KEY: Data API v3 (uploads playlist, durations, playlists), cached 30 min.
 * - Without a key: the public channel RSS feed (latest 15 uploads), cached 30 min.
 * - Offline: a snapshot in seed.ts.
 */

const KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL = SITE.youtubeChannelId;
const HALF_HOUR = 1800;
const API = 'https://www.googleapis.com/youtube/v3';

const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

function decodeEntities(s: string) {
  return s
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

/** Tidy shouty upload titles a little for display ("TEACHING WEEK '26 | …" stays readable). */
function cleanTitle(t: string) {
  return decodeEntities(t).replace(/\s*\|\|\s*/g, ' · ').replace(/\s*\|\s*/g, ' · ').trim();
}

function seriesFromTitle(t: string) {
  const m = t.match(/(teaching week\s*['’]?\s*\d{2,4}|online prayer|week of prayers?|combined service|workers?['’]? retreat)/i);
  if (!m) return undefined;
  return m[1].replace(/\s+/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
}

function isoDuration(d?: string) {
  if (!d) return undefined;
  const m = d.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return undefined;
  const [h, min, s] = [m[1], m[2], m[3]].map((x) => Number(x || 0));
  const pad = (n: number) => String(n).padStart(2, '0');
  return h ? `${h}:${pad(min)}:${pad(s)}` : `${min}:${pad(s)}`;
}

async function fromRss(): Promise<Video[] | null> {
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL}`, {
      next: { revalidate: HALF_HOUR, tags: ['youtube'] },
    });
    if (!res.ok) return null;
    const xml = await res.text();
    const entries = xml.split('<entry>').slice(1);
    return entries.map((e) => {
      const id = e.match(/<yt:videoId>([^<]+)/)?.[1] ?? '';
      const title = cleanTitle(e.match(/<media:title>([^<]*)/)?.[1] ?? '');
      return {
        id,
        title,
        published: e.match(/<published>([^<]+)/)?.[1] ?? '',
        thumbnail: thumb(id),
        description: decodeEntities(e.match(/<media:description>([^<]*)/)?.[1] ?? '').slice(0, 280),
        series: seriesFromTitle(title),
      };
    }).filter((v) => v.id);
  } catch {
    return null;
  }
}

async function api<T>(path: string, revalidate = HALF_HOUR): Promise<T | null> {
  if (!KEY) return null;
  try {
    const res = await fetch(`${API}/${path}&key=${KEY}`, { next: { revalidate, tags: ['youtube'] } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

type ApiItem = { id: string; snippet: { title: string; publishedAt: string; description: string; resourceId?: { videoId: string } }; contentDetails?: { duration?: string; videoId?: string } };

async function fromApi(playlistId?: string, max = 24): Promise<Video[] | null> {
  // The channel's uploads playlist id is the channel id with "UC" → "UU".
  const list = playlistId ?? CHANNEL.replace(/^UC/, 'UU');
  const items = await api<{ items: ApiItem[] }>(`playlistItems?part=snippet,contentDetails&maxResults=${max}&playlistId=${list}`);
  if (!items?.items) return null;
  const ids = items.items.map((i) => i.contentDetails?.videoId ?? i.snippet.resourceId?.videoId).filter(Boolean) as string[];
  const details = ids.length ? await api<{ items: ApiItem[] }>(`videos?part=contentDetails&id=${ids.join(',')}`) : null;
  const durations = new Map(details?.items?.map((d) => [d.id, isoDuration(d.contentDetails?.duration)]) ?? []);
  return items.items
    .filter((i) => i.snippet.title !== 'Private video' && i.snippet.title !== 'Deleted video')
    .map((i) => {
      const id = (i.contentDetails?.videoId ?? i.snippet.resourceId?.videoId)!;
      const title = cleanTitle(i.snippet.title);
      return {
        id,
        title,
        published: i.snippet.publishedAt,
        thumbnail: thumb(id),
        description: i.snippet.description.slice(0, 280),
        series: seriesFromTitle(title),
        duration: durations.get(id),
      };
    });
}

/** Latest uploads, newest first. Never throws. */
export async function getLatestVideos(count = 12, pinnedId?: string): Promise<Video[]> {
  const videos = (await fromApi(undefined, Math.max(count, 24))) ?? (await fromRss()) ?? SEED_VIDEOS;
  // Skip channel trailers/announcements with no real content (very old or very short titles) — keep order.
  let list = videos.slice();
  if (pinnedId) {
    const pinned = list.find((v) => v.id === pinnedId);
    list = pinned ? [pinned, ...list.filter((v) => v.id !== pinnedId)] : list;
  }
  return list.slice(0, count);
}

/** Videos in a playlist (series). Requires the Data API. */
export async function getPlaylistVideos(playlistId: string, count = 24) {
  return (await fromApi(playlistId, count)) ?? [];
}

/** The channel's playlists, used as series filters on /media. Requires the Data API. */
export async function getPlaylists(): Promise<Playlist[]> {
  const res = await api<{ items: { id: string; snippet: { title: string }; contentDetails: { itemCount: number } }[] }>(
    `playlists?part=snippet,contentDetails&maxResults=25&channelId=${CHANNEL}`,
  );
  return res?.items?.filter((p) => p.contentDetails.itemCount > 0).map((p) => ({ id: p.id, title: p.snippet.title, count: p.contentDetails.itemCount })) ?? [];
}

export async function getVideosByIds(ids: string[]): Promise<Video[]> {
  if (!ids.length) return [];
  const known = [...(await getLatestVideos(50)), ...SEED_VIDEOS];
  const byId = new Map(known.map((v) => [v.id, v]));
  return ids.map((id) => byId.get(id) ?? { id, title: 'Watch on YouTube', published: '', thumbnail: thumb(id) });
}

/**
 * Automatic live detection (PRD F4). Uses search.list (100 quota units) so it is only called
 * inside programme time windows, and cached for 15 minutes — well within the free 10,000 units/day.
 */
export async function detectYouTubeLive(): Promise<LiveStatus> {
  const res = await api<{ items: { id: { videoId: string }; snippet: { title: string } }[] }>(
    `search?part=snippet&channelId=${CHANNEL}&eventType=live&type=video&maxResults=1`,
    900,
  );
  const item = res?.items?.[0];
  return item ? { live: true, videoId: item.id.videoId, title: cleanTitle(item.snippet.title) } : { live: false };
}

export { youtubeUrls } from './youtube-urls';
