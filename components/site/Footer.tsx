import Image from 'next/image';
import Link from 'next/link';
import { FOOTER_NAV, SITE, type NavItem } from '@/lib/site';
import type { SiteSettings } from '@/lib/types';
import { Brand, type BrandName } from '@/components/ui/Brand';
import { Icon } from '@/components/ui/Icon';

const SOCIAL_LABEL: Record<BrandName, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  telegram: 'Telegram',
  youtube: 'YouTube',
  whatsapp: 'WhatsApp channel',
};

function LinkColumn({ title, links }: { title: string; links: NavItem[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="mb-3 text-label-md font-semibold uppercase text-on-stage-variant">{title}</h2>
      <ul>
        {links.map((l) => (
          <li key={`${l.href}-${l.label}`}>
            <Link href={l.href} className="inline-flex min-h-12 items-center text-body-lg transition-colors hover:text-stage-accent-text">{l.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Site footer on stage (DESIGN §C23). The newsletter lives in the band above it, on every page. */
export function Footer({ settings, programmeLinks }: { settings: SiteSettings; programmeLinks: NavItem[] }) {
  const socials = (['instagram', 'facebook', 'telegram', 'youtube', 'whatsapp'] as BrandName[])
    .map((k) => ({ key: k, href: k === 'whatsapp' ? settings.socials.whatsapp ?? settings.whatsappChannel : settings.socials[k] }))
    .filter((s): s is { key: BrandName; href: string } => Boolean(s.href));
  const [explore, ...rest] = FOOTER_NAV;

  return (
    <footer className="theme-stage">
      <div className="container-page pt-16 pb-8 expanded:pt-20">
        {/* Identity + socials */}
        <div className="flex flex-col gap-8 border-b border-stage-outline pb-10 expanded:flex-row expanded:items-end expanded:justify-between">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-4 self-start" aria-label="JCCF FUTA home">
              <Image src="/brand/jccf-logo-160.webp" alt="" width={64} height={64} className="size-16" />
              <span className="flex flex-col">
                <span className="font-display text-[1.75rem] uppercase leading-none">JCCF FUTA</span>
                <span className="text-body-md text-on-stage-variant">{SITE.fullName}</span>
              </span>
            </Link>
            <p className="max-w-[40ch] text-body-lg text-on-stage-variant">
              “{SITE.motto}” ({SITE.mottoRef})
            </p>
          </div>
          {socials.length > 0 && (
            <div>
              <h2 className="mb-3 text-label-md font-semibold uppercase text-on-stage-variant">Follow JCCF FUTA</h2>
              <ul className="flex flex-wrap gap-2">
                {socials.map((s) => (
                  <li key={s.key}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`JCCF FUTA on ${SOCIAL_LABEL[s.key]}`}
                      title={SOCIAL_LABEL[s.key]}
                      className="state-layer inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-on-stage"
                    >
                      <Brand name={s.key} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-10 medium:grid-cols-3 expanded:grid-cols-12">
          <div className="expanded:col-span-2"><LinkColumn {...explore} /></div>
          <div className="expanded:col-span-3"><LinkColumn title="Programmes" links={programmeLinks} /></div>
          {rest.map((col) => (
            <div key={col.title} className="expanded:col-span-2"><LinkColumn {...col} /></div>
          ))}
          <div className="col-span-2 medium:col-span-3 expanded:col-span-3">
            <h2 className="mb-3 text-label-md font-semibold uppercase text-on-stage-variant">Contact</h2>
            <ul className="flex flex-col gap-1 text-body-lg">
              {settings.address && (
                <li className="flex gap-3 py-2"><Icon name="location_on" className="shrink-0 text-on-stage-variant" /> <span>{settings.address}</span></li>
              )}
              {settings.email && (
                <li><a href={`mailto:${settings.email}`} className="flex min-h-12 items-center gap-3 transition-colors hover:text-stage-accent-text"><Icon name="mail" className="shrink-0 text-on-stage-variant" /> {settings.email}</a></li>
              )}
              {settings.phone && (
                <li><a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="flex min-h-12 items-center gap-3 transition-colors hover:text-stage-accent-text"><Icon name="call" className="shrink-0 text-on-stage-variant" /> {settings.phone}</a></li>
              )}
            </ul>
          </div>
        </div>

        <p className="border-t border-stage-outline pt-6 text-body-md text-on-stage-variant">
          © {new Date().getFullYear()} {SITE.fullName}, Federal University of Technology, Akure
        </p>
      </div>
    </footer>
  );
}
