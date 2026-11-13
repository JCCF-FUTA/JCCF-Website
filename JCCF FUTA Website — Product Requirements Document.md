# JCCF FUTA Website — Product Requirements Document

Nov 12, 2026 · @Big Builder

## Overview

We are rebuilding the JCCF FUTA website as a fast, mobile-first public site that executives update themselves, launching on 1 January 2027. It replaces the current site at [jccf-futa.onrender.com](https://jccf-futa.onrender.com/) and moves to the domain jccffuta.org.

**Who we are.** The Joint Christian Campus Fellowship (JCCF), Federal University of Technology, Akure, is the umbrella body for the Protestant student fellowships and Christian groups at FUTA. It started as a joint prayer gathering in the 1996/97 session and was formally registered with FUTA management in 1997/98. Its motto is "Till we all come in the unity of faith" (Ephesians 4:13).

**Why rebuild.** The old site has UI problems. It also renders its content with JavaScript only, so search engines and link previews see almost nothing. Its metadata gives the name two ways ("Joint Campus Christian Fellowship" and "Joint Christian Campus Fellowship"). The correct name is **Joint Christian Campus Fellowship**.

**Mandate.** The JCCF constitution gives the Publicity Unit responsibility for the Household website (Article 7, Section 4, Sub-section 3A). This PRD follows the constitution for names, structure, vision, doctrine and logo meaning.

## Goals, non-goals and success metrics

The site has one job above all: get every FUTA student to a fellowship and to JCCF programmes.

**Goals**

1. Help any FUTA student, especially freshers, find a fellowship by name, meeting day or venue.
2. Publicise Household programmes clearly, with a countdown to the next big one.
3. Share sermons and livestreams from YouTube without manual uploads.
4. Take gifts online (Paystack) and show bank details for transfers.
5. Let the PRO and General Secretary run the site with no developer.
6. Present JCCF accurately: history, vision, mission, doctrine and leadership.

**Non-goals for launch**

- Member accounts, logins for students, or a member database
- Programme registration or RSVP forms (only newsletter sign-up)
- Unit (choir, drama, ushering etc.) join forms
- Merch or an online shop
- Alumni sign-up or directory (alumni page is information only)
- Publishing the full constitution
- Audio sermons or podcasts

**Success metrics (first semester after launch)**

| Metric | Target | How measured |
| --- | --- | --- |
| Mobile Lighthouse performance score | 90 or higher | Lighthouse on a mid-range Android, throttled 4G |
| Home page weight | Under 1 MB on first load | Browser network panel |
| Fellowships with a complete profile | 100% of registered fellowships | CMS count |
| Newsletter sign-ups | Open question: set a target with the PRO | Supabase table count |
| Content updated by executives without developer help | Every event and announcement | CMS edit history |
| Online gifts received | At least one per combined programme | Paystack dashboard |

## Audience and user stories

The primary audience is FUTA students on phones and mobile data; everything is designed for a small screen and a slow connection first.

| Audience | Priority | What they need |
| --- | --- | --- |
| FUTA students, including freshers | Primary | Find a fellowship, see programmes, watch sermons, give, send prayer requests |
| Site admins (PRO, General Secretary, Publicity Unit) | Primary | Update content fast, read prayer requests, export subscribers |
| Constituent fellowships | Secondary | An accurate profile, sent to admins for update |
| Alumni, parents, staff advisers, FUTA management | Secondary | Who JCCF is, who leads it, how to reach it |

**User stories**

1. As a fresher, I want to filter fellowships by meeting day or venue, so I can visit one this week.
2. As a student, I want to see the next Household programme with a countdown, so I don't miss it.
3. As a student, I want to know when JCCF is live on YouTube, so I can join from my hostel.
4. As a student, I want to watch recent sermons on the site without searching YouTube.
5. As a student, I want to give by card or transfer to a named purpose, and see bank details if I prefer to pay at the bank.
6. As a student, I want to send a private prayer request that only the site owners can read.
7. As a student, I want to subscribe to the newsletter and join the WhatsApp channel.
8. As the PRO, I want to post an event or announcement from my phone in under five minutes.
9. As the General Secretary, I want to upload an Excel sheet to update all fellowship profiles at once.
10. As an incoming executive, I want to receive the site logins at handover and keep running it without the outgoing set.

## Sitemap and page requirements

The site has 13 public pages plus an admin studio; P0 pages must ship on 1 January, P1 pages ship then if time allows and within two weeks if not.

| Page | URL | Priority | Must include |
| --- | --- | --- | --- |
| Home | / | P0 | Live banner (when live); hero with countdown to next big programme; "Find a fellowship" search; upcoming programmes (3); latest sermons (3); latest announcement; give call-to-action; newsletter + WhatsApp sign-up |
| About | /about | P0 | History (1996/97 to now); vision (Eph 4:13); mission (7 points); doctrine (12 points); logo and its meaning; motto |
| Leadership | /leadership | P0 | Current Household Executive (7 offices) with photo, name, office, department, level; unit coordinators; staff advisers and patrons |
| Fellowships | /fellowships | P0 | Searchable list of constituent fellowships and Christian groups; filter by meeting day and venue; card per fellowship |
| Fellowship profile | /fellowships/\[slug\] | P0 | Logo, name, short description, meeting days and times, venue (with map link), contact (WhatsApp/phone), social links, president's name |
| Programmes | /programmes | P0 | Upcoming and past Household programmes; each with date, time, venue, flyer, description; add-to-calendar link; share to WhatsApp |
| Programme detail | /programmes/\[slug\] | P0 | Flyer, countdown, details, ministers, related sermons after the event |
| Media | /media | P0 | Live player when live; latest YouTube videos in a grid (auto); playlists by series; link to channel |
| Give | /give | P0 | Paystack checkout with category (Offering, Partnership/Support, Programme or Project) and amount; official bank details with copy button |
| Prayer request | /prayer | P0 | Form: name (optional), contact (optional), request, permission to follow up; confirmation message |
| Contact | /contact | P0 | Secretariat address, map, phone, email, social links, contact form |
| News | /news | P1 | Announcements and devotionals/blog posts, filter by type |
| Gallery | /gallery | P1 | Albums by programme; lazy-loaded, compressed images |
| Alumni | /alumni | P1 | Information only: mission of JCCF Alumni (5 points), how to reach the alumni executive |
| Admin studio | /studio | P0 | Sanity Studio, login for admins only (see Roles) |

**Global elements**

- Header: logo, Home, About, Fellowships, Programmes, Media, Give (button), menu for the rest
- Footer: motto, quick links, social icons (Instagram, Facebook, YouTube, WhatsApp), newsletter field, copyright
- Every page has a proper title, description and share image for WhatsApp and Instagram link previews

## Feature requirements

Nine features carry the site; each lists what it must do to count as done.

### F1. Content management (Sanity Studio)

- Admins edit these content types without code: Programme, Announcement, Post (devotional/blog), Fellowship, Leader, Unit, Gallery album, Give settings (bank details, categories), Site settings (live toggle, WhatsApp link, social links, featured programme).
- Any admin can publish directly; drafts are saved automatically.
- Images are uploaded once and served resized and compressed (WebP/AVIF) by Sanity's image CDN.
- Published changes appear on the site within 60 seconds (on-demand revalidation via webhook).
- The studio works on a phone browser.

### F2. Fellowship bulk import from Excel

- An admin uploads an .xlsx or .csv file from an Import page in the studio.
- A downloadable template has these columns: name, short\_name, description, meeting\_days, meeting\_time, venue, president\_name, contact\_phone, whatsapp\_link, instagram, facebook, logo\_url, status (active/inactive).
- The import shows a preview first: rows to add, rows to update (matched by name), rows with errors and why.
- Nothing is written until the admin confirms; rows with errors are skipped and listed.
- Fellowships missing from the sheet are not deleted; the admin marks them inactive.

### F3. YouTube sermons (automatic)

- The Media page and Home show the latest uploads from the @jccf\_futa channel with no manual step.
- Videos load as a lightweight thumbnail and open the player only when tapped (saves data).
- Admins can pin a video and group videos into series using YouTube playlists.
- Source: YouTube Data API v3 with a server-side key, cached for 30 minutes.

### F4. Live banner and countdown

- Home shows a countdown (days, hours, minutes, seconds) to the featured programme.
- When JCCF is live on YouTube, a "We are live" banner shows on every page and the Home hero becomes the live player.
- Live is detected two ways: an admin toggle in Site settings (always works), and an automatic check every 15 minutes during programme times set in the CMS (keeps within the free API quota).
- After the stream ends, the banner disappears and the countdown moves to the next featured programme.

### F5. Giving

- Paystack checkout, paying into the official JCCF account.
- The giver picks a category (Offering, Partnership/Support, Programme or Project) and an amount; name and email are required by Paystack, phone is optional.
- Admins add or close a Programme/Project category in the CMS (for example, a conference fund).
- A Paystack webhook records each successful payment (reference, amount, category, date) in Supabase for the Treasurer's records and the semester audit.
- The Give page also shows bank name, account name and account number from the CMS, with a copy button.

### F6. Private prayer requests

- Fields: name (optional), phone or email (optional), request (required), "You may contact me" checkbox.
- Requests are stored in Supabase with row-level security; only the two site owners (PRO and General Secretary) can read them.
- Owners read requests on a protected /owner/prayer page and mark each as "prayed for".
- Other admins and the CMS cannot see requests; no request text is ever sent by email.

### F7. Newsletter and WhatsApp

- An email sign-up field on Home, footer and Programmes stores the address in Supabase.
- Admins export subscribers as CSV, to send with a free email tool later.
- A "Join our WhatsApp channel" button links to the channel set in Site settings.

### F8. Contact form

- Fields: name, email or phone, subject, message; stored in Supabase and readable by all admins.

### F9. Social embeds

- Instagram: a strip of recent posts via a free, lazy-loaded widget (for example Behold), or admin-picked posts as a fallback.
- Facebook and YouTube appear as icon links in the header menu and footer.

**All forms** use Cloudflare Turnstile (free) against spam and show a clear success or error message.

## Roles and permissions

The PRO/Publicity Secretary and the General Secretary are joint site owners with final say on content; 2–3 Publicity Unit members are admins.

| Action | Site owner (PRO, General Secretary) | Admin (2–3 Publicity Unit members) | Developer | Public |
| --- | --- | --- | --- | --- |
| Create, edit, publish content | Yes | Yes | Yes | No |
| Import fellowships from Excel | Yes | Yes | Yes | No |
| Change bank details and give categories | Yes | No | No | No |
| Toggle "We are live" | Yes | Yes | Yes | No |
| Read prayer requests | Yes | No | No | Submit only |
| Read contact messages | Yes | Yes | No | Submit only |
| Export newsletter subscribers | Yes | Yes | No | Subscribe only |
| View Paystack records | Yes, plus the Treasurer read-only | No | No | No |
| Add or remove admins | Yes | No | Yes, at owner's request | No |

- Fellowships do not log in; they send profile changes to an admin, who updates the profile or re-imports the sheet.
- All accounts use the officer's role email (for example pro@jccffuta.org), never a personal email, so access passes with the office at handover.
- Each person signs in with their own login; shared passwords are not allowed.

## Design direction and brand

The look is bold and vibrant, in the style of the CCI Reboot Camp page ([rebootcamp.joincci.org](https://rebootcamp.joincci.org/)) and [joincci.org](https://joincci.org/): dark hero sections, big type, a live countdown and pillar cards. We borrow the style only. JCCF's own logo, colours, words and photos are used throughout; nothing of CCI's branding or copy is reused.

**Patterns to take from the reference**

- A full-height hero with the next programme's name, dates and a large countdown that switches to "We are live"
- Pillar cards that explain an idea in four to six short blocks
- Strong, short calls to action (Find a fellowship, Watch live, Give)
- Scarcity and urgency cues only where true (for example, "3 days left")

**Brand palette (from the logo, constitution Article 1, Section 2)**

| Role | Colour source | Meaning in the constitution |
| --- | --- | --- |
| Primary | Green, inner circle | Oneness of the Trinity; constant growth and fruitfulness |
| Accent | Red, outer circle | The blood of redemption |
| Highlight | Yellow glow | The glory of Christ |
| Base | Near-black and white | Dark hero sections; light reading pages |

Exact hex values are sampled from the official logo file once received.

**JCCF pillar cards (our version of R-I-C-H).** Six cards from the logo's symbols: the Dove (the Spirit of God), the Book (the Word of God), the Olive Branch (peace and covenant), the Green Circle (unity), the Red Circle (redemption), the Yellow Glow (glory). These sit on Home and About.

**Typography and motion**

- A bold display font for headings and a highly readable font for body text, both from Google Fonts, at most two families, self-hosted.
- Motion is light: fade and slide on scroll, a ticking countdown. It is turned off for users who set "reduce motion".

**Accessibility**

- WCAG 2.1 AA: text contrast at least 4.5:1, touch targets at least 44 px, keyboard navigable, alt text required on every CMS image.

## Technical architecture

The stack is Next.js on Vercel, Sanity for content and Supabase for form data, all on free tiers; the only fixed cost is the jccffuta.org domain renewal each year.

| Layer | Choice | Used for |
| --- | --- | --- |
| Framework | Next.js (App Router, TypeScript), Tailwind CSS | All pages, server-rendered and statically generated for speed and SEO |
| Hosting | Vercel (free plan) | Builds, CDN, serverless API routes, scheduled jobs |
| Content | Sanity (free plan), Studio at /studio | All editable content, images, Excel import tool |
| Data and auth | Supabase (free plan) | Newsletter, prayer requests, contact messages, payment log; owner login for /owner pages |
| Payments | Paystack | Card, transfer and USSD gifts; webhook to Supabase |
| Video | YouTube Data API v3 | Latest uploads, playlists, live status |
| Domain, DNS, email | jccffuta.org on Cloudflare DNS; Cloudflare Email Routing | Role emails (pro@, gensec@, info@) forwarded to the current officer |
| Spam protection | Cloudflare Turnstile | All public forms |
| Analytics | Vercel Web Analytics (free tier) | Page views, top pages, devices |

**Non-functional requirements**

- Performance: mobile Lighthouse 90+, first load under 1 MB, Largest Contentful Paint under 2.5 s on 4G.
- Data saving: images lazy-loaded and resized; YouTube players load only on tap; no auto-playing video.
- SEO: server-rendered HTML, one consistent name ("JCCF FUTA — Joint Christian Campus Fellowship"), standard meta and Open Graph tags, sitemap.xml, robots.txt.
- Security: secrets only in Vercel environment variables; Supabase row-level security on every table; Paystack webhook signature verified; admin and owner pages behind login.
- Privacy: prayer requests visible to site owners only; a short privacy note on every form.
- Reliability: a weekly scheduled job keeps the free Supabase project active (free projects pause after a period of no activity); Sanity content is exported to a backup once a month.
- Browser support: last two versions of Chrome, Safari, Samsung Internet, Opera Mini (basic content readable), Firefox.

## Timeline, milestones and handover

Launch is 1 January 2027, seven weeks from today; the critical path is content from the executives by 2 December and Paystack approval before go-live.

&#91;embedded content: build plan · 8 workstreams to launch on 1 Jan 2027\]

Week 1: sign off this PRD, buy the domain, open the accounts and apply to Paystack. Core pages are Home, About, Leadership, Fellowships and the Excel import. Media and forms cover Programmes, YouTube, the live banner, Give, Prayer, Contact and the newsletter. A soft launch on 28 December leaves three days for fixes.

**Handover checklist (at each executive handover service)**

- [ ] Outgoing owners add the incoming PRO and General Secretary as owners in Sanity, Supabase, Vercel, Paystack and Cloudflare
- [ ] Role emails (pro@, gensec@, info@) are re-pointed to the incoming officers
- [ ] Outgoing officers' access is removed the same week
- [ ] Incoming officers are walked through the admin guide (a short PDF plus a 10-minute screen recording)
- [ ] Domain renewal date and payment owner are confirmed
- [ ] Leadership page is updated with the new executive and unit coordinators
- [ ] A copy of all logins sits in a password manager vault owned by the JCCF role email, not by a person

## Risks and open questions

The biggest risk is late content, not code: a site with empty fellowship profiles fails its main goal.

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Fellowship data and executive photos arrive late | Launch with empty or placeholder pages | Send the Excel template to all presidents through JCCFCOP this week; content deadline 2 December |
| Paystack asks for registration documents JCCF lacks | No online giving at launch | Apply in the first week; launch with bank details only if not approved, switch on Paystack later |
| Free-tier limits (Vercel Hobby terms, Supabase pausing, YouTube API quota) | Downtime or broken features | Keep-alive job, cached API calls, live toggle fallback; move hosting to Cloudflare Pages or Netlify if Vercel terms are a problem |
| One developer, tight timeline | Slips past 1 January | P0/P1 split; P1 pages can follow within two weeks |
| Logins lost at executive handover | Site can't be updated | Role emails, password vault, handover checklist |
| Programme dates change after publishing | Wrong countdown, missed programmes | Admin edits update the site within 60 seconds; date shown beside every countdown |

**Open questions**

- [ ] Which Household programmes still run (combined Sundays, week of prayers, noon prayers, teaching weekend), what are their current names, and which one is the featured annual programme for the countdown?
- [ ] Logo file (SVG or high-resolution PNG), current executive names and photos, unit coordinators, staff advisers and patrons
- [ ] Secretariat address, official phone number and the WhatsApp channel link
- [ ] Is JCCF registered in a way Paystack accepts (for example a CAC registration or a university letter), and which signatory will own the Paystack account?
- [ ] Who pays for jccffuta.org each year, and from which budget line?
- [ ] Screenshots of what you like on joincci.org (the site could not be opened during this review)
- [ ] A newsletter sign-up target for the first semester
- [ ] Confirm the reading of "January first": all P0 pages live on 1 January 2027, P1 pages may follow
