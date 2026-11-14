# Anti-Slop Design Prompt

> Paste this at the top of any Claude Code design task, or save it in the repo and say: **"Follow ANTI-SLOP.md and DESIGN.md."** Part A works on any project. Part B adds the JCCF FUTA rules.

---

## PART A: The general prompt

### Role and the problem

You are designing for a real product with a real audience. Left alone, you drift toward the statistical average of every website you were trained on. That average has a name: AI slop. It shows up as Inter on a purple gradient, a centred hero over three rounded cards, glass panels, glowing orbs, and copy like "Elevate your workflow". When people notice it, they trust the product less.

Avoiding slop does not mean being random. It means **every visual choice is a decision you can explain**, tied to this product's purpose, brand and references. If you can't say why something is there, delete it.

### Step 1: Read before you design

Do these in order. Don't write UI code until step 1d is done.

**a. Read the design system.** Read `DESIGN.md` (tokens, type, colour, shape, motion, components). It's the floor. Never invent a font, colour, radius, font size or shadow outside it. If you truly need a new one, add it to `DESIGN.md` first and say why.

**b. Read the references.** Use the screenshots or URLs provided, never just one. One reference gets copied, flaws included. Several references get blended into something new. Take patterns from them: structure, spacing, rhythm, how media is used. Never take their words, logos or photos.

**c. State the purpose.** Answer in one sentence: **what should a visitor do on this page?** That answer decides the hero and the main action. Examples: a shop opens with products; a chat app puts the input box above the fold; a fellowship site puts "Find a fellowship" in the hero. Any section that doesn't serve that purpose is cut.

**d. Write the plan as text first.** Before coding, write out:
- the page anatomy, section by section, top to bottom, with each section's single job
- the one bold decision on each screen (a huge headline, a photo, a countdown), with everything else quiet
- interaction behaviour: hover, focus, scroll, entrance motion, responsive changes
- image roles: what each image shows and why (real photos of the product and people beat illustrations)
- what you will NOT do (pick the relevant bans from step 3)

Show me the plan and wait for approval when the task is a new page or a redesign.

### Step 2: Subtract first, then add

Start from the plainest version that works: typography, spacing and one accent colour. Then add only what earns its place. Removing things from a busy page never ends; adding to a bare page stops when it's done its job.

Before adding any element, ask:
- **Do I need a card?** Often spacing and a heading group content better than a box.
- **Do I need a border?** Often a change of background or more space separates better than a line. Never use a hairline border plus a wide soft shadow together; pick one.
- **Do I need a subheading?** If it repeats the heading, cut it.
- **Does this need to be visible now?** Secondary actions can live in a menu, an expander or the next step. Showing every feature at once is noise.
- **Are tabs the right navigation?** Consider a list, a segmented control, anchors or separate pages.
- **Is the UI too distracting?** Count the colours, icons, badges and animations on one screen. If more than one thing shouts, quieten all but one.

### Step 3: Banned by default

These are slop tells. Don't use any of them unless `DESIGN.md` or I ask for it by name.

**Type**
- Inter, Roboto, Arial, Open Sans, Poppins or the system font stack as the brand font. Space Grotesk is the "I tried" upgrade: also banned.
- One font for everything with a flat hierarchy. Headings and body must clearly differ in size, weight and spacing.
- Gradient text. Italic serif display headlines as a reflex.
- Body text under 16px, tight line height (start near 1.5), wide letter-spacing on body text, all-caps paragraphs, justified text.
- Crushed tracking on big headlines. A single word alone on a heading's last line (use `text-wrap: balance`).

**Colour and surface**
- Purple, violet or indigo-to-blue gradients, in backgrounds or text. Floating gradient orbs. Radial glow halos or spotlights behind content.
- Glassmorphism as decoration. Glass is allowed only to solve a real layering problem, such as a panel over a photo, and only once per screen.
- Dark mode with neon glow accents, unless it's the brand.
- The "tasteful" second-wave defaults: cream with terracotta, or near-black with one acid-green accent.
- Decorative grid-line backgrounds, repeating stripes, noise used only to look fancy.
- Grey text on a coloured background. Any text below WCAG AA contrast (4.5:1, or 3:1 for large text).

**Layout and components**
- A centred hero over three identical rounded feature cards. Identical card grids in general: group and vary layouts to fit the content.
- Cards inside cards. A thick coloured side stripe on a card that has no status to show.
- An icon in a tinted square stacked above every heading. Emoji as icons. Decorative SVG doodles where a photo belongs. Use SVG for logos and real icons only.
- A pill badge or label above the main headline that just repeats it. Keep a label only if it carries information the heading doesn't, like a date.
- Numbered "01 / 02 / 03" labels when the items aren't a real sequence.
- One coloured word in every headline as a reflex.
- Huge hero metrics with no context. Stats must explain something.
- Monotonous spacing. Related items sit close; separate groups get clearly more space. Headings get more space above than below.
- Extreme corner radius on small elements. Radius should suit the element's size, from the scale.
- Cards flush against a scroller's edge. Text running over images or other elements. Clipped menus.

**Motion**
- Bounce or elastic easing. Use the standard and emphasised curves from `DESIGN.md`.
- Pulsing dots on things that aren't happening right now. A pulse means live.
- Auto-moving content (marquees, carousels) without a visible pause button. WCAG 2.2.2 requires one for anything moving longer than 5 seconds.
- Content hidden until an animation runs. Everything must be visible without JavaScript; animations start from a visible state.
- Scroll-jacking that fights the user, and animations that delay the main action.

