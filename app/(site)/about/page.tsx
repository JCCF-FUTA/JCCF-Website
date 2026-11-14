import type { Metadata } from 'next';
import Image from 'next/image';
import { DOCTRINE, HISTORY, LOGO_MEANING } from '@/lib/content/seed';
import { getUnits } from '@/lib/data';
import { SITE } from '@/lib/site';
import { cn } from '@/lib/cn';
import { Pillars } from '@/components/about/Pillars';
import { LinkButton } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'About',
  description: `History, vision, mission, doctrine and logo of the ${SITE.fullName}, FUTA. One Household of campus fellowships since 1996/97.`,
};

/** Logo colours sampled from the official file; the swatches show which part of the logo is meant. */
const SWATCH: Record<(typeof LOGO_MEANING)[number]['swatch'], string> = {
  dove: 'bg-white',
  book: 'bg-[#f3ead2]',
  olive: 'bg-[#fadd26]',
  green: 'bg-[#06903f]',
  red: 'bg-[#fa0404]',
  yellow: 'bg-[#fadd26]',
};
const SWATCH_ICON: Record<(typeof LOGO_MEANING)[number]['swatch'], string> = {
  dove: 'flare', book: 'menu_book', olive: 'eco', green: 'circle', red: 'water_drop', yellow: 'star',
};

const STRUCTURE = [
  { title: 'Household Executive', text: 'The President, Vice President, General Secretary and coordinators, chosen prayerfully each session from final-year students.' },
  { title: 'JCCFCOP', text: 'The Committee of Presidents: the Executive and the head of every constituent fellowship. It approves programmes and projects.' },
  { title: 'Constituent fellowships', text: 'Every registered fellowship and Christian group. Each keeps its own meetings and joins the Household programmes.' },
];

