/**
 * Seed content — used whenever Sanity is not configured (NEXT_PUBLIC_SANITY_PROJECT_ID empty),
 * and as the starting data to import into Sanity.
 *
 * Sources:
 *  - Constitution (reviewed 2024): history, vision, mission, doctrine, logo meaning, offices, units,
 *    the 25 registered fellowships (Appendix III), staff advisers/patron (Appendix V).
 *  - JCCF YouTube channel (@jccf_futa): video ids, programme names, the Chapel of Faith venue.
 *
 * Anything marked `placeholder: true` or "PLACEHOLDER" is NOT confirmed and must be replaced
 * with real data from the executives before launch (see README → Content checklist).
 */
import type {
  Day, Fellowship, GalleryAlbum, GiveSettings, Leader, Post, Programme, SiteSettings, Unit, Video,
} from '../types';
import { slugify } from '../format';
import { paragraphs } from './blocks';

const yt = (id: string, alt: string) => ({
  url: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
  alt,
  width: 1280,
  height: 720,
});

/** Real event photos from the channel — the only two thumbnails that are photographs, not flyers. */
export const PHOTOS = {
  stage: yt('CjPmVAGTxa0', ''),
  hall: yt('CsK_tJUPe2s', ''),
};

/* ─────────────────────────── About (constitution) ─────────────────────────── */

export const VISION = {
  short: 'Raising a people that will come in the unity of the faith',
  full: 'Raising a people that will come in the unity of the faith, and of the knowledge of the Son of God, unto a perfect man, unto the measure of the stature of the fullness of Christ.',
  ref: 'Ephesians 4:13',
};

export const MISSION: { title: string; text: string; icon: string }[] = [
  { title: 'Unity', text: 'Fostering unity among Christian fellowships and groups on campus.', icon: 'groups' },
  { title: 'Harmony', text: 'Harmonising programmes, times and venues so fellowships never clash.', icon: 'calendar_month' },
  { title: 'Edification', text: 'Organising Household programmes that build up every believer.', icon: 'menu_book' },
  { title: 'Bridge', text: 'Linking the University authority and the registered fellowships.', icon: 'account_balance' },
  { title: 'Sound doctrine', text: 'Guarding the campus against strange doctrines.', icon: 'verified' },
  { title: 'Wellbeing', text: 'Caring for the total wellbeing of Christians on campus.', icon: 'favorite' },
  { title: 'Guidance', text: 'Serving as a spiritual guide upon the land.', icon: 'explore' },
];

export const DOCTRINE: string[] = [
  'The Trinity: God the Father, the Son, and the Holy Spirit.',
  'The divine inspiration and infallibility of the Holy Bible and its supreme authority on all matters of faith, doctrine, and conduct.',
  'The sovereignty of God in creation, revelation, redemption, and final judgement.',
  'The birth, crucifixion, death, burial, resurrection, ascension, and return of the Lord Jesus Christ.',
  'The universal sinfulness of the human race since the fall, which renders man subject to God’s wrath and condemnation, and redemption from this only through faith in the sacrificial death of the Lord Jesus Christ.',
  'Moderation in speech, conduct, dressing, relationships, and in all aspects of Christian living.',
  'Salvation by grace through faith, which leads to a complete turning away from sin.',
  'Water baptism and Holy Spirit baptism, with the evidence of speaking in tongues, are important for every believer after salvation.',
  'The person of the Holy Spirit; His ministry, fruits, and gifts.',
  'Preaching the Gospel is a task for all believers.',
  'The paying of tithes and offerings.',
  'Believers are members of the body of Christ, regardless of denomination, and Christ is the head of that body.',
];

export const LOGO_MEANING: { symbol: string; meaning: string; detail: string; swatch: 'dove' | 'book' | 'olive' | 'green' | 'red' | 'yellow' }[] = [
  { symbol: 'The Dove', meaning: 'The Spirit of God', detail: 'The Holy Spirit who leads the Household.', swatch: 'dove' },
  { symbol: 'The Book', meaning: 'The Word of God', detail: 'Scripture, our final authority in faith and conduct.', swatch: 'book' },
  { symbol: 'The Olive Branch', meaning: 'Peace and covenant', detail: 'As with Noah after the flood, God keeps His family on campus through every spiritual and physical flood.', swatch: 'olive' },
  { symbol: 'The Green Circle', meaning: 'Oneness', detail: 'The unbroken oneness of the Father, Son and Holy Spirit, and the call for the church in FUTA to be one. Green speaks of constant growth and fruitfulness.', swatch: 'green' },
  { symbol: 'The Red Circle', meaning: 'Redemption', detail: 'The unbroken outer circle is the blood of redemption.', swatch: 'red' },
  { symbol: 'The Yellow Glow', meaning: 'The glory of Christ', detail: 'His glory over all we do.', swatch: 'yellow' },
];

