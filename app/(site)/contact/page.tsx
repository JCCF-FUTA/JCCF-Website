import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/data';
import { ContactForm } from '@/components/forms/ContactForm';
import { Brand, type BrandName } from '@/components/ui/Brand';
import { Icon } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Reach the JCCF FUTA Secretariat: address, phone, email, social media and a contact form.',
};

export default async function ContactPage() {
  const s = await getSiteSettings();
  const socials = (['instagram', 'facebook', 'youtube', 'whatsapp'] as BrandName[])
    .map((k) => ({ key: k, href: k === 'whatsapp' ? s.socials.whatsapp ?? s.whatsappChannel : s.socials[k] }))
    .filter((x): x is { key: BrandName; href: string } => Boolean(x.href));
  const rows = [
    s.address ? { icon: 'location_on', label: 'Secretariat', value: s.address, href: s.mapUrl, cta: 'Open in Maps' } : null,
    s.email ? { icon: 'mail', label: 'Email', value: s.email, href: `mailto:${s.email}` } : null,
    s.phone ? { icon: 'call', label: 'Phone', value: s.phone, href: `tel:${s.phone.replace(/\s/g, '')}` } : null,
  ].filter(Boolean) as { icon: string; label: string; value: string; href?: string; cta?: string }[];

  return (
    <>
      <PageHero crumb="Contact" compact title="Contact the Secretariat" intro="Questions about a fellowship, a programme or giving? Write to the Secretariat." />
      <section className="section">
        <div className="container-page grid gap-10 expanded:grid-cols-12">
          <div className="expanded:col-span-7" data-reveal="up">
            <h2 className="type-headline mb-6 text-headline-md">Send a message</h2>
            <ContactForm />
          </div>
          <aside className="expanded:col-span-5" aria-label="Contact details">
            <div className="flex flex-col gap-5 rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 expanded:sticky expanded:top-24 expanded:p-8" data-reveal="up">
              <h2 className="text-title-lg font-semibold">JCCF FUTA Secretariat</h2>
              <ul className="flex flex-col gap-4">
                {rows.map((r) => (
                  <li key={r.label} className="flex gap-3">
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container"><Icon name={r.icon} size={20} /></span>
                    <div>
                      <p className="text-label-md font-semibold uppercase text-on-surface-variant">{r.label}</p>
                      {r.href && !r.cta ? (
                        <a href={r.href} className="inline-flex min-h-12 items-center text-body-lg text-primary underline-offset-4 hover:underline">{r.value}</a>
                      ) : (
                        <p className="text-body-lg">{r.value}</p>
                      )}
                      {r.cta && r.href && (
                        <a href={r.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-1 text-label-lg font-semibold text-primary">
                          {r.cta} <Icon name="north_east" size={16} />
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {socials.length > 0 && (
                <div>
                  <p className="mb-2 text-label-md font-semibold uppercase text-on-surface-variant">Follow us</p>
                  <div className="flex gap-2">
                    {socials.map((x) => (
                      <a key={x.key} href={x.href} target="_blank" rel="noopener noreferrer" aria-label={x.key}
                        className="state-layer inline-flex size-12 items-center justify-center rounded-full border border-outline-variant"><Brand name={x.key} /></a>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-body-lg text-on-surface-variant">
                Fellowship presidents: send profile corrections with the subject “Fellowship profile update”.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
