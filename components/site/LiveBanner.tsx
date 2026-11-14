'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';

/** "We are live" strip above the header on every page (DESIGN §C02). Dismissible for the session. */
export function LiveBanner({ title }: { title?: string }) {
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    try { setDismissed(sessionStorage.getItem('live-dismissed') === '1'); } catch {}
  }, []);
  if (dismissed) return null;
  return (
    <div role="status" className="bg-live text-white animate-[slide-down_300ms_cubic-bezier(.05,.7,.1,1)_both]">
      <div className="container-page flex h-12 items-center gap-3">
        <span className="size-2 shrink-0 rounded-full bg-white animate-live-pulse" aria-hidden="true" />
        <span className="shrink-0 text-label-md font-semibold uppercase">We are live</span>
        <span className="hidden min-w-0 truncate text-body-md text-white/90 medium:block">{title}</span>
        <Link href="/media#live" className="ml-auto inline-flex min-h-12 shrink-0 items-center gap-1 text-label-lg font-semibold underline-offset-4 hover:underline">
          Watch now<span className="sr-only">: {title}</span> <Icon name="arrow_forward" size={20} />
        </Link>
        <button
          type="button"
          aria-label="Dismiss live banner"
          className="-mr-3 inline-flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-white/10"
          onClick={() => {
            try { sessionStorage.setItem('live-dismissed', '1'); } catch {}
            setDismissed(true);
          }}
        >
          <Icon name="close" size={20} />
        </button>
      </div>
    </div>
  );
}