export const HISTORY: { period: string; title: string; text: string }[] = [
  {
    period: '1996/97',
    title: 'A joint prayer gathering',
    text: 'JCCF began late in the 1996/97 session as a small gathering of believers praying together for the campus. It had no name yet. Its first programmes were noon combined prayers in the first week of resumption, a teaching weekend, and intercessory sessions as the need arose.',
  },
  {
    period: '1996/97',
    title: 'One body for every fellowship',
    text: 'FUTA management wanted every student fellowship registered under one Christian body. Five pioneer executives (President, Vice-President, General Secretary, Treasurer and Public Relations Officer) began writing a constitution.',
  },
  {
    period: '1997/98',
    title: 'Constitution and registration',
    text: 'A seven-member executive completed the constitution and formally registered the Joint Christian Campus Fellowship with FUTA management.',
  },
  {
    period: '2024',
    title: 'Constitution reviewed',
    text: 'The 26th Household Executive led a review of the constitution with fellowship presidents, staff advisers, the Grand Patron and alumni. Twenty-five fellowships and Christian groups were registered at the time.',
  },
  {
    period: 'Today',
    title: 'One Household',
    text: 'The constitution puts it this way: our emphasis is oneness of purpose, pressing towards the mark of growing into the measure of the stature of the fullness of Christ.',
  },
];

export const UNITS: Unit[] = [
  { name: 'Choir', summary: 'Leads worship at every Household programme with choirs from member fellowships.', icon: 'mic' },
  { name: 'Drama', summary: 'Ministers the gospel through drama at Household programmes and beyond.', icon: 'theater_comedy' },
  { name: 'Publicity', summary: 'Tells the campus about Household programmes through posters, media and this website.', icon: 'campaign' },
  { name: 'Ushering', summary: 'Keeps order, welcomes guests and records attendance at every programme.', icon: 'handshake' },
  { name: 'Organizing', summary: 'Secures venues and sets up stage, sound and light for Household programmes.', icon: 'event_available' },
];

export const ALUMNI_MISSION: string[] = [
  // PLACEHOLDER — the 5-point mission of JCCF Alumni is not in the 2024 constitution text we have.
  'Keep former members connected to the Household and to one another.',
  'Pray for and support the Household Executive and constituent fellowships.',
  'Mentor students in faith, academics and career.',
  'Support Household programmes and projects.',
  'Preserve the history and records of JCCF FUTA.',
];

/* ─────────────────────────── Fellowships (Appendix III, 2024) ─────────────────────────── */

const REGISTERED: [string, string][] = [
  ['Baptist Student Fellowship', 'BSF'],
  ['Charismatic Student Fellowship – Fountain of Life Community', 'CSF-FOLC'],
  ['Christ Apostolic Church Campus Fellowship', 'CACCF'],
  ['Christ Ambassador Student Outreach', 'CASOR'],
  ['Chapel Youth Fellowship', 'CYF'],
  ['Winners’ Campus Fellowship', 'WCF'],
  ['Scripture Union Campus Fellowship', 'SUCF'],
  ['Cherubim and Seraphim Church Unification Campus Fellowship', 'CSU'],
  ['Life Campus Fellowship', 'LCF'],
  ['Holiness Campus Fellowship', 'HCF'],
  ['Redeemed Christian Fellowship', 'RCF'],
  ['Methodist Campus Fellowship', 'MCF'],
  ['The Apostolic Church Student Fellowship of Nigeria', 'TACSFON'],
  ['Gofamint Student Fellowship', 'GSF'],
  ['ECWA Student Ministry', 'ESM'],
  ['Christian Fellowship International', 'CFi'],
  ['Rhema Campus Fellowship', 'RhemaCF'],
  ['Mountain of Fire and Miracles Campus Fellowship', 'MFMCF'],
  ['Apply Praise Student Ministry', 'APSM'],
  ['New Life Campus Fellowship', 'NLCF'],
  ['Foursquare Student Fellowship', 'FSF'],
  ['Anglican Student Fellowship', 'ASF'],
  ['All Christian Campus Fellowship', 'ACCF'],
  ['Campus Christian Fellowship – Nigeria Fellowship of Evangelical Students', 'CCF-NIFES'],
  ['The African Church Evangelical Students Fellowship', 'TACESF'],
];

