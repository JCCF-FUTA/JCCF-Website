import Image from 'next/image';
import Link from 'next/link';
import { FOOTER_NAV, SITE } from '@/lib/site';
import type { SiteSettings } from '@/lib/types';
import { Brand, type BrandName } from '@/components/ui/Brand';
import { Icon } from '@/components/ui/Icon';
import { NewsletterForm } from '@/components/engage/NewsletterForm';
import { ThemeToggle } from './ThemeToggle';

/** Site footer on stage (DESIGN §C23). */
export function Footer({ settings }: { settings: SiteSettings }) {
  const socials = (['instagram', 'facebook', 'youtube', 'whatsapp'] as BrandName[])
    .map((k) => ({ key: k, href: k === 'whatsapp' ? settings.socials.whatsapp ?? settings.whatsappChannel : settings.socials[k] }))
    .filter((s): s is { key: BrandName; href: string } => Boolean(s.href));

  return (
    <footer className="theme-stage">
      <div className="container-page pt-16 pb-8 expanded:pt-24">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 border-b border-stage-outline pb-12 expanded:grid-cols-12">
          <div className="flex flex-col gap-5 expanded:col-span-6">
            <Link href="/" className="flex items-center gap-4 self-start" aria-label="JCCF FUTA home">
              <Image src="/brand/jccf-logo-160.webp" alt="" width={64} height={64} className="size-16" />
              <span className="flex flex-col">
                <span className="font-display text-[1.75rem] uppercase leading-none">JCCF FUTA</span>
                <span className="text-body-md text-on-stage-variant">{SITE.fullName}</span>
              </span>
            </Link>
            <p className="max-w-[40ch] text-body-lg italic text-on-stage-variant">
              “{SITE.motto}” ({SITE.mottoRef})
            </p>
          </div>
          <div className="flex flex-col gap-3 expanded:col-span-6">
            <p className="text-title-md font-semibold">Get Household updates</p>
            <NewsletterForm source="footer" compact tone="stage" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 expanded:grid-cols-12">
          {FOOTER_NAV.map((col) => (
            <nav key={col.title} aria-label={col.title} className="expanded:col-span-2">
              <h2 className="mb-3 text-label-md font-semibold uppercase text-on-stage-variant">{col.title}</h2>
              <ul>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-flex min-h-12 items-center text-body-lg hover:text-stage-accent-text">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div className="col-span-2 expanded:col-span-6 expanded:pl-10">
            <h2 className="mb-3 text-label-md font-semibold uppercase text-on-stage-variant">Connect</h2>
            <ul className="flex flex-col gap-1 text-body-lg">
              {settings.address && (
                <li className="flex gap-3 py-2"><Icon name="location_on" className="text-on-stage-variant" /> <span>{settings.address}</span></li>
              )}
              {settings.email && (
                <li><a href={`mailto:${settings.email}`} className="flex min-h-12 items-center gap-3 hover:text-stage-accent-text"><Icon name="mail" className="text-on-stage-variant" /> {settings.email}</a></li>
              )}
              {settings.phone && (
                <li><a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="flex min-h-12 items-center gap-3 hover:text-stage-accent-text"><Icon name="call" className="text-on-stage-variant" /> {settings.phone}</a></li>
              )}
            </ul>
            {socials.length > 0 && (
              <ul className="mt-4 flex gap-2" aria-label="Social media">
                {socials.map((s) => (
                  <li key={s.key}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`JCCF FUTA on ${s.key[0].toUpperCase()}${s.key.slice(1)}`}
                      className="state-layer inline-flex size-12 items-center justify-center rounded-full border border-stage-outline text-on-stage">
                      <Brand name={s.key} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-stage-outline pt-6 text-body-sm text-on-stage-variant medium:flex-row medium:items-center">
          <p>© {new Date().getFullYear()} {SITE.fullName}, FUTA</p>
          <p className="medium:ml-auto">Built by the JCCF Publicity Unit</p>
          <ThemeToggle className="-ml-3 text-on-stage medium:ml-0" />
        </div>
      </div>
    </footer>
  );
}