**Copy**
- Filler: "Elevate", "Unlock", "Seamless", "Transform your workflow", "Welcome to [Name]", a bare "Get Started".
- Invented numbers, testimonials or logos. If it can't be sourced, it doesn't ship.
- Slogan tricks: "Not X, but Y", "It's not a feature, it's a philosophy", colon-then-reveal, em-dash asides.
- Buttons must say exactly what happens ("Find a fellowship", "Give ₦2,000").

### Step 4: Required on every component

- **All states designed, not improvised:** default, hover, focus-visible, active, disabled, loading, empty, error, success.
- **Real content shapes:** long names, empty fields, one item, 50 items. Hide empty fields instead of printing "N/A".
- **Touch targets of at least 48px**, visible focus, semantic HTML, one `<h1>`, no skipped heading levels.
- **Responsive by design:** check 360px, 390px, 768px, 1024px and 1440px. On phones, the layout changes; it doesn't just shrink.

### Step 5: Don't take the first draft

- For any hero or key section, make **2–3 genuinely different directions** (layout, image use, type scale), not three colour swaps. Name the reference behind each. I'll choose, or you recommend one with reasons.
- Then improve by **iterating**: small, specific changes to the chosen direction. Don't regenerate from scratch; that brings the defaults back.
- Critique specifically. "Make it premium" is banned. Name the element and the fix, for example: "Hero headline wraps to 4 lines at 390px; cut to 2 by shortening the copy."

### Step 6: Slop gate before you show me anything

1. Run the page and fix every console error first.
2. Screenshot it at 390px and 1440px, top to bottom. Look at it.
3. Go through Step 3 line by line and **count** the tells you find. Fix every one, or justify it against `DESIGN.md`.
4. Check every new value against `DESIGN.md` (font, colour, radius, size, shadow). Anything off-system gets fixed or added to the system with a reason.
5. Check contrast on every text and background pair, including text over photos.
6. Turn on `prefers-reduced-motion` and confirm everything is visible and usable.

### Step 7: Report back in this format

- **Purpose:** the one-sentence visitor goal
- **Decisions:** a table of decision → reference or DESIGN.md rule → why
- **Slop gate:** tells found → fixed or justified
- **Open questions:** missing content, images or facts, so we never invent them
- Screenshots at 390px and 1440px

---

## PART B: JCCF FUTA rules (add when working on jccffuta.org)

- **Purpose of the home page:** help a FUTA student **find a fellowship**. Second: see the next programme and watch live. Third: give. The hero serves the first; nothing else competes with it.
- **Brand floor:** `DESIGN.md` and `jccf-theme.css`. Red and white, a few yellow traces, dark stage sections, Anton for display, Plus Jakarta Sans for text.
- **Real content only:** use JCCF's own words (Household, constituent fellowships, JCCFCOP, units) and real facts from the constitution. Never invent fellowship names, numbers, quotes or leaders. Use YouTube thumbnails from @jccf_futa as temporary images.
- **Phones on mobile data first:** design at 390px first. Light pages, no autoplay video.

**Changes to DESIGN.md from this audit.** These override `DESIGN.md` where they conflict (now recorded in DESIGN.md §17):

| DESIGN.md item | Problem | Rule from now on |
| --- | --- | --- |
| C03 eyebrow pill above most titles | Badge above headline is a top tell | Use eyebrows only when they add information the title doesn't ("Next programme · Sun 17 Jan"). Remove "Welcome", "Our vision" and the like; let the heading speak. |
| One red word in every title | Reflexive highlight is a second-wave tell | Red emphasis in the **hero** and the **Give** band only. Elsewhere, set titles in one colour and create hierarchy with size and weight. |
| C22 fellowship marquee | Auto-motion without a pause control fails WCAG 2.2.2 | Add a visible pause/play button, or make it a static wrapped list of fellowship names. |
| M17 magnetic button (elastic ease) | Bounce/elastic easing is a tell | Remove M17. |
| C10 mission cards with icon circles | Icon tile above heading on every card | Drop the icon circles. Keep the numbers 01–07: the constitution lists the mission as an ordered set (i–vii), so the sequence is real. |
| Glass "Next programme" card on the hero | Glass as decoration | Allowed: it sits over a photo, which is a real layering problem. Only this one glass element on the site. |
| Live dot pulse (M12) | Pulse on static status | Pulse only while actually live. No pulsing anywhere else. |
| Stat tiles (C08) | Hero metrics without context | Keep, but every number needs a plain label ("30 years as one Household since 1996/97"), and only real numbers. |
| Welcome section of 3 equal image cards | Identical card grid | Make one large card (Find a fellowship) and two smaller ones, or a list with photos. Avoid three equal boxes. |
| Pinned horizontal scroll (M6) | Can feel like scroll-jacking | Keep it short: under 1.5 screen-heights of scroll. Show the progress bar, and let arrows and keyboard move it too. |

**JCCF slop gate additions**
- [ ] The page passes when viewed on a mid-range Android over 4G
- [ ] Every fellowship, programme and leader shown is real, or clearly marked sample in development only
- [ ] No more than one bold element per screen at 390px
- [ ] Red covers less than about 10% of any screen except the Give band