// PLACEHOLDER schedules so the finder can be tried out. Every fellowship must confirm its own
// days, time and venue via the Excel template before launch.
const VENUES = ['Chapel of Faith Auditorium', 'Lecture Theatre A', 'SEET Auditorium', 'SAAT Lecture Hall', 'Obakekere Hall', 'Southgate Centre'];
const WEEKDAYS: Day[] = ['Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const FELLOWSHIPS: Fellowship[] = REGISTERED.map(([name, shortName], i) => ({
  slug: slugify(shortName),
  name,
  shortName,
  type: 'fellowship',
  description: `${name} (${shortName}) is a registered constituent fellowship of the JCCF FUTA Household.`,
  meetingDays: ['Sunday', WEEKDAYS[i % WEEKDAYS.length]],
  meetingTime: i % 3 === 0 ? '8:00 AM' : i % 3 === 1 ? '9:00 AM' : '4:00 PM',
  venue: VENUES[i % VENUES.length],
  status: 'active',
  placeholder: true,
}));

/* ─────────────────────────── Programmes ─────────────────────────── */

const FUTA_PRAYS = 'The Household prays together for the Federal University of Technology, Akure: its students, staff and management.';
const PULPIT_ROTATION =
  'Presidents of registered fellowships are assigned by the Household Executive to join and minister in other fellowships for the day. It builds love and unity among the fellowships on campus (constitution: “Change of Pulpit”).';

/** One calendar entry (date only; all-day in Africa/Lagos). */
function cal(slug: string, title: string, kind: string, startDate: string, endDate: string | undefined, summary: string, featured = false): Programme[] {
  return [{
    slug,
    title,
    kind,
    start: `${startDate}T00:00:00+01:00`,
    end: `${endDate ?? startDate}T23:59:00+01:00`,
    allDay: true,
    summary,
    body: paragraphs(summary, 'The time and venue will be announced on our WhatsApp channel and in the newsletter.'),
    featured,
  }];
}

