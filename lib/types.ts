import type { PortableTextBlock } from 'next-sanity';

/** An image ready for next/image. `url` is already sized/format-negotiated by its CDN. */
export type Img = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  /** Base64 low-quality placeholder (Sanity LQIP) */
  lqip?: string;
};

export type Day = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export const DAYS: Day[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export type Fellowship = {
  slug: string;
  name: string;
  shortName?: string;
  type: 'fellowship' | 'group';
  description?: string;
  meetingDays: Day[];
  meetingTime?: string;
  venue?: string;
  mapUrl?: string;
  presidentName?: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  logo?: Img;
  image?: Img;
  status: 'active' | 'inactive';
  /** Seed data whose schedule has not been confirmed by the fellowship yet */
  placeholder?: boolean;
};

export type Minister = { name: string; role?: string; photo?: Img };

export type Programme = {
  slug: string;
  title: string;
  /** e.g. "Combined Sunday Service", "Week of Prayers" */
  kind: string;
  theme?: string;
  start: string; // ISO with offset, Africa/Lagos
  end?: string;
  /** Date known, time not announced: show dates only (start 00:00, end 23:59 of the last day) */
  allDay?: boolean;
  venue?: string;
  mapUrl?: string;
  summary?: string;
  body?: PortableTextBlock[];
  flyer?: Img;
  ministers?: Minister[];
  featured?: boolean;
  /** YouTube video ids shown as "related sermons" after the event */
  relatedVideoIds?: string[];
  placeholder?: boolean;
};

export type LeaderGroup = 'executive' | 'unit' | 'adviser';

export type Leader = {
  name: string;
  office: string;
  group: LeaderGroup;
  department?: string;
  level?: string;
  photo?: Img;
  quote?: string;
  order: number;
  placeholder?: boolean;
};

export type PostType = 'announcement' | 'devotional' | 'blog';

export type Post = {
  slug: string;
  title: string;
  type: PostType;
  date: string;
  excerpt: string;
  author?: string;
  image?: Img;
  body?: PortableTextBlock[];
  placeholder?: boolean;
};

export type Video = {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
  description?: string;
  series?: string;
  /** e.g. "1:24:05" — only available with the Data API */
  duration?: string;
};

export type Playlist = { id: string; title: string; count?: number };

export type GalleryAlbum = {
  slug: string;
  title: string;
  date: string;
  cover?: Img;
  images: Img[];
};

export type Unit = { name: string; summary: string; icon: string };

export type LiveWindow = { day: Day; start: string; end: string }; // "16:00"

export type SiteSettings = {
  isLive: boolean;
  liveVideoId?: string;
  liveTitle?: string;
  featuredProgrammeSlug?: string;
  whatsappChannel?: string;
  email?: string;
  phone?: string;
  address?: string;
  mapUrl?: string;
  socials: { instagram?: string; facebook?: string; telegram?: string; youtube?: string; whatsapp?: string };
  stats: { value: number; suffix?: string; label: string; note?: string }[];
  liveWindows: LiveWindow[];
  pinnedVideoId?: string;
  instagramPosts?: { url: string; image?: Img }[];
};

export type GiveCategory = {
  id: string;
  label: string;
  description?: string;
  kind: 'offering' | 'partnership' | 'project';
  open: boolean;
};

export type GiveSettings = {
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  categories: GiveCategory[];
  presetAmounts: number[];
};

export type LiveStatus = { live: boolean; videoId?: string; title?: string };
