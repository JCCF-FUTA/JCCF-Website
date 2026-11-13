# JCCF FUTA website

The public website of the **Joint Christian Campus Fellowship (JCCF), Federal University of Technology, Akure** — jccffuta.org.

- Product requirements: `JCCF FUTA Website — Product Requirements Document.md`
- Design system and build spec: `DESIGN.md` (tokens in `jccf-theme.css`)
- Content sources: `Reviewed JCCF Constitution (2024).pdf`, the official logo, the @jccf_futa YouTube channel

Stack: Next.js 16 (App Router, TypeScript) · Tailwind CSS v4 · Sanity (content, Studio at `/studio`) · Supabase (forms, payments log, staff login) · Paystack · YouTube · Cloudflare Turnstile · GSAP + Lenis. Hosted on Vercel.

---

## Run it locally

```bash
npm install
cp .env.example .env.local   # every key is optional to start
npm run dev                  # http://localhost:3000
```

**Every integration is optional.** With an empty `.env.local` the whole site works:

| Missing | What happens |
| --- | --- |
| Sanity | Pages use the seed content in `lib/content/seed.ts` (from the constitution). `/studio` shows setup instructions. |
| Supabase | In development, forms succeed and log to the terminal (prayer text is never logged). **In production they refuse with a friendly message**, so nothing a student sends is silently lost. |
| Paystack | The Give form shows “Online giving is being set up” and the bank details card stays visible. |
| YouTube API key | Sermons come from the channel’s public RSS feed (latest 15 videos). Playlists/series and automatic live detection need the key. |
| Turnstile | Forms work without the spam check. |

Other scripts: `npm run build`, `npm run typecheck`, `npm run theme -- "#FA0404"` (regenerate colours), `npm run icons` (rebuild the icon set after adding a name to `scripts/build-icons.mjs`).

---

## Setting up the services (free tiers)

Use the **role emails** (pro@, gensec@ …jccffuta.org) for every account — never a personal email — so access passes with the office at handover.

### 1. Sanity (content)
1. Create a project at sanity.io/manage → note the **Project ID**; dataset `production`.
2. Add CORS origins: `http://localhost:3000` and `https://jccffuta.org` (allow credentials).
3. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`.
4. Members: site owners (PRO, General Secretary) as **Administrator**; Publicity Unit admins as **Editor**. Only Administrators can publish *Give settings* (bank details and give categories).
5. Webhook (Settings → API → Webhooks): URL `https://jccffuta.org/api/revalidate`, all document types, create/update/delete, set a secret and put the same value in `SANITY_REVALIDATE_SECRET`. Published changes then appear within a minute.
6. Open `/studio`, fill in **Site settings** and **Give settings**, then add programmes, leaders, and use **Import fellowships** (top bar) to load the Excel sheet.

### 2. Supabase (forms and staff login)
1. Create a project → run `supabase/migrations/0001_init.sql` in the SQL editor.
2. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server only — never expose it).
3. Authentication → Users → add the owners (role emails), then give them a role:
   ```sql
   insert into public.site_roles (user_id, role, label)
   select id, 'owner', 'PRO' from auth.users where email = 'pro@jccffuta.org';
   ```
   Roles: `owner` (PRO, General Secretary), `admin` (Publicity Unit), `treasurer` (payments, read-only).
4. Staff sign in at `/owner`: prayer requests (owners only), contact messages, subscribers with CSV export, payments.

Row-level security is on for every table. Prayer requests can be read only by `owner` accounts, and their text is never emailed.

### 3. Paystack
1. Apply with the JCCF registration documents (see the PRD risks). Put the **secret key** in `PAYSTACK_SECRET_KEY`.
2. Settings → API Keys & Webhooks → webhook URL `https://jccffuta.org/api/give/webhook`. Each successful charge is recorded in Supabase `payments`.
3. Callback is automatic: givers return to `/give/thanks`, which verifies the payment server-side.

### 4. YouTube (optional key)
Google Cloud → enable *YouTube Data API v3* → API key (restrict to that API) → `YOUTUBE_API_KEY`. The channel ID is preset (`UCKBys_fv2AYhOVQ81RP0qug`). Live detection runs only inside the programme time windows set in Site settings and is cached 15 minutes, which keeps it within the free quota. The **“We are live”** switch in Site settings always works, with or without a key.

### 5. Cloudflare Turnstile
Add a site for `jccffuta.org` → `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`.

### 6. Deploy (Vercel)
Import the repo, add the env vars, set `NEXT_PUBLIC_SITE_URL=https://jccffuta.org`, `CRON_SECRET` (random string). `vercel.json` runs a weekly keep-alive so the free Supabase project never pauses. Point the domain via Cloudflare DNS.

---

## Content checklist before launch

Seed content marked **PLACEHOLDER** in `lib/content/seed.ts` is *not confirmed*. Replace it in the Studio:

- [ ] Programme names and dates (Week of Prayers 2027, Combined Sunday Service, Change of Pulpit, Teaching Week 2027) and which one is **featured** for the countdown
- [ ] Every fellowship’s meeting days, time, venue, president and contacts (send the Excel template to presidents through JCCFCOP). Cards show “Schedule to be confirmed” until then.
- [ ] Household Executive names, photos, department and level; unit coordinators
- [ ] Staff advisers and patrons (taken from the 2024 constitution appendix — confirm titles)
- [ ] Secretariat address, phone, WhatsApp channel, Instagram and Facebook links
- [ ] Bank name and account number (Give settings, owners only)
- [ ] The 5-point JCCF Alumni mission (not in the constitution text we have; the alumni page shows a draft)
- [ ] Real photos: the hero and photo bands use YouTube thumbnails until then (DESIGN §10)

## Handover (each new executive)

Follow the checklist in the PRD (“Handover checklist”). In short: outgoing owners add the incoming PRO and General Secretary as owners in Sanity, Supabase (`site_roles`), Vercel, Paystack and Cloudflare; re-point the role emails; remove outgoing access the same week; update the Leadership page.

---

## Project map

```
app/(site)/            public pages (Home, About, Leadership, Fellowships, Programmes, Media, Give, Prayer, Contact, News, Gallery, Alumni)
app/api/               newsletter, prayer, contact, give/initialize, give/webhook, revalidate, calendar/[slug] (.ics), cron/keepalive
app/owner/             staff area (Supabase login, RLS)
app/studio/            Sanity Studio
components/            UI primitives (ui/), site chrome (site/), and feature components
lib/data.ts            every content read: Sanity, else seed
lib/youtube.ts         sermons: Data API → RSS → snapshot
lib/live.ts            live status: admin toggle, else YouTube check in programme windows
lib/motion/            GSAP/Lenis motion layer driven by data-* attributes (DESIGN §8)
sanity/                schemas, Studio structure, Excel/CSV fellowship import tool
supabase/migrations/   database schema + row-level security
```

Brand colours were sampled from the official logo: red ring `#FA0404` (light-mode primary `#BC0001` for AA contrast), green `#06903F`, yellow glow `#FADD26`.