export const PROGRAMMES: Programme[] = [
  // ── 2026/27 session: from the official JCCF Calendar 2026/27 (JCCF Calendar .pdf). ──
  // The calendar gives dates only, so these are all-day: no times or venues until the executive announces them.
  // COP meeting dates are internal and deliberately not listed.
  ...cal('jccf-cop-retreat-2026', 'JCCF COP Retreat', 'COP Retreat', '2026-10-17', undefined,
    'A retreat for the JCCF Committee of Presidents (JCCFCOP): the Household Executive and the presidents of the constituent fellowships.'),
  ...cal('futa-prays-nov-2026', 'FUTA Prays: November 2026', 'FUTA Prays', '2026-11-02', undefined, FUTA_PRAYS),
  ...cal('workers-retreat-2026', 'JCCF Workers’ Retreat', 'Workers’ Retreat', '2026-11-14', undefined,
    'A retreat for the workers of the Household and its units.'),
  ...cal('freshers-orientation-2026', 'JCCF Freshers’ Orientation', 'Freshers’ Orientation', '2026-11-28', undefined,
    'For new students: meet the Household, learn how JCCF works and find a fellowship to call home.'),
  ...cal('futa-prays-dec-2026', 'FUTA Prays: December 2026', 'FUTA Prays', '2026-12-01', undefined, FUTA_PRAYS),
  ...cal('pulpit-rotation-dec-2026', 'JCCF Pulpit Rotation', 'Pulpit Rotation', '2026-12-13', undefined, PULPIT_ROTATION),
  ...cal('prayer-and-prophetic-week-2027', 'Prayer and Prophetic Week 2027', 'Prayer and Prophetic Week', '2027-01-25', '2027-01-31',
    'Seven days of prayer as one Household, the week of prayers set by the JCCF constitution.', true),
  ...cal('futa-prays-feb-2027', 'FUTA Prays: February 2027', 'FUTA Prays', '2027-02-01', undefined, FUTA_PRAYS),
  ...cal('pulpit-rotation-apr-2027', 'JCCF Pulpit Rotation', 'Pulpit Rotation', '2027-04-25', undefined, PULPIT_ROTATION),
  ...cal('futa-prays-may-2027', 'FUTA Prays: May 2027', 'FUTA Prays', '2027-05-03', undefined, FUTA_PRAYS),
  ...cal('teaching-week-2027', 'Teaching Week 2027', 'Teaching Week', '2027-05-10', '2027-05-16',
    'A week of teaching from the Word for the whole Household.'),
  ...cal('futa-prays-jun-2027', 'FUTA Prays: June 2027', 'FUTA Prays', '2027-06-01', undefined, FUTA_PRAYS),
  ...cal('handover-service-2027', 'Handover Service 2027', 'Handover Service', '2027-06-06', undefined,
    'The outgoing Household Executive hands over to the new executive, and final-year brethren give thanks.'),
  // ── Past (from the YouTube channel) ──
  {
    slug: 'handover-service-2026',
    title: 'Handover Service and FYB Thanksgiving',
    kind: 'Handover Service',
    theme: 'Come Up Hither',
    start: '2026-07-12T13:00:00+01:00',
    venue: 'Chapel of Faith Auditorium, FUTA',
    summary: 'The outgoing executive handed over to the new Household Executive, and final-year brethren gave thanks.',
    flyer: yt('CsK_tJUPe2s', 'Handover Service and FYB Thanksgiving at JCCF FUTA'),
    relatedVideoIds: ['CsK_tJUPe2s'],
  },
  {
    slug: 'teaching-week-2026',
    title: 'Teaching Week ’26',
    kind: 'Teaching Week',
    theme: 'Knowing God; the prerequisite for doing exploit',
    start: '2026-06-15T17:00:00+01:00',
    end: '2026-06-21T19:00:00+01:00',
    venue: 'Chapel of Faith Auditorium, FUTA',
    summary: '“The people that do know their God shall be strong, and do exploits” (Daniel 11:32b).',
    flyer: yt('Sy1Hd53o2Ng', 'Teaching Week 2026 flyer: Knowing God, the prerequisite for doing exploit'),
    relatedVideoIds: ['CjPmVAGTxa0', 'qIZ5Ors3Op0', 'Sy1Hd53o2Ng', 'cVsHrjgXa60', 'b5RfR5jUrB0', 'yQhTAOx2qFw'],
  },
  {
    slug: 'workers-retreat-2025',
    title: 'Workers’ Retreat',
    kind: 'Workers’ Retreat',
    theme: 'Who can seek the Lord?',
    start: '2025-12-06T08:00:00+01:00',
    venue: 'GSF FUTA, Southgate, Akure',
    summary: 'A retreat for workers of the Household, from Psalm 24:3–6.',
    flyer: yt('rIxw54th1m8', 'Workers’ Retreat flyer: Who can seek the Lord?'),
    relatedVideoIds: ['rIxw54th1m8'],
  },
];

/** "Other programs" on the JCCF Calendar 2026/27: run through the session, no fixed dates. */
export const OTHER_PROGRAMMES: { title: string; text: string }[] = [
  { title: 'Prayer Walks', text: 'The Household walks and prays across campus. Dates are shared on our WhatsApp channel and in the newsletter.' },
  { title: 'Transformation Webinar Series', text: 'Online teaching sessions through the session. Links are shared on our WhatsApp channel and in the newsletter.' },
];

/* ─────────────────────────── Leadership ─────────────────────────── */

const TBC = 'Name to be confirmed';

export const LEADERS: Leader[] = [
  // PLACEHOLDER names — the current (27th) Household Executive must supply names, photos, department and level.
  { name: TBC, office: 'Household President', group: 'executive', order: 1, placeholder: true },
  { name: TBC, office: 'Vice President', group: 'executive', order: 2, placeholder: true },
  { name: TBC, office: 'General Secretary', group: 'executive', order: 3, placeholder: true },
  { name: TBC, office: 'Prayer/Evangelism Coordinator', group: 'executive', order: 4, placeholder: true },
  { name: TBC, office: 'PRO/Publicity Coordinator', group: 'executive', order: 5, placeholder: true },
  { name: TBC, office: 'Organizing Coordinator', group: 'executive', order: 6, placeholder: true },
  { name: TBC, office: 'Sisters Coordinator & Financial Secretary/Treasurer', group: 'executive', order: 7, placeholder: true },
  { name: TBC, office: 'Choir Coordinator', group: 'unit', order: 8, placeholder: true },
  { name: TBC, office: 'Drama Coordinator', group: 'unit', order: 9, placeholder: true },
  { name: TBC, office: 'Ushering Coordinator', group: 'unit', order: 10, placeholder: true },
  // From the JCCF Calendar 2026/27 (official, Nov 2026).
  { name: 'Prof. E. O. Laseinde', office: 'Grand Patron', group: 'adviser', order: 20 },
  { name: 'Dr (Mrs) M. O. Ajayi', office: 'Patroness', group: 'adviser', order: 21 },
  { name: 'Prof. Niyi Okunlola', office: 'Staff Adviser', group: 'adviser', order: 22 },
  { name: 'Prof. O. J. Olukunle', office: 'Staff Adviser', group: 'adviser', order: 23 },
];

