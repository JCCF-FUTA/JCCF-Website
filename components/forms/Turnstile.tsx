'use client';

import Script from 'next/script';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * Cloudflare Turnstile (invisible/managed). Renders nothing when no site key is configured.
 * Loaded only on pages with a form (DESIGN §14: no third-party script on first paint elsewhere).
 */
export function Turnstile({ onToken, resetKey }: { onToken: (token: string | null) => void; resetKey?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useRef<string | undefined>(undefined);

  const render = () => {
    if (!SITE_KEY || !ref.current || !window.turnstile || id.current) return;
    id.current = window.turnstile.render(ref.current, {
      sitekey: SITE_KEY,
      size: 'flexible',
      appearance: 'interaction-only',
      callback: (t: string) => onToken(t),
      'expired-callback': () => onToken(null),
      'error-callback': () => onToken(null),
    });
  };

  useEffect(() => {
    render();
    return () => {
      if (id.current) window.turnstile?.remove(id.current);
      id.current = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (resetKey && id.current) window.turnstile?.reset(id.current);
  }, [resetKey]);

  if (!SITE_KEY) return null;
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="lazyOnload" onLoad={render} />
      <div ref={ref} className="min-h-0 empty:hidden" />
    </>
  );
}

export const turnstileEnabled = Boolean(SITE_KEY);
