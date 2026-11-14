'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * The motion layer (DESIGN §8, as amended by ANTI-SLOP.md). Pages stay server components and
 * mark elements with data attributes. Rule: nothing is ever hidden waiting for an animation.
 * Everything starts visible and only moves (transform). Elements already on screen when the page
 * loads are left alone, so nothing jumps.
 *
 *  [data-hero-item] / [data-hero-bg] M1 hero intro, pure CSS (globals.css), not here
 *  [data-reveal="up"]                 M2 settle up as it scrolls into view
 *  [data-reveal-stagger]              M15 children settle in reading order (max 8 animated)
 *  [data-reveal="image"]              M5 image settles from scale 1.1 inside its frame
 *  [data-parallax]                    M7 parallax (expanded+ only)
 *  [data-pin] + [data-pin-track]      M6 pinned horizontal track (expanded+, only if ≤ 1.5 screens of scroll)
 *  [data-scroll-progress]             M14 page progress bar
 *  .portrait                          gets .in-view when on screen (colour portraits on phones)
 *
 * Removed by the anti-slop audit: M3 word-split titles, M4 count-up, M17 magnetic buttons.
 * GSAP, ScrollTrigger and Lenis load lazily after first paint. prefers-reduced-motion: nothing runs.
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
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (cancelled || !root.classList.contains('js-motion')) return;
      gsap.registerPlugin(ScrollTrigger);
      (window as unknown as { __jccfMotion?: boolean }).__jccfMotion = true;

      const decel = 'expo.out'; // ≈ M3 emphasized-decelerate cubic-bezier(.05,.7,.1,1)
      const q = <T extends Element = HTMLElement>(sel: string) => Array.from(document.querySelectorAll<T>(sel) as NodeListOf<T>);
      const offscreen = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.9;

      // Smooth scrolling: desktop pointer devices only (DESIGN §8.2)
      let lenis: import('lenis').default | undefined;
      if (window.matchMedia('(pointer: fine) and (min-width: 840px)').matches) {
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
        cleanup = () => {
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
          const rise = desktop ? 32 : 20;
          const settle = (targets: Element | Element[], trigger: Element, extra: gsap.TweenVars = {}) =>
            gsap.from(targets, { y: rise, duration: 0.7, ease: decel, scrollTrigger: { trigger, start: 'top 90%', once: true }, ...extra });

          // M2: settle up (only elements that start below the fold)
          q('[data-reveal="up"]').forEach((el) => {
            if (el.closest('[data-reveal-stagger]') || !offscreen(el)) return;
            settle(el, el);
          });

          // M15: stagger groups
          q('[data-reveal-stagger]').forEach((group) => {
            if (!offscreen(group)) return;
            const kids = (Array.from(group.children) as HTMLElement[]).slice(0, 8);
            settle(kids, group, { stagger: 0.06, duration: 0.6 });
          });

          // M5: image settles inside its frame (frame and image stay visible)
          q('[data-reveal="image"]').forEach((el) => {
            const img = el.querySelector('img');
            if (!img || !offscreen(el)) return;
            gsap.from(img, { scale: 1.1, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
          });

          // M14: scroll progress
          q('[data-scroll-progress]').forEach((bar) => {
            gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
          });

          if (!desktop) return undefined;

          // M7: parallax
          q('[data-parallax]').forEach((el) => {
            gsap.fromTo(el, { yPercent: -6 }, {
              yPercent: 6, ease: 'none',
              scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
            });
          });

          // M6: pinned horizontal track. One per page, and only when it costs ≤ 1.5 screens of scrolling.
          const pin = q('[data-pin]')[0];
          const track = pin?.querySelector<HTMLElement>('[data-pin-track]');
          if (!pin || !track) return undefined;
          const distance = () => Math.max(0, track.scrollWidth - track.clientWidth);
          if (distance() < 80 || distance() > window.innerHeight * 1.5) return undefined;

          track.style.overflow = 'visible';
          pin.classList.add('is-pinned');
          const tween = gsap.to(track, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
              trigger: pin, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 0.4, invalidateOnRefresh: true,
              onUpdate: (st) => track.dispatchEvent(new CustomEvent('jccf:pin-progress', { detail: st.progress })),
            },
          });
          // Arrows and keyboard keep working while pinned: page scroll moves the track 1:1.
          const onStep = (e: Event) => {
            const px = (e as CustomEvent<number>).detail;
            const st = tween.scrollTrigger;
            if (!st) return;
            const target = Math.min(st.end, Math.max(st.start, window.scrollY + px));
            if (lenis) lenis.scrollTo(target, { duration: 0.6 });
            else window.scrollTo({ top: target, behavior: 'smooth' });
          };
          track.addEventListener('jccf:pin-step', onStep);
          return () => {
            track.removeEventListener('jccf:pin-step', onStep);
            tween.scrollTrigger?.kill();
            track.style.overflow = '';
            pin.classList.remove('is-pinned');
          };
        },
      );

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh);
      document.fonts?.ready.then(refresh).catch(() => {});

      const prev = cleanup;
      cleanup = () => {
        prev?.();
        window.removeEventListener('load', refresh);
        mm.revert();
      };
    })().catch(() => root.classList.remove('js-motion'));

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [pathname]);

  return null;
}
