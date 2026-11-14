import type { Metadata } from 'next';
import { ALUMNI_MISSION } from '@/lib/content/seed';
import { getSiteSettings } from '@/lib/data';
import { SHOW_SAMPLES } from '@/lib/site';
import { StatusChip } from '@/components/ui/Chip';
import { LinkButton } from '@/components/ui/Button';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const revalidate = 300;
export const metadata: Metadata = { title: 'Alumni', description: 'JCCF FUTA Alumni: our mission and how to reach the alumni executive.' };

export default async function AlumniPage() {
  const s = await getSiteSettings();
  return (
    <>
      <PageHero crumb="Alumni" compact title="JCCF Alumni" intro="Former members of the Household. The Household Executive keeps the lines open between the Household and the JCCF Alumni (constitution, Article 6)." />
      {SHOW_SAMPLES && (
        <section className="section">
          <div className="container-page grid gap-12 expanded:grid-cols-12">
            <div className="flex flex-col items-start gap-3 expanded:col-span-5">
              <StatusChip kind="placeholder">Sample</StatusChip>
              <SectionHeader title="Mission of the JCCF Alumni" lead="Sample text, shown in development only, until the alumni executive confirms the five points." className="mb-0" />
            </div>
            <ol className="divide-y divide-outline-variant border-y border-outline-variant expanded:col-span-7">
              {ALUMNI_MISSION.map((m, i) => (
                <li key={m} className="grid grid-cols-[3rem_1fr] gap-3 py-5">
                  <span className="font-display text-headline-sm text-on-surface-variant">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-body-lg">{m}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}
      <section className="section">
        <div className="container-page flex flex-col items-start gap-6 expanded:flex-row expanded:items-center expanded:justify-between">
          <div>
            <h2 className="type-headline text-headline-md">Reach the alumni executive</h2>
            <p className="mt-1 max-w-[52ch] text-body-lg text-on-surface-variant">Write to the Secretariat with the subject “Alumni” and we’ll connect you with the JCCF Alumni Executive.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/contact" trailingIcon="arrow_forward">Write to the Secretariat</LinkButton>
            {s.email && <LinkButton href={`mailto:${s.email}?subject=JCCF%20Alumni`} variant="outlined" icon="mail">Email {s.email}</LinkButton>}
          </div>
        </div>
      </section>
    </>
  );
}
