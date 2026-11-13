'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { MAIN_NAV, MENU_NAV } from '@/lib/site';
import type { LiveStatus, SiteSettings } from '@/lib/types';
import { LinkButton } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Brand } from '@/components/ui/Brand';
import { ThemeToggle } from './ThemeToggle';
import { LiveBanner } from './LiveBanner';

type Socials = SiteSettings['socials'];

/** Top app bar + live banner + navigation drawer (DESIGN §C01, C02, C24; motion M9). */
export function Header({ live, socials }: { live: LiveStatus; socials: Socials }) {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setSolid(y > 80);
        setHidden(y > 240 && y > lastY.current + 4);
        if (y < lastY.current - 4 || y < 240) setHidden(false);
        lastY.current = y;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const watchHref = live.live ? '/media#live' : '/media';

  return (
    <>
      <div
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-transform duration-300',
          hidden && !open ? '-translate-y-full ease-emphasized-accelerate' : 'translate-y-0 ease-emphasized-decelerate',
        )}
      >
        {live.live && <LiveBanner title={live.title} />}
        <header
          className={cn(
            'transition-[background-color,box-shadow,color] duration-300 ease-standard',
            solid
              ? 'bg-surface/85 text-on-surface shadow-elev-2 backdrop-blur-md'
              : // over a stage hero: stage red buttons in both modes
                'bg-transparent text-white [--md-sys-color-primary:#d60000] [--md-sys-color-on-primary:#fff]',
          )}
        >
          <div className="container-page flex h-16 items-center gap-2 expanded:h-18">
            <Link href="/" className="mr-auto flex min-h-12 items-center gap-3 rounded-full pr-2" aria-label="JCCF FUTA home">
              <Image src="/brand/jccf-logo-160.webp" alt="" width={40} height={40} priority className="size-10" />
              <span className="flex flex-col leading-none">
                <span className="font-display text-[1.375rem] uppercase tracking-wide">JCCF FUTA</span>
                <span className={cn('hidden text-[0.6875rem] font-medium medium:block', solid ? 'text-on-surface-variant' : 'text-white/70')}>
                  Joint Christian Campus Fellowship
                </span>
              </span>
            </Link>

            <nav aria-label="Main" className="hidden expanded:block">
              <ul className="flex items-center gap-1">
                {MAIN_NAV.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'state-layer relative inline-flex h-12 items-center rounded-full px-4 text-title-sm font-semibold',
                          active && (solid ? 'text-primary' : 'text-white'),
                        )}
                      >
                        {item.label}
                        <span
                          aria-hidden="true"
                          className={cn(
                            'absolute inset-x-4 bottom-2 h-0.5 origin-left rounded-full transition-transform duration-500 ease-emphasized-decelerate',
                            solid ? 'bg-primary' : 'bg-stage-accent',
                            active ? 'scale-x-100' : 'scale-x-0',
                          )}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {live.live && (
              <Link
                href={watchHref}
                className="hidden h-8 items-center gap-1.5 rounded-full bg-live px-3 text-label-md font-semibold uppercase text-white medium:inline-flex"
              >
                <span className="size-1.5 rounded-full bg-white animate-live-pulse" aria-hidden="true" /> Live
              </Link>
            )}

            <ThemeToggle className={cn('hidden medium:inline-flex', solid ? 'text-on-surface' : 'text-white')} />

            <LinkButton href="/give" size="sm" tone={solid ? 'light' : 'stage'} className="ml-1" icon="volunteer_activism">
              Give
            </LinkButton>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="site-menu"
              className="state-layer -mr-2 inline-flex size-12 items-center justify-center rounded-full"
            >
              <Icon name="menu" />
            </button>
          </div>
        </header>
      </div>

      <NavDrawer open={open} onClose={() => setOpen(false)} isActive={isActive} watchHref={watchHref} live={live.live} socials={socials} />
    </>
  );
}

function NavDrawer({
  open, onClose, isActive, watchHref, live, socials,
}: {
  open: boolean; onClose: () => void; isActive: (h: string) => boolean; watchHref: string; live: boolean; socials: Socials;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = 'hidden';
      window.dispatchEvent(new Event('jccf:scroll-lock'));
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onClose_ = () => {
      document.documentElement.style.overflow = '';
      window.dispatchEvent(new Event('jccf:scroll-unlock'));
      onClose();
    };
    d.addEventListener('close', onClose_);
    return () => d.removeEventListener('close', onClose_);
  }, [onClose]);

  const socialLinks = [
    { key: 'instagram', href: socials.instagram, label: 'Instagram' },
    { key: 'facebook', href: socials.facebook, label: 'Facebook' },
    { key: 'youtube', href: socials.youtube, label: 'YouTube' },
    { key: 'whatsapp', href: socials.whatsapp, label: 'WhatsApp' },
  ].filter((s) => s.href) as { key: 'instagram' | 'facebook' | 'youtube' | 'whatsapp'; href: string; label: string }[];

  return (
    <dialog
      ref={ref}
      id="site-menu"
      aria-label="Site menu"
      data-lenis-prevent
      className="theme-stage m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto p-0 text-on-stage backdrop:bg-black/60 open:animate-[rise-in_400ms_cubic-bezier(.05,.7,.1,1)_both]"
    >
      <div className="container-page flex min-h-full flex-col pb-8">
        <div className="flex h-16 items-center justify-between expanded:h-18">
          <span className="font-display text-[1.375rem] uppercase tracking-wide">Menu</span>
          <div className="flex items-center gap-1">
            <ThemeToggle className="text-white" />
            <button type="button" onClick={onClose} aria-label="Close menu" className="state-layer -mr-2 inline-flex size-12 items-center justify-center rounded-full">
              <Icon name="close" />
            </button>
          </div>
        </div>

        <nav aria-label="Menu" className="mt-6 flex-1">
          <ol className="grid gap-x-10 expanded:grid-cols-2">
            {MENU_NAV.map((item, i) => {
              const active = isActive(item.href);
              return (
                <li key={item.href} className="border-b border-stage-outline">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? 'page' : undefined}
                    className="group flex min-h-16 items-baseline gap-4 py-3"
                    style={{ animation: `rise-in 400ms cubic-bezier(.05,.7,.1,1) ${80 + i * 40}ms both` }}
                  >
                    <span className="w-7 text-label-md font-semibold tabular-nums text-on-stage-variant">{String(i + 1).padStart(2, '0')}</span>
                    <span className={cn('font-display text-[2.25rem] leading-tight uppercase transition-colors group-hover:text-stage-accent', active && 'text-stage-accent')}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <LinkButton href="/give" tone="stage" icon="volunteer_activism" onClick={onClose}>Give</LinkButton>
          <LinkButton href={watchHref} tone="stage" variant={live ? 'filled-inverse' : 'outlined'} icon={live ? undefined : 'live_tv'} onClick={onClose}>
            {live && <span className="mr-2 inline-block size-2 rounded-full bg-live animate-live-pulse" aria-hidden="true" />}
            Watch live
          </LinkButton>
          <div className="ml-auto flex gap-1">
            {socialLinks.map((s) => (
              <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                className="state-layer inline-flex size-12 items-center justify-center rounded-full border border-stage-outline">
                <Brand name={s.key} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </dialog>
  );
}
