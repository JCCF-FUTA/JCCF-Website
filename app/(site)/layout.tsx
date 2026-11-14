import { getProgrammes, getSiteSettings } from '@/lib/data';
import { isPast } from '@/lib/format';
import { FOOTER_PROGRAMMES } from '@/lib/site';
import { getLiveStatus } from '@/lib/live';
import { MotionProvider } from '@/lib/motion/MotionProvider';
import { NewsletterCard } from '@/components/engage/NewsletterCard';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { SnackbarHost } from '@/components/ui/Snackbar';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, live, programmes] = await Promise.all([getSiteSettings(), getLiveStatus(), getProgrammes()]);
  // Footer: link each programme type to its next edition, or the most recent one.
  const now = Date.now();
  const programmeLinks = FOOTER_PROGRAMMES.map(({ label, kind }) => {
    const ofKind = programmes.filter((p) => p.kind === kind);
    const next = ofKind.find((p) => !isPast(p, now)) ?? ofKind.filter((p) => isPast(p, now)).at(-1);
    return { label, href: next ? `/programmes/${next.slug}` : '/programmes' };
  });
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Header live={live} socials={{ ...settings.socials, whatsapp: settings.socials.whatsapp ?? settings.whatsappChannel }} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <NewsletterCard source="site-wide" whatsapp={settings.whatsappChannel} variant="band" />
      <Footer settings={settings} programmeLinks={programmeLinks} />
      <SnackbarHost />
      <MotionProvider />
    </>
  );
}
