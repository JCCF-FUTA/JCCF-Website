'use client';

import { useId, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

/** M3 primary tabs, 48px (DESIGN §12 Programmes). Panels are server-rendered; only visibility toggles. */
export function Tabs({ tabs, className }: { tabs: { label: string; count?: number; panel: React.ReactNode }[]; className?: string }) {
  const [active, setActive] = useState(0);
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const move = (i: number) => {
    const n = (i + tabs.length) % tabs.length;
    setActive(n);
    refs.current[n]?.focus();
  };
  return (
    <div className={className}>
      <div role="tablist" aria-label="Programmes" className="mb-8 flex border-b border-outline-variant">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            ref={(el) => { refs.current[i] = el; }}
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={active === i}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') move(i + 1);
              if (e.key === 'ArrowLeft') move(i - 1);
            }}
            className={cn('state-layer relative h-12 flex-1 px-4 text-title-sm font-semibold medium:flex-none medium:px-8', active === i ? 'text-primary' : 'text-on-surface-variant')}
          >
            {t.label}{typeof t.count === 'number' && <span className="ml-1.5 tabular-nums opacity-70">({t.count})</span>}
            <span className={cn('absolute inset-x-4 bottom-0 h-[3px] rounded-t-full bg-primary transition-transform duration-300 ease-emphasized', active === i ? 'scale-x-100' : 'scale-x-0')} aria-hidden="true" />
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div key={t.label} role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={active !== i} tabIndex={0} className="outline-none">
          {t.panel}
        </div>
      ))}
    </div>
  );
}
