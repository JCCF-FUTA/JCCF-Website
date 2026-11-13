# JCCF FUTA — Design System & Build Spec

> **For Claude Code.** This file is the single source of truth for how the JCCF FUTA website looks, moves and behaves. Build every page from the tokens and components defined here. When this file and your instincts disagree, follow this file. When something is not covered, extend the system in the same spirit and add it to this file.

- **Product:** jccffuta.org — public website of the Joint Christian Campus Fellowship (JCCF), Federal University of Technology, Akure. Umbrella body of the Protestant student fellowships at FUTA, est. 1996/97. Motto: *"Till we all come in the unity of the faith"* (Eph 4:13).
- **Stack:** Next.js (App Router, TypeScript) · Tailwind CSS v4 · Sanity (content) · Supabase (forms) · Paystack · YouTube Data API v3 · GSAP + ScrollTrigger · Lenis. Hosted on Vercel.
- **Companion files:** `jccf-theme.css` (Tailwind v4 theme — tokens below are already in it), `generate-theme.mjs` (regenerates colours from the logo red), `preview.html` (visual reference of this system).
- **Design basis:** [Material Design 3](https://m3.material.io) *principles and tokens* (colour roles, type scale, shape scale, 4dp grid, window size classes, state layers, motion easing/duration, accessibility). We do **not** use Material component libraries; components are custom, styled to the references below.
- **Visual references (style only — never copy their words, photos, logos or layouts 1:1):** Celebration Church International (joincci.org) for mood: dark stages, condensed caps, red accents, pill buttons. Aeline / Uixshuvo / Visa Travels concepts for the light sections: rounded 24px cards, airy spacing, stat tiles, filter bar on hero, image cards with chips.

---

## 0. Decisions at a glance

| Topic | Decision |
| --- | --- |
| Colour | **Red and white**, with a few traces of yellow. Sampled from the official logo (Nov 2026): red ring `#FA0404` → light `primary` `#BC0001` (white text 6.7:1), stage accent = exact logo red; yellow glow `#FADD26`; green `#06903F` (logo meaning only). |
| Mood | **Mix**: dark "stage" sections (hero, live, programmes, leadership, give, footer) + light, airy reading sections. |
| Type | **Anton** (condensed caps) for hero/display/headline. **Plus Jakarta Sans** for everything else. Both Google Fonts. |
| Shape | Rounded: cards 24px, feature panels 32px, buttons and chips fully round. |
| Motion | **Rich scroll animation** (GSAP ScrollTrigger + Lenis), lighter on phones, fully off with `prefers-reduced-motion`. |
| Dark mode | Supported. Follows the system, with a toggle in the header. Stage sections look the same in both modes. |
| Images | Until real photos arrive, use **thumbnails from the JCCF YouTube channel** as placeholders (see §10). |
| Pillars | Built from JCCF's **vision and 7-point mission** (constitution, Article 3). |
| Icons | **Material Symbols Rounded** (Google), weight 400, as individual SVG imports. |

---

## 1. Principles

1. **Phone first, data light.** Most visitors are FUTA students on mobile data. Design at 360px first. Every image is resized, lazy-loaded and modern-format. No autoplaying video.
2. **One Household.** The site shows many fellowships as one family. Repeat the idea visually: shared card shapes, the marquee of fellowship names, "unity" language.
3. **Stage and page.** Dark stages announce (who we are, what's next, what's live). Light pages inform (find, read, give). Never put long reading text on a stage.
4. **Bold, then quiet.** One loud thing per screen: a huge condensed headline, a red button or a countdown. Everything around it stays calm.
5. **Movement with meaning.** Animation reveals content in reading order and draws the eye to the next action. It never blocks reading or input.
6. **Accessible by default.** WCAG 2.1 AA everywhere. 48px touch targets. Visible focus. Content readable with animation off.

---

## 2. Colour

Built with Google's Material Color Utilities (`SchemeFidelity`) from the seed `#C8102E`, then tuned for "red and white": neutrals are near-grey instead of pink-tinted, and the exact brand red is kept as light `primary` because white on it passes AA (5.88:1). Tertiary is the logo's **yellow glow** and is used only in small amounts.

**To update from the real logo:** `node generate-theme.mjs "#<logo red>"` and paste the output into `jccf-theme.css`. Update the yellow constant in the script too.

### 2.1 Roles (use these names; never hard-code hex in components)

| Role → Tailwind utility | Light | Dark | Use |
| --- | --- | --- | --- |
| `primary` / `on-primary` | `#C8102E` / `#FFFFFF` | `#FFB3B1` / `#680011` | Main buttons (Give, Find), links, active states, red word in titles |
| `primary-container` / `on-primary-container` | `#FFDAD8` / `#410007` | `#C8102E` / `#FFDAD8` | Soft red chips, selected filters, newsletter card |
| `secondary` / `secondary-container` | `#A5393C` / `#FE7B7C` | `#FFB3B1` / `#882329` | Rare: secondary emphasis, hover tints |
| `tertiary` / `on-tertiary` | `#D9A300` / `#261A00` | `#FABD0D` / `#402D00` | **Yellow traces only**: "New" badge, star/highlight, countdown "soon" |
| `tertiary-container` | `#FFDF9F` | `#5B4300` | Highlight background on a single item |
| `error` / `error-container` | `#BA1A1A` / `#FFDAD6` | `#FFB4AB` / `#93000A` | Form errors only (not brand red) |
| `surface` / `on-surface` | `#FFFBFF` / `#1F1A1A` | `#171212` / `#EBE0DF` | Page background / text |
| `on-surface-variant` | `#504443` | `#D4C3C2` | Secondary text, meta, captions |
| `surface-container-lowest` | `#FFFFFF` | `#110D0D` | Cards on tinted sections |
| `surface-container-low` | `#FFF4F3` | `#1F1A1A` | Stat tiles, alternate section background |
| `surface-container` | `#F9EEED` | `#231E1E` | Inputs, filter bar |
| `surface-container-high/-highest` | `#F3E9E8` / `#EBE0DF` | `#2E2928` / `#393333` | Hover fills, sheets |
| `outline` / `outline-variant` | `#827473` / `#D4C3C2` | `#9C8D8C` / `#504443` | Field borders / dividers, card borders |
| `inverse-surface` / `inverse-on-surface` | `#352F2F` / `#F9EEED` | `#EBE0DF` / `#352F2F` | Snackbar |

### 2.2 Stage colours (always dark, both modes)

| Token → utility | Value | Use |
| --- | --- | --- |
| `stage` | `#0A0A0A` | Stage section background |
| `stage-container` / `-high` | `#161616` / `#222222` | Cards on stage |
| `on-stage` | `#FFFFFF` | Text on stage (19.8:1) |
| `on-stage-variant` | `#B8B8B8` | Secondary text on stage (9.98:1) |
| `stage-outline` | `rgb(255 255 255 / .24)` | Outline buttons, dividers on stage |
| `stage-accent` | `#E32B3E` | **Red display text on stage, ≥24px only** (4.41:1) |
| `stage-accent-text` | `#FF535B` | Red small text/links on stage (6.26:1) |
| `glow` | `#F5B800` | Yellow trace on stage: countdown separators, a star, focus ring (11.07:1) |
| `live` | `#E32B3E` | Live dot and badge |

Wrap stage sections in `.theme-stage` (defined in the theme). It remaps `surface`/`on-surface` roles locally so shared components render correctly inside. A light card that sits on a stage (finder bar, give card) gets `.theme-light`, which restores the page roles inside it (light in light mode, dark in dark mode).

### 2.3 Colour rules

- **Ratio:** ~70% white/surface, ~20% stage black, ~8% red, ≤2% yellow.
- **Red is for action and emphasis:** buttons, the one highlighted word in a title, live, active nav. Never fill large reading areas with red, except the Give band (§C17).
- **Yellow never carries text meaning alone** and never appears more than twice in a viewport.
- **Photo overlays on stage:** `linear-gradient(180deg, rgb(10 10 10 / .35) 0%, rgb(10 10 10 / .75) 60%, #0A0A0A 100%)`. Red duotone bands use `mix-blend-mode: multiply` with `#C8102E` at 85% over a grayscale photo.
- **Contrast is verified** (see `generate-theme.mjs` output). Any new pair must meet 4.5:1 for text, 3:1 for large text (≥24px, or ≥18.66px bold) and UI.

---

## 3. Typography

Load with `next/font/google`: `Anton` (400) as `--font-anton`, `Plus_Jakarta_Sans` (400, 500, 600, 700) as `--font-jakarta`. `display: 'swap'`, subsets `['latin']`.

| Token (utility) | Font | Size / line height | Weight | Case | Use |
| --- | --- | --- | --- | --- | --- |
| `text-hero` | Anton | clamp(48px, 10vw, 128px) / 0.92 | 400 | UPPER | Home hero headline only |
| `text-display-lg` | Anton | clamp(44px, 6vw, 57px) / 1.05 | 400 | UPPER | Inner page heroes |
| `text-display-md` | Anton | clamp(36px, 4.8vw, 45px) / 1.08 | 400 | UPPER | Section titles |
| `text-display-sm` | Anton | 36 / 44 | 400 | UPPER | Stat numbers, countdown digits, card numbers |
| `text-headline-lg/md/sm` | Anton | 32/40 · 28/36 · 24/32 | 400 | UPPER | Sub-section titles, give card title |
| `text-title-lg` | Jakarta | 22 / 28 | 600 | Sentence | Card titles (large) |
| `text-title-md` | Jakarta | 16 / 24 | 600 | Sentence | Card titles, nav items |
| `text-title-sm` | Jakarta | 14 / 20 | 600 | Sentence | List titles |
| `text-body-lg` | Jakarta | 16 / 24 | 400 | Sentence | Default body, lead paragraphs |
| `text-body-md` | Jakarta | 14 / 20 | 400 | Sentence | Card descriptions, meta |
| `text-body-sm` | Jakarta | 12 / 16 | 400 | Sentence | Captions, footnotes |
| `text-label-lg` | Jakarta | 14 / 20 | 600 | Sentence | Buttons |
| `text-label-md` | Jakarta | 12 / 16, +0.04em | 600 | UPPER | Eyebrow chips, badges |
| `text-label-sm` | Jakarta | 11 / 16, +0.05em | 600 | UPPER | Countdown unit labels, tiny badges |

Rules:
- Add class `type-hero` / `type-display` / `type-headline` with the Anton sizes (sets font, uppercase, tracking).
- **One highlighted word or line per title** in `text-primary` (light) or `text-stage-accent` (stage). E.g. "ONE HOUSEHOLD, **MANY FELLOWSHIPS**".
- Use tabular numbers (`tabular-nums`) for countdowns, stats, amounts, dates.
- Reading width max `max-w-prose` (672px). Body text never below 14px; never Anton below 24px.
- Write in plain sentence case outside Anton. No ALL-CAPS paragraphs.

---

## 4. Shape

| Token | px | Use |
| --- | --- | --- |
| `rounded-xs` | 4 | Focus ring offset, tiny badges |
| `rounded-sm` | 8 | Thumbnails inside lists, tooltips |
| `rounded-md` | 12 | Text fields, menus, snackbars |
| `rounded-lg` | 16 | Small cards (sermon, leader), filter bar segments |
| `rounded-xl` | 24 | **Default card**, image cards, hero frame (inner pages), stat tiles |
| `rounded-2xl` | 32 | Feature panels: give card, newsletter card, finder bar |
| `rounded-full` | — | Buttons, chips, icon buttons, avatars, live badge |

Images inside a card inherit the card radius at the top corners (`overflow-hidden`). Full-bleed sections (stage hero, photo bands) are square-edged.

---

## 5. Layout, spacing and grid

4dp grid: every size and gap is a multiple of 4 (Tailwind spacing base is 4px: `p-4` = 16px).

| Window class (M3) | Breakpoint utility | Width | Columns | Margin | Gutter | Section padding (y) |
| --- | --- | --- | --- | --- | --- | --- |
| Compact | (default) | 0–599 | 4 | 16 | 16 | 64 |
| Medium | `medium:` | 600–839 | 8 | 24 | 24 | 80 |
| Expanded | `expanded:` | 840–1199 | 12 | 32 | 24 | 96 |
| Large | `large:` | 1200–1599 | 12 | auto (content max 1200) | 32 | 128 |
| Extra-large | `xlarge:` | 1600+ | 12 | auto (content max 1200) | 32 | 128 |

- Page container: `mx-auto w-full max-w-content px-4 medium:px-6 expanded:px-8`.
- Spacing scale in use: 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 128.
- Inside cards: padding 20 (compact) / 24 (expanded+); gap between title and body 8; between blocks 16.
- Between section header and content: 40 (compact) / 56 (expanded+).
- Touch targets: **min 48×48px** for every tappable element, with 8px between targets.

---

## 6. Elevation and depth

Material 3 expresses depth mostly with **tonal surfaces**, not shadows. Light sections step through `surface` → `surface-container-low` → `surface-container-lowest` cards with a 1px `outline-variant` border. Shadows (`shadow-elev-1…5`) are reserved for things that float: sticky header after scroll (elev-2), floating cards on the hero (elev-3), bottom sheet and menus (elev-3), snackbar (elev-3), give card overlapping the band (elev-4). On stage use `stage-container` fills and `stage-outline` borders; no shadows.

Glass (only on photos): `bg-white/12 backdrop-blur-md border border-white/20` for icon circles and the floating "Next programme" card on the hero.

---

## 7. Interaction states (M3 state layers)

Every interactive element uses a **state layer**: an overlay of the content colour at a set opacity. Add class `state-layer` (in theme).

| State | Overlay opacity | Extra |
| --- | --- | --- |
| Hover | 8% | Cards also lift `-translate-y-1` and image scales 1.05 |
| Focus (keyboard) | 10% | 3px focus ring: `primary` on light, `glow` on stage, offset 2px |
| Pressed | 10% | Scale 0.98 for buttons, 150ms |
| Dragged | 16% | Carousels |
| Disabled | content 38%, container 12% | No hover, `aria-disabled` |
| Selected | `primary-container` fill + `on-primary-container` text + check icon | Filter chips, segmented buttons |

Loading: buttons show a 20px spinner replacing the leading icon and keep their width; cards show skeletons (§C26).

---

## 8. Motion system

The site should feel alive while scrolling. Motion follows M3 easing and duration tokens, runs on **transform and opacity only**, and plays **once** per element (except parallax and the marquee).

### 8.1 Tokens

| Easing (utility / GSAP) | Curve | Use |
| --- | --- | --- |
| `ease-emphasized-decelerate` | `cubic-bezier(.05,.7,.1,1)` | Things entering: reveals, hero text |
| `ease-emphasized-accelerate` | `cubic-bezier(.3,0,.8,.15)` | Things leaving: menu close, header hide |
| `ease-emphasized` / `ease-standard` | `cubic-bezier(.2,0,0,1)` | Hovers, state changes, toggles |

Durations (CSS vars `--md-dur-*`): short 50–200ms (hover, press, chip), medium 250–400ms (menus, cards), long 450–600ms (section reveals), extra-long 700–1000ms (hero intro, image reveals). GSAP: register `CustomEase` "emphasizedDecel" = `M0,0 C0.05,0.7 0.1,1 1,1`.

### 8.2 Libraries

- `gsap` + `ScrollTrigger` + `SplitText` (GSAP and all plugins are free) with `@gsap/react` `useGSAP()` for cleanup.
- `lenis` for smooth scrolling on desktop pointer devices only (leave native scroll on touch); connect it to ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)`).
- Put all motion code in `lib/motion/*` and client components; pages stay server components.

### 8.3 Catalogue (use these by name)

| ID | Name | What happens | Where | Phones (compact) |
| --- | --- | --- | --- | --- |
| M1 | **Hero intro** | Background scales 1.12→1 (1.6s); eyebrow fades in; each headline line rises from a mask (`yPercent 110→0`, 900ms, 120ms stagger, emphasized-decelerate); body + CTAs rise 24px; countdown digits flip in | Home hero | Yes |
| M2 | **Reveal up** | `[data-reveal="up"]`: opacity 0→1, y 40→0, 700ms, starts when top hits 85% of viewport; children stagger 80ms | Every section's content | Yes (y 24) |
| M3 | **Title split** | Display titles split by word; words rise from mask, 60ms stagger; highlighted word arrives last with red underline drawing left→right (M11) | Section headers | Yes |
| M4 | **Count up** | Stat numbers count from 0 to value over 1.2s, `tabular-nums` | Stat tiles | Yes |
| M5 | **Image reveal** | `clip-path: inset(100% 0 0 0)` → `inset(0)` + inner image scale 1.15→1, 1s | Card images, portrait | Yes |
| M6 | **Pinned horizontal scroll** | Mission section pins; cards travel horizontally as the user scrolls; progress bar fills | Vision & mission | **No** — swipe carousel with scroll-snap |
| M7 | **Parallax** | Background image `yPercent -12→12` scrubbed | Hero, photo bands, give band | **No** |
| M8 | **Marquee** | Fellowship names scroll endlessly (40s), pause on hover/focus | Fellowships strip | Yes |
| M9 | **Smart header** | Transparent over hero; solid `surface/85 + backdrop-blur` + elev-2 after 80px; hides on scroll down, returns on scroll up (300ms) | Header | Yes |
| M10 | **Card hover** | Lift 4px, image scale 1.05, arrow nudges 4px right, 300ms standard | All cards | Hover devices only |
| M11 | **Underline sweep** | `scaleX 0→1` red bar under the highlighted word, 600ms | Titles, active nav | Yes |
| M12 | **Live pulse** | Red dot with expanding ring, 1.6s loop | Live badge, live banner | Yes |
| M13 | **Overlap rise** | Give card rises 80px over the red band as it enters | Give band | Yes (40px) |
| M14 | **Scroll progress** | 2px red bar at the top of the viewport scaled by page progress | Long pages (About, posts) | Yes |
| M15 | **Stagger grid** | Grid items reveal in reading order, 60ms stagger, max 8 animated, rest instant | Fellowship grid, sermons, gallery | Yes |
| M16 | **Page transition** | Content fades 0→1 and rises 12px in 300ms on route change | All routes | Yes |
| M17 | **Magnetic button** | Primary hero CTAs drift up to 6px toward the pointer | Hero CTAs only | No |

### 8.4 Motion rules

- Use `gsap.matchMedia()` with three contexts: `(min-width: 840px) and (prefers-reduced-motion: no-preference)` = full set; `(max-width: 839px) and (prefers-reduced-motion: no-preference)` = the "Phones" column above; `(prefers-reduced-motion: reduce)` = **nothing animates**, all content visible immediately.
- Content must be visible without JavaScript: elements start hidden only when `html.js-motion` is set by the motion script.
- Never animate `width`, `height`, `top`, `left`, `filter: blur` on scroll. Never delay a CTA's appearance more than 1.2s after load.
- Max one pinned section per page.
- Keep the 60fps target on a mid-range Android. If a test phone drops frames, cut M7 and M6 first.

---

## 9. Iconography

- **Material Symbols Rounded**, weight 400, grade 0, optical size 24, outlined (fill 0) by default; fill 1 for selected states.
- Import individual SVGs (`@material-symbols/svg-400/rounded/<name>.svg` via SVGR) — never the full icon font (too heavy for mobile data).
- Sizes: 20 (inside buttons/chips), 24 (default), 32 (icon circles), 40 (empty states).
- Icon circles (pillar cards, hero glass cards): 48px circle, `bg-white/12 backdrop-blur-md border-white/20` on photos; `primary-container` on light.
- Common icons: `live_tv`, `play_arrow`, `calendar_month`, `schedule`, `location_on`, `groups`, `church`, `volunteer_activism`, `favorite`, `mail`, `call`, `chat` (WhatsApp uses its brand SVG), `arrow_forward`, `north_east`, `search`, `tune`, `close`, `menu`, `content_copy`, `check`, `dark_mode`, `light_mode`, `share`.
- Social icons (Instagram, Facebook, YouTube, WhatsApp): official brand SVGs, monochrome `on-stage` in the footer.

---

## 10. Imagery

**Placeholders (until real photos arrive): JCCF YouTube thumbnails.**
- Fetch the channel's latest uploads with the YouTube Data API (same client as feature F3). Thumbnail URL: `https://i.ytimg.com/vi/<VIDEO_ID>/maxresdefault.jpg` (1280×720), fallback `hqdefault.jpg`.
- Add `i.ytimg.com` and `cdn.sanity.io` to `images.remotePatterns` in `next.config.ts`.
- Create `lib/placeholder-images.ts` exporting `getPlaceholderImages(count)` that returns thumbnails from the latest videos. Every image slot (hero, bands, cards) falls back to it when the CMS image is empty. Remove the fallback once real photos are uploaded.
- In local development without an API key, fall back to a neutral gradient block (`bg-gradient-to-br from-stage-container to-stage`) with the JCCF logo watermark at 6% opacity. Never ship stock photos of other churches.

**Art direction**
- Real people from FUTA: worship moments, crowds with hands raised, choir, ushers, campus landmarks. Warm, high contrast.
- Stage photos sit under the dark overlay (§2.3). Leadership portraits are **black-and-white**, turning to colour on hover (desktop) or when in view (phones).
- Aspect ratios: hero 16:9 (cover), fellowship photo card 3:4, mission card 3:4, programme flyer 4:5, sermon 16:9, leader 4:5, gallery mixed.
- Always `next/image` with `sizes`, AVIF/WebP, `placeholder="blur"` (LQIP from Sanity). Hero image `priority`; everything else lazy.
- Every image has alt text written for meaning ("Choir ministering at the 2026 Week of Prayers"), or `alt=""` when decorative.

---

## 11. Components

Each component lists: purpose · anatomy · variants · states · responsive · accessibility · motion. File paths are suggestions under `components/`.

### C01 Header (top app bar) — `components/site/Header.tsx`
- **Anatomy:** logo (40px, links home) · nav links (About, Fellowships, Programmes, Media, Give) · live chip (only when live) · theme toggle (icon button) · **Give** filled button · menu icon button (compact/medium).
- **Variants:** `over-stage` (transparent, `on-stage` text) on pages that start with a stage hero; `solid` (`surface/85`, blur, `on-surface` text) after 80px or on pages without a stage hero.
- **States:** active link = `primary` text + 2px underline (M11); hover = state layer; hidden on scroll down.
- **Responsive:** compact/medium: logo + Give (small) + menu button; expanded+: full nav. Height 64 (compact) / 72 (expanded+).
- **A11y:** `<header>` + `<nav aria-label="Main">`; skip link "Skip to content" as first focusable element; `aria-current="page"` on active link.
- **Motion:** M9.

### C02 Live banner — `components/live/LiveBanner.tsx`
- **When:** `siteSettings.isLive` or YouTube live detected (feature F4).
- **Anatomy:** full-width strip, `bg-live text-white`, 44px tall: pulsing dot · "WE ARE LIVE" (label-md) · stream title (body-md, truncate) · "Watch now →" link.
- **Behaviour:** sits above the header on every page; dismissible for the session (close icon button, 48px target).
- **A11y:** `role="status"`; link names the stream.
- **Motion:** M12; slides down 300ms emphasized-decelerate when it appears.

### C03 Eyebrow chip — `components/ui/Eyebrow.tsx`
- Pill above a title: 6px dot (`primary`, or `live` when live) + text `label-md` UPPER. Padding 6×12, `rounded-full`.
- Light: `bg-surface-container text-on-surface-variant`. Stage: `bg-white/8 border border-stage-outline text-on-stage-variant`.
- Examples: "OUR VISION", "SINCE 1996/97", "NEXT PROGRAMME", "FIND YOUR FAMILY".

### C04 Buttons — `components/ui/Button.tsx`
| Variant | Light | Stage | Use |
| --- | --- | --- | --- |
| `filled` | `bg-primary text-on-primary` | `bg-primary text-white` | One main action per view (Give, Find a fellowship, Subscribe) |
| `filled-inverse` | — | `bg-white text-stage` | Main action on stage when red would clash (Watch live) |
| `tonal` | `bg-primary-container text-on-primary-container` | `bg-white/10 text-on-stage` | Secondary actions |
| `outlined` | `border-outline text-primary` | `border-stage-outline text-on-stage` | Tertiary (Quick links, See all) |
| `text` | `text-primary` | `text-stage-accent-text` | Inline "Learn more →" |
| `icon` | 48px circle, any of the above fills | | Carousel arrows, play, close, theme |
- **Sizes:** `md` height 48, padding x 24, `text-label-lg`; `sm` height 40 (visual) with a 48px hit area; `lg` height 56, padding x 32 (hero CTAs).
- **Icons:** leading or trailing 20px, gap 8. Arrow buttons use trailing `arrow_forward`, which nudges 4px on hover.
- **States:** §7. Disabled = 38% content, 12% container. Loading = spinner, `aria-busy="true"`.
- **A11y:** real `<button>` or `<a>`; icon-only buttons need `aria-label`.

### C05 Hero (Home) — `components/home/Hero.tsx` (stage)
- **Anatomy (top→bottom):** background photo + overlay · eyebrow "OUR VISION" · `text-hero` headline in 3 lines: **"TILL WE ALL COME / IN THE UNITY / OF THE FAITH"** with the last line in `stage-accent` · body-lg line: "The Joint Christian Campus Fellowship, FUTA — one Household of every fellowship on campus since 1996/97." · CTA pair: `filled` lg "Find a fellowship" + `outlined` lg "Watch live" (becomes `filled-inverse` with live dot when live) · countdown card (C06) for the featured programme · finder bar (C07) attached to the bottom edge.
- **Layout:** `min-h-[100svh]` (max 960px). Compact: centred text, countdown below CTAs, finder collapses to one search field + filter button. Expanded+: text left (7 cols), floating glass "Next programme" card with countdown right (5 cols), finder bar spanning 12 cols overlapping the hero bottom by 50% of its height.
- **Live state:** the right card becomes the live player teaser (thumbnail + LIVE badge + "Join now"); headline stays.
- **A11y:** the headline is the page's only `<h1>`; the background image is decorative (`alt=""`).
- **Motion:** M1, M7, M17.

### C06 Countdown — `components/programmes/Countdown.tsx`
- **Anatomy:** programme name (title-md) · date line (body-md, e.g. "Sun 14 Feb 2027 · 4:00 PM · Multipurpose Hall") · 4 units: digits `text-display-sm tabular-nums` + label `text-label-sm` (DAYS, HRS, MIN, SEC), separators `:` in `glow`.
- **States:** counting · starting soon (<1h: "STARTING SOON" chip in `tertiary-container`) · live (replaced by LIVE badge + "Watch now") · ended (moves to the next featured programme; if none, hides).
- **Variants:** `stage` (glass card on hero), `light` (programme detail page), `chip` (compact single line "In 3 days" for cards).
- **A11y:** digits are `aria-hidden`; a visually hidden sentence states the date and time. Do not use `aria-live` on ticking digits.
- **Motion:** digits flip (yPercent 100→0, 250ms) on change; nothing when reduced motion.

### C07 Fellowship finder bar — `components/fellowships/FinderBar.tsx`
- **Anatomy (expanded+):** one `rounded-2xl` bar, `bg-surface-container-lowest`, elev-3, split into segments separated by `outline-variant` dividers: **Search** (fellowship name) · **Meeting day** (Sun–Sat select) · **Venue** (select, from CMS) · **Type** (Fellowship / Christian group) · **Find** filled button (full height, right).
- Each segment: label `label-md` on-surface-variant + value body-md. 72px tall.
- **Compact:** search field (56px) + `tune` icon button opening a **bottom sheet** (C24) with the selects and "Show results".
- **Behaviour:** submits to `/fellowships?q=&day=&venue=&type=`. The same component sits at the top of the Fellowships page with live filtering.
- **A11y:** a `<form role="search">`; every field has a visible label; selects are native `<select>` for best phone support.
- **Light island on a stage:** the bar is a light surface inside the dark hero. Wrap it in `.theme-light` (below) so buttons and fields inside use light roles, not stage roles. Same for the give card and any light card placed on a dark section.
- **Motion:** M2, rising after the hero intro.

### C08 Stat tiles — `components/home/Stats.tsx`
- 4 tiles in a row (2×2 on compact): number `text-display-sm` + label body-sm. `bg-surface-container-low rounded-xl p-6`.
- **Content (confirm real numbers):** "30 YEARS — of one Household (since 1996/97)" · "[N] FELLOWSHIPS — and Christian groups" · "8 UNITS — serving every programme" · "[N] — YouTube views". Numbers come from CMS `siteSettings.stats`.
- **Motion:** M4 + M15.

### C09 Section header — `components/ui/SectionHeader.tsx`
- Eyebrow · display-md title with one highlighted word · optional body-lg (max 56ch) · optional action (text button "See all →") or carousel arrows (C21) aligned right on expanded+.
- Alignment: left by default; centred for statement sections (vision, give).
- **Motion:** M3 + M11.

### C10 Vision & mission (pillars) — `components/about/Pillars.tsx`
- **Vision block:** eyebrow "OUR VISION" · display-md: "RAISING A PEOPLE THAT WILL COME IN THE **UNITY OF THE FAITH**" · body-lg: the full vision text with "Ephesians 4:13".
- **Mission cards (7):** tall `rounded-xl` image card, 3:4, photo + bottom gradient · top-left number "01"–"07" in Anton 24 · top-right icon circle (glass) · bottom: title (title-lg, white) + one line (body-md, white/80).
  1. **Unity** (`groups`) — Fostering unity among Christian fellowships and groups on campus.
  2. **Harmony** (`calendar_month`) — Harmonising programmes, times and venues so fellowships never clash.
  3. **Edification** (`menu_book`) — Organising Household programmes that build up every believer.
  4. **Bridge** (`account_balance`) — Linking the University authority and the registered fellowships.
  5. **Sound doctrine** (`verified`) — Guarding the campus against strange doctrines.
  6. **Wellbeing** (`favorite`) — Caring for the total wellbeing of Christians on campus.
  7. **Guidance** (`explore`) — Serving as a spiritual guide to the land.
- **Layout:** expanded+: pinned horizontal track (M6) with a progress bar; compact/medium: horizontal scroll-snap carousel (cards 80% width, peeking next card) with dots.
- **A11y:** an ordered list (`<ol>`); the carousel is scrollable by keyboard (`tabindex="0"` region with `aria-label="Our mission"`).

### C11 Fellowship cards — `components/fellowships/FellowshipCard.tsx`
- **`photo` variant (Home row, like "Visit CCI"):** 3:4 image card `rounded-xl`, gradient bottom, name (title-lg, white), meeting chip ("Sundays · 8 AM"). Row of 5 on large, horizontal scroll on smaller screens.
- **`listing` variant (Fellowships page, like Visa listings):** `bg-surface-container-lowest border outline-variant rounded-xl p-5`: header row = logo (48px circle) + name (title-md) + type chip; image (16:10, rounded-lg); meta rows with icons: `calendar_month` days · `schedule` time · `location_on` venue; footer = "View profile →" text button + WhatsApp icon button.
- **States:** hover lift (M10); focus ring on the whole card (the card is one link; the WhatsApp button is a separate link above it via z-index).
- **Empty fields:** hide the row; never show "N/A".
- **Motion:** M5 + M15.

### C12 Programme card — `components/programmes/ProgrammeCard.tsx` (stage or light)
- **Anatomy:** flyer 4:5 `rounded-xl` · date block overlay top-left (day `text-display-sm` + month `label-md`, `bg-primary text-white rounded-lg`) · status chip top-right (Upcoming / Live / Past) · title (title-lg) · meta: time, venue · countdown chip (C06 `chip`) · actions: "Details →", add-to-calendar icon button, share icon button (WhatsApp share URL).
- **Featured variant:** horizontal on expanded+ (flyer left 5 cols, content right 7 cols) with full countdown.
- **Motion:** M5, M15.

### C13 Sermon video card — `components/media/SermonCard.tsx`
- **Anatomy:** 16:9 thumbnail `rounded-lg` · centred 56px play circle (`bg-white/90 text-stage`) · duration badge bottom-right (`bg-black/75 text-white label-sm`) · title (title-md, 2-line clamp) · meta (date · series) body-sm.
- **Behaviour:** click swaps the thumbnail for a YouTube iframe (lite embed pattern, `youtube-nocookie.com`, `?autoplay=1`). No iframe loads before the tap.
- **Live variant:** red LIVE badge top-left with M12.

### C14 Live player — `components/live/LivePlayer.tsx` (stage)
- 16:9 lite embed `rounded-xl`, LIVE badge, title (headline-sm), "Share" and "Open on YouTube" buttons, short schedule note. Becomes the first section of Media and replaces the hero card on Home when live.

### C15 Leadership — `components/leadership/*`
- **President split (Home teaser + Leadership page top, stage):** left: B&W portrait 4:5 with M5; right: eyebrow "HOUSEHOLD PRESIDENT" · name in display-sm · office + department/level · a short charge or quote (body-lg, max 3 sentences) · "Meet the executive →".
- **Leader card:** portrait 4:5 `rounded-lg` grayscale → colour on hover/in view · name (title-md) · office (label-md, `primary`) · department, level (body-sm). Grid: 2 cols compact, 3 medium, 4 expanded+.
- **Order (constitution):** President, Vice President, General Secretary, Prayer Secretary, PRO/Publicity Secretary, Transport & Organising Secretary, Sisters Coordinator & Financial Secretary/Treasurer; then unit coordinators; then staff advisers & patrons.

### C16 Photo band — `components/ui/PhotoBand.tsx`
- Full-bleed image (min-h 480 compact / 560 expanded) with red duotone (§2.3) **or** dark overlay; content left-aligned in the container: display-md headline (white) + body-lg + one button. Example: "ONE HOUSEHOLD. **ONE FAITH.**" / "Every combined service, every fellowship suspends its meeting and we gather as one."
- **Motion:** M7 (parallax), M3.

### C17 Give section — `components/give/*`
- **Band:** `bg-primary` section (the only large red area) with a faint hand/dove line illustration (SVG, white 12%).
- **Give card** overlapping the band top by 80px (M13): `bg-surface-container-lowest rounded-2xl elev-4 p-6/10`:
  - headline-lg "GIVE TO **THE HOUSEHOLD**" + body-md "Your giving funds combined programmes, welfare and outreach on campus."
  - **Category** segmented buttons: Offering · Partnership · Programme/Project (project picker appears when chosen).
  - **Amount** chips: ₦1,000 · ₦2,000 · ₦5,000 · ₦10,000 · Other (opens a number field, min ₦100).
  - Fields: name, email (required by Paystack), phone (optional).
  - `filled` lg "Give ₦X with Paystack" (label updates live); note: "Secured by Paystack."
  - **Bank transfer** card beside (expanded+) or below (compact): bank name, account name, account number in `text-title-lg tabular-nums` + `content_copy` button → snackbar "Account number copied".
- **States:** processing (button loading), success (full-card success state with `check_circle`, reference number), failed (inline error + retry).

### C18 Newsletter card — `components/engage/NewsletterCard.tsx`
- `rounded-2xl p-6/10`. Light: `bg-primary-container text-on-primary-container`; on stage: `bg-stage-container`.
- Title headline-sm "STAY IN THE **LOOP**" · body-md "Programme dates, announcements and devotionals. No spam." · inline field + button (email field 56px, `filled` "Subscribe"; stacked on compact) · "Join our WhatsApp channel" tonal button with WhatsApp icon · privacy line body-sm.
- **States:** idle · submitting · success (replace form with "You're in. Check your inbox." + check icon) · error (field error text).

### C19 Form fields — `components/ui/fields/*` (M3 outlined text fields)
- Height 56, `rounded-md`, 1px `outline` border; focus = 2px `primary` border; label floats to the border on focus/filled; helper text body-sm below; error = `error` border + error text + `error` icon; counter for textarea.
- Types: text, email, tel, number, textarea (prayer request min 4 rows), native select, checkbox (24px box, 48px target), radio, segmented button, switch (theme toggle in the menu).
- Required fields marked "(required)" in the label, not with a red asterisk alone.
- Forms: prayer request, contact, newsletter, give. All use Turnstile (invisible) and show a snackbar on success.

### C20 Chips and badges — `components/ui/Chip.tsx`
- **Filter chip** (32px visual, 48 target, `rounded-full`, `outline-variant` border; selected = `primary-container` + check icon).
- **Status chips:** Upcoming (`surface-container-high`), Live (`live` + white + dot), Past (`surface-container` + on-surface-variant), New (`tertiary-container` — a yellow trace), Starting soon (`tertiary-container`).
- **Meta badge on images:** `bg-black/60 text-white backdrop-blur label-sm rounded-full px-2.5 py-1`.

### C21 Carousel controls — `components/ui/CarouselControls.tsx`
- Prev/next 48px icon buttons (`outlined` on light, `bg-white/10` on stage), dots or a 2px progress bar. Native horizontal scroll with `scroll-snap-type: x mandatory`; buttons scroll by one card. Disabled at the ends. Keyboard: arrows scroll when focused.

### C22 Fellowship marquee — `components/fellowships/Marquee.tsx`
- A strip under the fellowship row listing every fellowship name in Anton 28px with a small red ✦ separator (or a logo when available), `on-surface-variant` at 70%. Duplicated content for the loop (`aria-hidden` on the copy). Pauses on hover/focus. M8.

### C23 Footer — `components/site/Footer.tsx` (stage)
- **Top row:** logo + motto (body-md italic) + newsletter mini form.
- **Columns:** Explore (About, Leadership, Fellowships, Programmes) · Watch & read (Media, News, Gallery) · Get involved (Give, Prayer request, Contact, Alumni) · Connect (address of the Secretariat, email, phone, socials as 48px icon buttons).
- **Bottom row:** "© 2027 Joint Christian Campus Fellowship, FUTA" · "Built by the JCCF Publicity Unit" · theme toggle.
- Compact: columns become accordions. No duplicated sections.

### C24 Bottom sheet & navigation drawer
- **Bottom sheet** (compact filters): `bg-surface-container-low rounded-t-2xl`, drag handle 32×4, scrim `black/40`, max 85vh, focus trapped, closes on scrim tap, Esc or swipe down.
- **Navigation drawer** (compact/medium menu): full-screen stage panel; links in `text-display-md` Anton with numbers, staggered in (M2, 50ms); Give + Watch live buttons at the bottom; socials. Opens 400ms emphasized-decelerate, closes 200ms emphasized-accelerate.

### C25 Snackbar
- `bg-inverse-surface text-inverse-on-surface rounded-md elev-3`, bottom centre (compact: bottom with 16px margin), 4s, optional action. `role="status"`.

### C26 Loading & empty states
- **Skeleton:** `bg-surface-container-high` blocks matching the final layout, shimmer 1.5s (off with reduced motion).
- **Empty:** 40px icon, title-md, body-md, one action. E.g. no fellowships match → "No fellowship matches those filters." + "Clear filters".
- **Errors:** friendly sentence + retry; never raw error text.

### C27 Theme toggle
- Icon button `dark_mode` / `light_mode`; first visit follows the system; choice stored in `localStorage` and applied by an inline script in `<head>` before paint (no flash). Stage sections do not change.

### C28 Inner page hero — `components/ui/PageHero.tsx` (stage)
- Height 50svh (min 360): photo + overlay, breadcrumb (label-md), `text-display-lg` title with one highlighted word, body-lg intro, optional actions. Used on every page except Home.

### C29 Gallery (P1) — masonry grid (2/3/4 columns), albums as cards with count badge; lightbox with swipe, keyboard arrows, Esc, and captions.

### C30 Prose (posts, About history, doctrine)
- `max-w-prose`, body-lg, paragraphs 16px apart, h2 in `text-headline-md` Anton, h3 title-lg; blockquote with 4px `primary` left bar and Anton 24 text; scripture references in `on-surface-variant`; doctrine as a numbered list.

---

## 12. Page layouts

Section order top → bottom. **S** = stage (dark), **L** = light. Alternate S and L so the page breathes.

### Home `/`
1. C02 Live banner (if live)
2. C01 Header (`over-stage`)
3. **S** C05 Hero + C06 countdown + C07 finder bar
4. **L** C08 Stats
5. **L** "Welcome to the Household": C09 header + 3 large image cards (`rounded-xl`, 4:5 compact / 3:4 expanded) → **Find a fellowship** · **Watch & listen** · **Give** — each with title-lg + one line + arrow (from CCI's "Welcome home")
6. **S** C10 Vision & mission (pinned)
7. **L** "One Household, **many fellowships**": C09 + C11 photo row + C22 marquee + "See all fellowships" button
8. **S** "What's **next**": featured C12 + 3 upcoming C12 cards
9. **L** C16 photo band (red duotone)
10. **L** "Latest **sermons**": C09 with arrows + C13 carousel (C14 replaces it when live)
11. **S** C15 president split
12. **Red** C17 Give band
13. **L** C18 Newsletter + Instagram strip (feature F9)
14. **S** C23 Footer

### About `/about`
C28 ("WHO **WE ARE**") → history timeline (1996/97 joint prayers → 1997/98 constitution and registration → today; vertical line with dots, each entry reveals with M2) → C10 vision & mission → doctrine (C30 numbered list, 12 points) → logo meaning (logo large + six symbol rows: Dove, Book, Olive branch, green circle, red circle, yellow glow) → structure diagram (Household Executive → JCCFCOP → constituent fellowships → units) → CTA band.

### Leadership `/leadership`
C28 → C15 president split → executive grid (C15 cards) → unit coordinators grid → staff advisers & patrons → "Hall of leaders" (P1 archive).

### Fellowships `/fellowships` and `/fellowships/[slug]`
- List: C28 (short) → C07 finder (sticky under the header on scroll) → result count + chips for active filters → grid of C11 `listing` (1 / 2 / 3 columns) → C26 empty state.
- Profile: stage header with logo (96px), name (display-lg), type chip, meeting chips → two columns on expanded+: About + gallery (left 8) · info card (right 4: day, time, venue with map link, president, WhatsApp/phone buttons, socials) → "Other fellowships meeting on [day]" row.

### Programmes `/programmes` and `/programmes/[slug]`
- List: C28 → featured C12 (horizontal) → tabs "Upcoming / Past" (M3 primary tabs, 48px) → grid of C12.
- Detail: stage hero with flyer + C06 + add to calendar + share → details (C30) → ministers (avatars) → venue map link → related sermons (C13) after the event.

### Media `/media`
C14 when live → C28 otherwise → playlist filter chips (series) → C13 grid (1/2/3 columns), "Load more" button → "Subscribe on YouTube" band.

### Give `/give`
C28 ("GIVE TO **THE HOUSEHOLD**") → C17 card + bank card → "Where your giving goes" (3 icon tiles: programmes, welfare, outreach) → FAQ accordion (receipts, security, refunds).

### Prayer `/prayer`
C28 ("SHARE A **PRAYER REQUEST**") → privacy note card ("Only the JCCF PRO and General Secretary can read this.") → form (C19) → success state with a short scripture.

### Contact `/contact`
C28 → two columns: contact form (left) · info card + map link + socials (right).

### News `/news` (P1), Gallery `/gallery` (P1), Alumni `/alumni` (P1, information only: the 5-point alumni mission, how to reach the alumni executive).

### Owner pages `/owner/*`
Plain, functional M3 list layouts on `surface`: prayer requests list with "Prayed for" toggle, contact messages, subscriber export. No marketing motion.

---

## 13. Accessibility checklist (must pass before launch)

- [ ] Colour contrast meets §2 for every text and UI pair, in light, dark and stage
- [ ] Every interactive target ≥ 48×48px
- [ ] Keyboard: all actions reachable, visible focus, no traps (except open dialogs/sheets)
- [ ] One `<h1>` per page; headings in order; landmarks (`header`, `nav`, `main`, `footer`)
- [ ] Images have meaningful `alt` or `alt=""`
- [ ] Forms: visible labels, errors linked by `aria-describedby`, success announced
- [ ] `prefers-reduced-motion` removes all motion and shows all content
- [ ] Content readable and usable with JavaScript disabled (except give and video)
- [ ] Zoom to 200% without horizontal scrolling (except carousels)
- [ ] Tested with TalkBack on Android Chrome and VoiceOver on iOS Safari

## 14. Performance budget

- Mobile Lighthouse ≥ 90 (performance, accessibility, best practices, SEO)
- First load ≤ 1 MB on Home; JS ≤ 200 KB gzipped on first load (GSAP + ScrollTrigger + SplitText + Lenis ≈ 60 KB; load SplitText and Lenis lazily)
- LCP ≤ 2.5s on throttled 4G; CLS ≤ 0.05; INP ≤ 200ms
- Fonts: 2 families, `display: swap`, subset latin, preloaded by `next/font`
- No YouTube iframe before a tap; no third-party script on first paint except Turnstile on form pages

## 15. Do and don't

| Do | Don't |
| --- | --- |
| Use role tokens (`bg-primary`, `text-on-surface-variant`) | Hard-code hex in components |
| One highlighted word per title | Colour whole headlines red |
| Keep long reading on light sections | Put paragraphs of text on photos |
| Use JCCF's own words: Household, constituent fellowships, JCCFCOP, units | Copy CCI's or any reference site's copy, photos or logo |
| Animate transform/opacity once on enter | Animate layout properties or loop reveals on scroll up |
| Show the date next to every countdown | Rely on the countdown alone |
| Hide empty fields | Show "N/A" or empty labels |
| Use YouTube thumbnails as temporary photos | Use stock photos of other churches |

## 16. Build order for Claude Code

1. Set up Next.js + Tailwind v4 with `jccf-theme.css` as `app/globals.css`; load fonts via `next/font`; add the theme toggle script.
2. Build primitives: Button, Eyebrow, Chip, fields, Icon, SectionHeader, CarouselControls, Snackbar, Skeleton.
3. Build the motion layer (`lib/motion`): matchMedia contexts, `data-reveal` reveals, title split, count-up, image reveal, parallax, pinned track, smart header, page transition.
4. Build Header, Footer, LiveBanner, PageHero, navigation drawer, bottom sheet.
5. Build Home sections in the §12 order with placeholder content and YouTube thumbnail placeholders.
6. Connect Sanity schemas and replace placeholders; then the remaining pages.
7. Run the §13 and §14 checks on a real mid-range Android phone before launch.

Open items to confirm with the JCCF team: logo file (red and yellow hex values), real stat numbers, featured programme name and date, Secretariat address and phone, WhatsApp channel link.