export default async function AboutPage() {
  const units = await getUnits();
  return (
    <>
      <div data-scroll-progress className="fixed inset-x-0 top-0 z-[55] h-0.5 origin-left bg-primary" style={{ transform: 'scaleX(0)' }} aria-hidden="true" />
      <PageHero
        crumb="About"
        title="About JCCF FUTA"
        intro={<>The {SITE.fullName} is the umbrella body of the Protestant student fellowships and Christian groups at the {SITE.institution}. Our motto is “{SITE.motto}” ({SITE.mottoRef}).</>}
      />

      {/* History */}
      <section aria-labelledby="history-title" className="section">
        <div className="container-page grid gap-12 expanded:grid-cols-12">
          <div className="expanded:col-span-4">
            <div className="expanded:sticky expanded:top-28">
              <SectionHeader id="history-title" title="Our history" lead="From a small prayer gathering in 1996/97 to the Household of every fellowship on campus." className="mb-0" />
            </div>
          </div>
          <ol className="relative expanded:col-span-8">
            <span className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-outline-variant" aria-hidden="true" />
            {HISTORY.map((h, i) => (
              <li key={i} className="relative pb-10 pl-10 last:pb-0" data-reveal="up">
                <span className={cn('absolute left-0 top-1.5 size-4 rounded-full border-4 border-surface', i === HISTORY.length - 1 ? 'bg-primary' : 'bg-on-surface-variant')} aria-hidden="true" />
                <p className="text-label-md font-semibold uppercase text-primary">{h.period}</p>
                <h3 className="mt-1 text-title-lg font-semibold">{h.title}</h3>
                <p className="mt-2 max-w-prose text-body-lg text-on-surface-variant">{h.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Pillars />

      {/* Doctrine: a real numbered list (constitution Article 3, i–xii). No boxes needed. */}
      <section aria-labelledby="doctrine-title" className="section">
        <div className="container-page grid gap-12 expanded:grid-cols-12">
          <div className="expanded:col-span-4">
            <div className="expanded:sticky expanded:top-28">
              <SectionHeader id="doctrine-title" title="What we believe" lead="Article 3 of the constitution. As a body, JCCF FUTA believes in:" className="mb-0" />
            </div>
          </div>
          <ol className="divide-y divide-outline-variant border-y border-outline-variant expanded:col-span-8">
            {DOCTRINE.map((d, i) => (
              <li key={i} className="grid grid-cols-[3rem_1fr] gap-3 py-5" data-reveal="up">
                <span className="font-display text-headline-sm text-on-surface-variant tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <p className="max-w-prose text-body-lg">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Logo meaning */}
      <section aria-labelledby="logo-title" className="theme-stage section">
        <div className="container-page grid items-center gap-12 expanded:grid-cols-12">
          <div className="flex justify-center expanded:col-span-5" data-reveal="up">
            <div className="relative aspect-square w-full max-w-[400px]">
              <Image src="/brand/jccf-logo.webp" alt="The JCCF FUTA logo: a dove carrying an olive branch over an open Bible, inside a green circle and a red ring." fill sizes="(min-width: 840px) 400px, 90vw" className="object-contain" />
            </div>
          </div>
          <div className="expanded:col-span-7">
            <SectionHeader id="logo-title" tone="stage" title="What our logo means" lead="From Article 1, Section 2 of the constitution." />
            <dl className="grid gap-x-8 gap-y-6 medium:grid-cols-2">
              {LOGO_MEANING.map((l) => (
                <div key={l.symbol} className="flex gap-4" data-reveal="up">
                  <span className={cn('inline-flex size-10 shrink-0 items-center justify-center rounded-full text-stage', SWATCH[l.swatch])} aria-hidden="true">
                    <Icon name={SWATCH_ICON[l.swatch]} size={20} className={l.swatch === 'green' || l.swatch === 'red' ? 'text-white' : ''} />
                  </span>
                  <div>
                    <dt className="text-title-md font-semibold">{l.symbol}: {l.meaning}</dt>
                    <dd className="mt-1 text-body-lg text-on-stage-variant">{l.detail}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Structure + units */}
      <section aria-labelledby="structure-title" className="section">
        <div className="container-page grid gap-12 expanded:grid-cols-12">
          <div className="expanded:col-span-4">
            <SectionHeader id="structure-title" title="How the Household works" lead="Article 5 of the constitution. JCCF is non-denominational and independent in its administration." className="mb-0" />
          </div>
          <div className="flex flex-col gap-12 expanded:col-span-8">
            <dl className="divide-y divide-outline-variant border-y border-outline-variant">
              {STRUCTURE.map((s) => (
                <div key={s.title} className="grid gap-1 py-5 medium:grid-cols-[14rem_1fr] medium:gap-6" data-reveal="up">
                  <dt className="text-title-md font-semibold">{s.title}</dt>
                  <dd className="text-body-lg text-on-surface-variant">{s.text}</dd>
                </div>
              ))}
            </dl>
            <div>
              <h3 className="mb-2 text-title-lg font-semibold">The {units.length} Household units</h3>
              <p className="mb-4 text-body-lg text-on-surface-variant">Each unit serves every Household programme, with coordinators from member fellowships.</p>
              <dl className="divide-y divide-outline-variant border-y border-outline-variant">
                {units.map((u) => (
                  <div key={u.name} className="grid gap-1 py-4 medium:grid-cols-[14rem_1fr] medium:gap-6">
                    <dt className="text-title-md font-semibold">{u.name}</dt>
                    <dd className="text-body-lg text-on-surface-variant">{u.summary}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-surface-container-low">
        <div className="container-page flex flex-col items-start gap-6 expanded:flex-row expanded:items-center expanded:justify-between">
          <div>
            <h2 className="type-headline text-headline-lg">Visit a fellowship this week</h2>
            <p className="mt-2 max-w-[52ch] text-body-lg text-on-surface-variant">Search the fellowships by name, then go along. Every one of them belongs to the Household.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/fellowships" trailingIcon="arrow_forward">Find a fellowship</LinkButton>
            <LinkButton href="/leadership" variant="outlined">See the leadership</LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
