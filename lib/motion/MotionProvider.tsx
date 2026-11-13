'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * The motion layer (DESIGN §8). Pages stay server components and mark elements with data attributes:
 *
 *  [data-hero-item] / [data-hero-bg] M1 hero intro — pure CSS (globals.css), not here
 *  [data-split]                    M3 title words rise from a mask; [data-hl-bar] sweeps after (M11)
 *  [data-reveal="up"]              M2 reveal up
 *  [data-reveal-stagger]           M15 children reveal in order (max 8 animated)
 *  [data-reveal="image"]           M5 clip-path image reveal
 *  [data-count]                    M4 count up
 *  [data-parallax]                 M7 parallax (expanded+ only)
 *  [data-pin] + [data-pin-track]   M6 pinned horizontal track (expanded+ only)
 *  [data-scroll-progress]          M14 page progress bar
 *  .portrait                       gets .in-view when on screen (colour portraits on phones)
 *
 * GSAP, ScrollTrigger, SplitText and Lenis are loaded lazily after first paint.
 * With prefers-reduced-motion nothing animates and html.js-motion is never set (see the head script).
 */
export function MotionProvider() {
  const pathname = usePathname();

  // Portraits: colour when in view (phones). Works with or without motion.
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.portrait');
    if (!('IntersectionObserver' in window) || !els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('in-view', e.isIntersecting)),
      { rootMargin: '-35% 0px -35% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains('js-motion')) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('gsap/SplitText'),
      ]);
      // The head script drops js-motion if this took too long (slow network): then just show content.
      if (cancelled || !root.classList.contains('js-motion')) return;
      gsap.registerPlugin(ScrollTrigger, SplitText);
      (window as unknown as { __jccfMotion?: boolean }).__jccfMotion = true;

      const decel = 'expo.out'; // ≈ M3 emphasized-decelerate cubic-bezier(.05,.7,.1,1)
      const q = <T extends Element = HTMLElement>(sel: string) => Array.from(document.querySelectorAll<T>(sel) as NodeListOf<T>);

      // Smooth scrolling: desktop pointer devices only (DESIGN §8.2)
      let lenis: import('lenis').default | undefined;
      const fine = window.matchMedia('(pointer: fine) and (min-width: 840px)').matches;
      if (fine) {
        const { default: Lenis } = await import('lenis');
        if (cancelled) return;
        lenis = new Lenis({ lerp: 0.12, prevent: (node: HTMLElement) => !!node.closest('[data-lenis-prevent]') });
        lenis.on('scroll', ScrollTrigger.update);
        const raf = (t: number) => lenis!.raf(t * 1000);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);
        const stop = () => lenis?.stop();
        const start = () => lenis?.start();
        window.addEventListener('jccf:scroll-lock', stop);
        window.addEventListener('jccf:scroll-unlock', start);
        const prev = cleanup;
        cleanup = () => {
          prev?.();
          gsap.ticker.remove(raf);
          window.removeEventListener('jccf:scroll-lock', stop);
          window.removeEventListener('jccf:scroll-unlock', start);
          lenis?.destroy();
        };
      }

      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: '(min-width: 840px) and (prefers-reduced-motion: no-preference)',
          mobile: '(max-width: 839.98px) and (prefers-reduced-motion: no-preference)',
        },
        (ctx) => {
          const desktop = Boolean(ctx.conditions?.desktop);
          const rise = desktop ? 40 : 24;

          // M1 (hero intro) runs in CSS — see globals.css — so it never delays LCP.

          // M3 + M11 — titles
          q('[data-split]').forEach((el) => {
            const split = SplitText.create(el, { type: 'words', mask: 'words', wordsClass: 'split-word' });
            gsap.set(el, { visibility: 'visible' });
            const bars = el.querySelectorAll('[data-hl-bar]');
            const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
            tl.fromTo(split.words, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: decel, stagger: 0.06 });
            if (bars.length) tl.to(bars, { scaleX: 1, duration: 0.6, ease: 'power3.out' }, '-=0.25');
          });

          // M2 — reveal up
          q('[data-reveal="up"]').forEach((el) => {
            if (el.closest('[data-reveal-stagger]')) return;
            gsap.fromTo(el, { opacity: 0, y: rise }, {
              opacity: 1, y: 0, duration: 0.7, ease: decel,
              scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            });
          });

          // M15 — stagger grid (max 8 animated, the rest appear instantly)
          q('[data-reveal-stagger]').forEach((group) => {
            const kids = Array.from(group.children) as HTMLElement[];
            const animated = kids.slice(0, 8);
            gsap.set(kids.slice(8), { opacity: 1 });
            gsap.fromTo(animated, { opacity: 0, y: rise }, {
              opacity: 1, y: 0, duration: 0.6, ease: decel, stagger: 0.06,
              scrollTrigger: { trigger: group, start: 'top 85%', once: true },
            });
          });

          // M5 — image reveal
          q('[data-reveal="image"]').forEach((el) => {
            const img = el.querySelector('img');
            const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
            tl.fromTo(el, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power3.out' });
            if (img) tl.fromTo(img, { scale: 1.15 }, { scale: 1, duration: 1.2, ease: 'power3.out' }, 0);
          });

          // M4 — count up
          q('[data-count]').forEach((el) => {
            const end = Number(el.dataset.count);
            if (!Number.isFinite(end)) return;
            const obj = { v: 0 };
            gsap.to(obj, {
              v: end, duration: 1.2, ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 90%', once: true },
              onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString('en-NG'); },
            });
          });

          // M14 — scroll progress
          q('[data-scroll-progress]').forEach((bar) => {
            gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
          });

          if (desktop) {
            // M17 — magnetic hero CTAs (drift up to 6px toward the pointer)
            const magnets = q('[data-magnetic]');
            const handlers = magnets.map((el) => {
              const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
              const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });
              const move = (e: PointerEvent) => {
                const r = el.getBoundingClientRect();
                xTo(((e.clientX - r.left) / r.width - 0.5) * 12);
                yTo(((e.clientY - r.top) / r.height - 0.5) * 12);
              };
              const leave = () => { xTo(0); yTo(0); };
              el.addEventListener('pointermove', move);
              el.addEventListener('pointerleave', leave);
              return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
            });
            ctx.add(() => () => handlers.forEach((off) => off()));

            // M7 — parallax
            q('[data-parallax]').forEach((el) => {
              gsap.fromTo(el, { yPercent: -8 }, {
                yPercent: 8, ease: 'none',
                scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
              });
            });

            // M6 — pinned horizontal track (one per page)
            const pin = q('[data-pin]')[0];
            const track = pin?.querySelector<HTMLElement>('[data-pin-track]');
            if (pin && track) {
              const distance = () => Math.max(0, track.scrollWidth - track.clientWidth);
              const progress = pin.querySelector('[data-pin-progress]');
              track.style.overflow = 'visible';
              pin.classList.add('is-pinned');
              const tween = gsap.to(track, {
                x: () => -distance(),
                ease: 'none',
                scrollTrigger: {
                  trigger: pin, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true,
                  onUpdate: (st) => { if (progress) gsap.set(progress, { scaleX: st.progress }); },
                },
              });
              return () => { tween.scrollTrigger?.kill(); track.style.overflow = ''; pin.classList.remove('is-pinned'); };
            }
          }
          return undefined;
        },
      );

      // Images loading late shift layout: refresh once fonts and images settle.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh);
      document.fonts?.ready.then(refresh).catch(() => {});

      const prev = cleanup;
      cleanup = () => {
        prev?.();
        window.removeEventListener('load', refresh);
        mm.revert();
      };
    })().catch(() => {
      // If anything fails, show everything.
      root.classList.remove('js-motion');
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [pathname]);

  return null;
}
