import type { Metadata } from 'next';
import Image from 'next/image';
import { DOCTRINE, HISTORY, LOGO_MEANING, VISION } from '@/lib/content/seed';
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
  description: `History, vision, mission, doctrine and logo of the ${SITE.fullName}, FUTA — one Household of campus fellowships since 1996/97.`,
};

const SWATCH: Record<(typeof LOGO_MEANING)[number]['swatch'], string> = {
  dove: 'bg-white border border-outline-variant',
  book: 'bg-[#f3ead2] border border-outline-variant',
  olive: 'bg-[#fadd26]',
  green: 'bg-[#06903f]',
  red: 'bg-[#fa0404]',
  yellow: 'bg-[radial-gradient(circle,#fadd26,#f5b800_60%,#fff0_70%)]',
};
const SWATCH_ICON: Record<(typeof LOGO_MEANING)[number]['swatch'], string> = {
  dove: 'flare', book: 'menu_book', olive: 'eco', green: 'circle', red: 'water_drop', yellow: 'star',
};

export default async function AboutPage() {
  const units = await getUnits();
  return (
    <>
      <div data-scroll-progress className="fixed inset-x-0 top-0 z-[55] h-0.5 origin-left bg-primary" style={{ transform: 'scaleX(0)' }} aria-hidden="true" />
      <PageHero
        crumb="About"
        title="Who *we are*"
        intro={<>The {SITE.fullName} is the umbrella body of the Protestant student fellowships and Christian groups at the {SITE.institution}. Our motto: “{SITE.motto}” ({SITE.mottoRef}).</>}
      />

      {/* History timeline */}
      <section aria-labelledby="history-title" className="section">
        <div className="container-page grid gap-12 expanded:grid-cols-12">
          <div className="expanded:col-span-4">
            <div className="expanded:sticky expanded:top-28">
              <SectionHeader id="history-title" eyebrow={`Since ${SITE.founded}`} title="Our *story*" lead="From a small prayer gathering to one Household of every fellowship on campus." className="mb-0" />
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

      {/* Doctrine */}
      <section aria-labelledby="doctrine-title" className="section">
        <div className="container-page grid gap-12 expanded:grid-cols-12">
          <div className="expanded:col-span-4">
            <div className="expanded:sticky expanded:top-28">
              <SectionHeader id="doctrine-title" eyebrow="Article 3" title="What we *believe*" lead="As a body, JCCF FUTA believes in:" className="mb-0" />
            </div>
          </div>
          <ol className="grid gap-3 expanded:col-span-8" data-reveal-stagger>
            {DOCTRINE.map((d, i) => (
              <li key={i} className="flex gap-4 rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
                <span className="font-display text-headline-sm text-primary tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-body-lg">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Logo meaning */}
      <section aria-labelledby="logo-title" className="theme-stage section">
        <div className="container-page grid items-center gap-12 expanded:grid-cols-12">
          <div className="flex justify-center expanded:col-span-5" data-reveal="up">
            <div className="relative aspect-square w-full max-w-[420px]">
              <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgb(250_221_38/0.25),transparent_65%)]" aria-hidden="true" />
              <Image src="/brand/jccf-logo.webp" alt="The JCCF FUTA logo: a dove carrying an olive branch over an open Bible, inside a green circle and a red ring." fill sizes="(min-width: 840px) 420px, 90vw" className="object-contain" />
            </div>
          </div>
          <div className="expanded:col-span-7">
            <SectionHeader id="logo-title" tone="stage" eyebrow="Our emblem" title="What our logo *means*" />
            <ul className="grid gap-3 medium:grid-cols-2" data-reveal-stagger>
              {LOGO_MEANING.map((l) => (
                <li key={l.symbol} className="flex gap-4 rounded-xl bg-stage-container p-5">
                  <span className={cn('inline-flex size-12 shrink-0 items-center justify-center rounded-full text-stage', SWATCH[l.swatch])}>
                    <Icon name={SWATCH_ICON[l.swatch]} className={l.swatch === 'green' || l.swatch === 'red' ? 'text-white' : ''} />
                  </span>
                  <div>
                    <p className="text-label-md font-semibold uppercase text-on-stage-variant">{l.symbol}</p>
                    <p className="text-title-md font-semibold">{l.meaning}</p>
                    <p className="mt-1 text-body-md text-on-stage-variant">{l.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Structure */}
      <section aria-labelledby="structure-title" className="section">
        <div className="container-page">
          <SectionHeader id="structure-title" eyebrow="Article 5" title="How the Household *works*" lead="JCCF is non-denominational and independent in its administration. Decisions are taken together." />
          <ol className="grid gap-4 expanded:grid-cols-4" data-reveal-stagger>
            {[
              { icon: 'groups', title: 'Household Executive', text: 'The President, Vice President, General Secretary and coordinators, chosen prayerfully each session.' },
              { icon: 'handshake', title: 'JCCFCOP', text: 'The Committee of Presidents: the Executive and the head of every constituent fellowship. It approves programmes and projects.' },
              { icon: 'church', title: 'Constituent fellowships', text: 'Every registered fellowship and Christian group. They keep their own meetings and join Household programmes.' },
              { icon: 'diversity_3', title: 'Household units', text: units.map((u) => u.name).join(', ') + ' — serving every Household programme.' },
            ].map((s, i) => (
              <li key={s.title} className="relative flex flex-col gap-3 rounded-xl border border-outline-variant bg-surface-container-low p-6">
                <span className="flex items-center justify-between">
                  <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary-container text-on-primary-container"><Icon name={s.icon} /></span>
                  <span className="font-display text-headline-sm text-outline-variant">{String(i + 1).padStart(2, '0')}</span>
                </span>
                <h3 className="text-title-lg font-semibold">{s.title}</h3>
                <p className="text-body-md text-on-surface-variant">{s.text}</p>
                {i < 3 && <Icon name="arrow_forward" className="absolute -right-5 top-1/2 z-10 hidden -translate-y-1/2 text-primary expanded:block" />}
              </li>
            ))}
          </ol>

          <h3 className="mt-16 mb-6 text-title-lg font-semibold">Our units</h3>
          <ul className="grid gap-3 medium:grid-cols-2 expanded:grid-cols-5" data-reveal-stagger>
            {units.map((u) => (
              <li key={u.name} className="flex flex-col gap-2 rounded-xl bg-surface-container p-5">
                <Icon name={u.icon} className="text-primary" />
                <p className="text-title-md font-semibold">{u.name}</p>
                <p className="text-body-md text-on-surface-variant">{u.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA band */}
      <section className="theme-brand-red">
        <div className="container-page flex flex-col items-start gap-6 py-16 expanded:flex-row expanded:items-center expanded:justify-between">
          <div>
            <p className="font-display text-display-md uppercase">Come as you are</p>
            <p className="mt-2 max-w-[48ch] text-body-lg text-white/85">“{VISION.short}.” Find a fellowship this week and grow with the Household.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/fellowships" tone="stage" variant="filled-inverse" trailingIcon="arrow_forward">Find a fellowship</LinkButton>
            <LinkButton href="/leadership" tone="stage" variant="outlined">Meet the leaders</LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
