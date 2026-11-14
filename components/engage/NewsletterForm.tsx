'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Turnstile } from '@/components/forms/Turnstile';
import { useSubmit } from '@/components/forms/useSubmit';

/** Email sign-up (PRD F7). `compact` is the single-line footer version. */
export function NewsletterForm({ source, compact, tone = 'light' }: { source: string; compact?: boolean; tone?: 'light' | 'stage' }) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const { state, error, submit, resetKey } = useSubmit('/api/newsletter');

  if (state === 'success') {
    return (
      <p role="status" className="flex items-center gap-2 text-title-md font-semibold">
        <Icon name="check_circle" filled className={tone === 'stage' ? 'text-glow' : 'text-primary'} />
        You’re in. Watch your inbox for programme dates and devotionals.
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit({ email, source, token });
      }}
      className="w-full"
      noValidate
    >
      <div className={cn('flex gap-2', compact ? 'flex-row' : 'flex-col medium:flex-row')}>
        <label className="sr-only" htmlFor={`nl-${source}`}>Email address</label>
        <input
          id={`nl-${source}`}
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={state === 'error' || undefined}
          aria-describedby={error ? `nl-${source}-err` : undefined}
          className={cn(
            'h-14 min-w-0 rounded-full border px-5 text-body-lg outline-none transition-colors focus:border-2',
            // stacked on phones: keep the field's height; side by side: share the row
            compact ? 'flex-1' : 'shrink-0 medium:flex-1 medium:shrink',
            tone === 'stage'
              ? 'border-stage-outline bg-white/5 text-on-stage placeholder:text-on-stage-variant focus:border-glow'
              : 'border-outline bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant focus:border-primary',
          )}
        />
        <Button type="submit" size="lg" tone={tone} loading={state === 'submitting'} className={compact ? 'px-6' : ''} icon={compact ? undefined : 'mail'}>
          Subscribe
        </Button>
      </div>
      <Turnstile onToken={setToken} resetKey={resetKey} />
      {error && (
        <p id={`nl-${source}-err`} role="alert" className={cn('mt-2 px-5 text-body-sm', tone === 'stage' ? 'text-stage-accent-text' : 'text-error')}>
          {error}
        </p>
      )}
    </form>
  );
}
