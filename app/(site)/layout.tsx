import { getSiteSettings } from '@/lib/data';
import { getLiveStatus } from '@/lib/live';
import { MotionProvider } from '@/lib/motion/MotionProvider';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { SnackbarHost } from '@/components/ui/Snackbar';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, live] = await Promise.all([getSiteSettings(), getLiveStatus()]);
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Header live={live} socials={{ ...settings.socials, whatsapp: settings.socials.whatsapp ?? settings.whatsappChannel }} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer settings={settings} />
      <SnackbarHost />
      <MotionProvider />
    </>
  );
}
