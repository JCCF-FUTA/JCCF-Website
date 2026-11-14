import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { SITE } from '@/lib/site';
import './globals.css';

// Google Fonts (OFL), self-hosted from app/fonts, latin subset (DESIGN §3, PRD: self-hosted).
// Committed to the repo so builds never depend on downloading fonts.
const anton = localFont({
  src: './fonts/anton-latin.woff2',
  weight: '400',
  display: 'swap',
  variable: '--font-anton',
  fallback: ['Arial Narrow', 'Impact', 'sans-serif'],
});
const jakarta = localFont({
  src: './fonts/plus-jakarta-sans-latin.woff2',
  weight: '400 700',
  display: 'swap',
  variable: '--font-jakarta',
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    type: 'website',
    siteName: SITE.title,
    locale: 'en_NG',
    title: SITE.title,
    description: SITE.description,
  },
  twitter: { card: 'summary_large_image' },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
};

/**
 * Runs before paint: enables motion start states only when motion is allowed (DESIGN §8.4). If the motion script hasn't
 * started within 2.5 s (slow network), content is simply shown.
 */
const headScript = `(function(){try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){var h=document.documentElement;h.classList.add('js-motion');setTimeout(function(){if(!window.__jccfMotion)h.classList.remove('js-motion')},2500)}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" className={`${anton.variable} ${jakarta.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
