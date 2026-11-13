'use client';

import { useState } from 'react';

export type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

/** POST JSON to an API route with friendly error messages (DESIGN §C26: never raw error text). */
export function useSubmit<T extends Record<string, unknown>>(url: string) {
  const [state, setState] = useState<SubmitState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [resetKey, setResetKey] = useState(0);

  async function submit(body: T) {
    setState('submitting');
    setError(null);
    setFieldErrors({});
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: Record<string, string> };
      if (!res.ok || !data.ok) {
        setFieldErrors(data.fields ?? {});
        setError(data.error ?? 'Something went wrong. Please try again.');
        setState('error');
        setResetKey((k) => k + 1);
        return null;
      }
      setState('success');
      return data;
    } catch {
      setError('We couldn’t reach the server. Check your connection and try again.');
      setState('error');
      setResetKey((k) => k + 1);
      return null;
    }
  }

  return { state, error, fieldErrors, submit, resetKey, reset: () => setState('idle') };
}
