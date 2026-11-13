import 'server-only';
import { cache } from 'react';
import { getSiteSettings } from './data';
import { detectYouTubeLive } from './youtube';
import { integrations, SITE } from './site';
import type { LiveStatus, LiveWindow } from './types';

/** Is "now" inside one of the CMS programme-time windows (Africa/Lagos)? */
export function inLiveWindow(windows: LiveWindow[], now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: SITE.timeZone, weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(now);
  const day = parts.find((p) => p.type === 'weekday')?.value;
  const hm = `${parts.find((p) => p.type === 'hour')?.value}:${parts.find((p) => p.type === 'minute')?.value}`;
  return windows.some((w) => w.day === day && hm >= w.start && hm <= w.end);
}

/**
 * Live status (PRD F4): the admin toggle always wins; otherwise an automatic YouTube check,
 * only during programme windows and cached 15 minutes to stay inside the free API quota.
 */
export const getLiveStatus = cache(async (): Promise<LiveStatus> => {
  const settings = await getSiteSettings();
  if (settings.isLive) {
    return { live: true, videoId: settings.liveVideoId, title: settings.liveTitle || 'JCCF FUTA live service' };
  }
  if (integrations.youtubeApi && inLiveWindow(settings.liveWindows)) {
    return detectYouTubeLive();
  }
  return { live: false };
});
