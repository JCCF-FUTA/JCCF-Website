'use client';

import { useEffect, useRef, useState } from 'react';

/** Loads the Behold Instagram widget only when it scrolls near the viewport (saves data). */
export function BeholdWidget({ feedId }: { feedId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setLoad(true); io.disconnect(); } }, { rootMargin: '400px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!load || document.querySelector('script[data-behold]')) return;
    const s = document.createElement('script');
    s.type = 'module';
    s.src = 'https://w.behold.so/widget.js';
    s.dataset.behold = '';
    document.head.appendChild(s);
  }, [load]);
  return (
    <div ref={ref} className="min-h-40">
      {load && <behold-widget feed-id={feedId} />}
    </div>
  );
}

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'behold-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { 'feed-id': string };
    }
  }
}
