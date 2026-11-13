'use client';

import { useEffect, useRef, useState } from 'react';

type Msg = { id: number; text: string };

/** Show a snackbar from anywhere on the client (DESIGN §C25). */
export function showSnackbar(text: string) {
  window.dispatchEvent(new CustomEvent('jccf:snackbar', { detail: text }));
}

export function SnackbarHost() {
  const [msg, setMsg] = useState<Msg | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    const on = (e: Event) => {
      const text = (e as CustomEvent<string>).detail;
      setMsg({ id: Date.now(), text });
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setMsg(null), 4000);
    };
    window.addEventListener('jccf:snackbar', on);
    return () => window.removeEventListener('jccf:snackbar', on);
  }, []);
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex justify-center">
      {msg && (
        <p key={msg.id} className="page-enter pointer-events-auto rounded-md bg-inverse-surface px-4 py-3.5 text-body-md text-inverse-on-surface shadow-elev-3">
          {msg.text}
        </p>
      )}
    </div>
  );
}