/* ─────────────────────────── Posts ─────────────────────────── */

export const POSTS: Post[] = [
  {
    slug: 'new-jccf-futa-website',
    title: 'The JCCF FUTA website is live',
    type: 'announcement',
    date: '2027-01-01T09:00:00+01:00',
    placeholder: true,
    excerpt: 'Find a fellowship, see the next Household programme, watch sermons and give.',
    body: paragraphs(
      'The Publicity Unit is glad to launch the new JCCF FUTA website. It was built for phones and mobile data first.',
      'Use it to find a fellowship near you, see the next Household programme with a countdown, watch recent sermons, give, and send a private prayer request.',
      'If your fellowship’s details are wrong, tell your president to send corrections to the Publicity Unit.',
    ),
  },
  {
    slug: 'the-unity-of-the-faith',
    title: 'The unity of the faith',
    type: 'devotional',
    date: '2026-11-08T07:00:00+01:00',
    placeholder: true,
    excerpt: 'A short reflection on our motto, Ephesians 4:13.',
    author: 'JCCF Publicity Unit',
    body: paragraphs(
      'Ephesians 4:13 does not describe a merger of organisations. It describes a people growing up together into Christ.',
      'Our fellowships keep their names and their callings, but we share one Lord, one faith and one aim: the measure of the stature of the fullness of Christ.',
      'This week, pray for a fellowship that is not your own. Unity begins in prayer.',
    ),
  },
];

/* ─────────────────────────── Videos (channel feed snapshot) ─────────────────────────── */

const v = (id: string, title: string, published: string, series?: string): Video => ({
  id, title, published, series, thumbnail: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
});

/** Offline fallback when neither the Data API nor the RSS feed can be reached. */
export const SEED_VIDEOS: Video[] = [
  v('CsK_tJUPe2s', 'Handover Service and FYB Thanksgiving || Come Up Hither', '2026-07-12T13:07:42Z'),
  v('CjPmVAGTxa0', 'Teaching Week ’26 | Knowing God; the prerequisite for doing exploit | Day 7', '2026-06-21T12:49:20Z', 'Teaching Week 2026'),
  v('qIZ5Ors3Op0', 'Teaching Week ’26 | Knowing God; the prerequisite for doing exploit | Day 5', '2026-06-20T09:49:02Z', 'Teaching Week 2026'),
  v('Sy1Hd53o2Ng', 'Teaching Week ’26 | Knowing God; the prerequisite for doing exploit | Day 4', '2026-06-19T08:07:31Z', 'Teaching Week 2026'),
  v('cVsHrjgXa60', 'Teaching Week ’26 | Knowing God; the prerequisite for doing exploit | Day 3', '2026-06-18T08:57:02Z', 'Teaching Week 2026'),
  v('b5RfR5jUrB0', 'Teaching Week ’26 | Knowing God; the prerequisite for doing exploit | Day 2', '2026-06-17T07:49:34Z', 'Teaching Week 2026'),
  v('yQhTAOx2qFw', 'Teaching Week ’26 | Knowing God; the prerequisite for doing exploit | Day 1', '2026-06-16T07:59:27Z', 'Teaching Week 2026'),
  v('m9awLvk_bn8', 'Workers’ Retreat || Who can seek the Lord?', '2026-06-15T16:15:43Z'),
  v('rIxw54th1m8', 'Day 7 (Grand Finale) | 7-Day Online Prayer | Teaching Week 2026', '2026-06-15T09:18:54Z', 'Online Prayer'),
  v('UxkfwYzRU2I', 'Day 6 | 7-Day Online Prayer | Teaching Week 2026', '2026-06-14T09:18:18Z', 'Online Prayer'),
  v('DKhV2CcSubE', 'Day 5 | 7-Day Online Prayer | Teaching Week 2026', '2026-06-13T09:12:40Z', 'Online Prayer'),
  v('a9akMxNNGjs', 'Day 4 | 7-Day Online Prayer | Teaching Week 2026', '2026-06-12T09:15:57Z', 'Online Prayer'),
];

