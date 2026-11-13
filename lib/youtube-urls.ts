import { SITE } from './site';

const CHANNEL = SITE.youtubeChannelId;

/** YouTube links, safe to use in client components. */
export const youtubeUrls = {
  channel: `https://www.youtube.com/channel/${CHANNEL}`,
  handle: `https://www.youtube.com/${SITE.youtubeHandle}`,
  subscribe: `https://www.youtube.com/${SITE.youtubeHandle}?sub_confirmation=1`,
  watch: (id: string) => `https://www.youtube.com/watch?v=${id}`,
  embed: (id: string) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
  live: `https://www.youtube.com/channel/${CHANNEL}/live`,
};
