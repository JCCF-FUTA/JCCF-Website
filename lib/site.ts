/** Site-wide constants and integration switches. */

export const SITE = {
  name: 'JCCF FUTA',
  fullName: 'Joint Christian Campus Fellowship',
  /** One consistent title everywhere (PRD: SEO) */
  title: 'JCCF FUTA — Joint Christian Campus Fellowship',
  institution: 'Federal University of Technology, Akure',
  motto: 'Till we all come in the unity of the faith',
  mottoRef: 'Ephesians 4:13',
  founded: '1996/97',
  description:
    'The Joint Christian Campus Fellowship (JCCF), FUTA brings together the Protestant fellowships and Christian groups at the Federal University of Technology, Akure as one Household. Find a fellowship, see programmes and watch sermons.',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://jccffuta.org').replace(/\/$/, ''),
  youtubeChannelId: process.env.YOUTUBE_CHANNEL_ID || 'UCKBys_fv2AYhOVQ81RP0qug',
  youtubeHandle: '@jccf_futa',
  timeZone: 'Africa/Lagos',
} as const;

/**
 * Sample content (unconfirmed placeholders in lib/content/seed.ts) is shown only in development,
 * clearly marked "Sample". Production builds hide it, so nothing invented ever ships (ANTI-SLOP.md).
 * Set NEXT_PUBLIC_SHOW_SAMPLE_CONTENT=true on a preview deployment to review layouts with it.
 */
export const SHOW_SAMPLES =
  process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_SHOW_SAMPLE_CONTENT === 'true';

export const integrations = {
  sanity: Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID),
  supabase: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
  supabaseAuth: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  paystack: Boolean(process.env.PAYSTACK_SECRET_KEY),
  youtubeApi: Boolean(process.env.YOUTUBE_API_KEY),
  turnstile: Boolean(process.env.TURNSTILE_SECRET_KEY),
};

export type NavItem = { href: string; label: string };

/** Header shows these; the menu shows everything. */
export const MAIN_NAV: NavItem[] = [
  { href: '/about', label: 'About' },
  { href: '/fellowships', label: 'Fellowships' },
  { href: '/programmes', label: 'Programmes' },
  { href: '/media', label: 'Media' },
];

export const MENU_NAV: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/leadership', label: 'Leadership' },
  { href: '/fellowships', label: 'Fellowships' },
  { href: '/programmes', label: 'Programmes' },
  { href: '/media', label: 'Media' },
  { href: '/news', label: 'News' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/prayer', label: 'Prayer request' },
  { href: '/give', label: 'Give' },
  { href: '/alumni', label: 'Alumni' },
  { href: '/contact', label: 'Contact' },
];

export const FOOTER_NAV: { title: string; links: NavItem[] }[] = [
  {
    title: 'Explore',
    links: [
      { href: '/about', label: 'About JCCF' },
      { href: '/leadership', label: 'Leadership' },
      { href: '/fellowships', label: 'Fellowships' },
      { href: '/programmes', label: 'Programmes' },
    ],
  },
  {
    title: 'Watch & read',
    links: [
      { href: '/media', label: 'Sermons & live' },
      { href: '/news', label: 'News & devotionals' },
      { href: '/gallery', label: 'Gallery' },
    ],
  },
  {
    title: 'Get involved',
    links: [
      { href: '/give', label: 'Give' },
      { href: '/prayer', label: 'Prayer request' },
      { href: '/contact', label: 'Contact' },
      { href: '/alumni', label: 'Alumni' },
    ],
  },
];

/** Footer "Programmes" column: each links to the newest programme of that kind (falls back to /programmes). */
export const FOOTER_PROGRAMMES: { label: string; kind: string }[] = [
  { label: 'Prayer and Prophetic Week', kind: 'Prayer and Prophetic Week' },
  { label: 'Teaching Week', kind: 'Teaching Week' },
  { label: 'Workers’ Retreat', kind: 'Workers’ Retreat' },
  { label: 'Handover Service', kind: 'Handover Service' },
];