/* ─────────────────────────── Gallery ─────────────────────────── */

export const GALLERY: GalleryAlbum[] = [
  {
    slug: 'handover-service-2026',
    title: 'Handover Service 2026',
    date: '2026-07-12',
    cover: { ...PHOTOS.hall, alt: 'Worship at the 2026 Handover Service' },
    images: [
      { ...PHOTOS.hall, alt: 'Worship at the 2026 Handover Service' },
      { ...PHOTOS.stage, alt: 'Ministers on the JCCF stage' },
    ],
  },
  {
    slug: 'teaching-week-2026',
    title: 'Teaching Week 2026',
    date: '2026-06-21',
    cover: { ...PHOTOS.stage, alt: 'The JCCF stage during Teaching Week 2026' },
    images: [
      { ...PHOTOS.stage, alt: 'The JCCF stage during Teaching Week 2026' },
      yt('Sy1Hd53o2Ng', 'Teaching Week 2026 flyer'),
      yt('qIZ5Ors3Op0', 'Teaching Week 2026 Choir Concert flyer'),
    ],
  },
];

/* ─────────────────────────── Settings ─────────────────────────── */

export const SITE_SETTINGS: SiteSettings = {
  isLive: false,
  featuredProgrammeSlug: 'prayer-and-prophetic-week-2027',
  // PLACEHOLDER contact details — confirm with the General Secretary.
  // Real channels, taken from the previous official site (jccf-futa.onrender.com).
  whatsappChannel: 'https://whatsapp.com/channel/0029Vay9yRR3wtb1yrhKOh3w',
  email: 'info@jccffuta.org',
  phone: undefined,
  address: 'JCCF Secretariat, Federal University of Technology, Akure, Ondo State',
  mapUrl: 'https://maps.google.com/?q=Federal+University+of+Technology+Akure',
  socials: {
    youtube: 'https://www.youtube.com/@jccf_futa',
    instagram: 'https://www.instagram.com/jccffuta_gram/',
    facebook: 'https://www.facebook.com/people/JCCF-FUTA/100067526830978/',
    telegram: 'https://t.me/jccf_futa',
    whatsapp: 'https://whatsapp.com/channel/0029Vay9yRR3wtb1yrhKOh3w',
  },
  stats: [
    { value: 30, label: 'years as one Household', note: 'Started as a joint prayer gathering in 1996/97' },
    { value: FELLOWSHIPS.length, label: 'registered fellowships and Christian groups', note: 'Listed in the 2024 constitution' },
    { value: UNITS.length, label: 'Household units', note: 'Choir, Drama, Publicity, Ushering and Organizing' },
  ],
  liveWindows: [
    { day: 'Sunday', start: '15:30', end: '20:00' },
    { day: 'Monday', start: '16:30', end: '21:30' },
    { day: 'Tuesday', start: '16:30', end: '21:30' },
    { day: 'Wednesday', start: '16:30', end: '21:30' },
    { day: 'Thursday', start: '16:30', end: '21:30' },
    { day: 'Friday', start: '16:30', end: '21:30' },
    { day: 'Saturday', start: '07:30', end: '21:30' },
  ],
};

export const GIVE_SETTINGS: GiveSettings = {
  // PLACEHOLDER — bank details must come from the Financial Secretary/Treasurer via the CMS.
  bankName: undefined,
  accountName: 'Joint Christian Campus Fellowship, FUTA',
  accountNumber: undefined,
  categories: [
    { id: 'offering', label: 'Offering', kind: 'offering', open: true, description: 'Your regular offering to the Household.' },
    { id: 'partnership', label: 'Partnership', kind: 'partnership', open: true, description: 'Support the Household’s ongoing work: programmes, welfare and outreach.' },
    { id: 'prayer-and-prophetic-week-2027', label: 'Prayer and Prophetic Week 2027', kind: 'project', open: true, description: 'Help fund the Prayer and Prophetic Week.' },
  ],
  presetAmounts: [1000, 2000, 5000, 10000],
};
