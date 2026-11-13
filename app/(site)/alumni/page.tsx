import type { Metadata } from 'next';
import { ALUMNI_MISSION } from '@/lib/content/seed';
import { getSiteSettings } from '@/lib/data';
import { LinkButton } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const revalidate = 300;
export const metadata: Metadata = { title: 'Alumni', description: 'JCCF FUTA Alumni: our mission and how to reach the alumni executive.' };

export default async function AlumniPage() {
  const s = await getSiteSettings();
  return (
    <>
      <PageHero crumb="Alumni" compact title="Once JCCF, *always family*" intro="The Household Executive keeps the lines open between the Household and the JCCF Alumni (constitution, Article 6)." />
      <section className="section">
        <div className="container-page grid gap-12 expanded:grid-cols-12">
          <div className="expanded:col-span-5">
            <SectionHeader eyebrow="JCCF Alumni" title="Our *mission*" lead="What the JCCF FUTA Alumni exists to do." className="mb-0" />
          </div>
          <ol className="flex flex-col gap-3 expanded:col-span-7" data-reveal-stagger>
            {ALUMNI_MISSION.map((m, i) => (
              <li key={m} className="flex gap-4 rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
                <span className="font-display text-headline-sm text-primary">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-body-lg">{m}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section bg-surface-container-low">
        <div className="container-page flex flex-col items-start gap-6 expanded:flex-row expanded:items-center expanded:justify-between">
          <div className="flex gap-4">
            <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container"><Icon name="school" size={32} /></span>
            <div>
              <h2 className="type-headline text-headline-md">Reach the alumni executive</h2>
              <p className="mt-1 max-w-[52ch] text-body-lg text-on-surface-variant">Write to the Secretariat with the subject “Alumni” and we’ll connect you with the JCCF Alumni Executive.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/contact" trailingIcon="arrow_forward">Contact us</LinkButton>
            {s.email && <LinkButton href={`mailto:${s.email}?subject=JCCF%20Alumni`} variant="outlined" icon="mail">Email</LinkButton>}
          </div>
        </div>
      </section>
    </>
  );
}
