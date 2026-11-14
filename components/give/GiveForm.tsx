'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { naira } from '@/lib/format';
import type { GiveSettings } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Title } from '@/components/ui/Title';
import { FormAlert, PrivacyNote, SelectField, TextField } from '@/components/forms/Fields';
import { Turnstile } from '@/components/forms/Turnstile';

const MIN = 100;

/** Give card with Paystack checkout (DESIGN §C17, PRD F5). */
export function GiveForm({ give, enabled, className, headingLevel = 'h2', title = 'Give to *the Household*' }: { give: GiveSettings; enabled: boolean; className?: string; headingLevel?: 'h2' | 'h3'; title?: string }) {
  const open = give.categories.filter((c) => c.open);
  const kinds = [
    { kind: 'offering', label: 'Offering' },
    { kind: 'partnership', label: 'Partnership' },
    { kind: 'project', label: 'Programme/Project' },
  ].filter((k) => open.some((c) => c.kind === k.kind)) as { kind: 'offering' | 'partnership' | 'project'; label: string }[];
  const projects = open.filter((c) => c.kind === 'project');

  const [kind, setKind] = useState(kinds[0]?.kind ?? 'offering');
  const [projectId, setProjectId] = useState(projects[0]?.id ?? '');
  const [preset, setPreset] = useState<number | 'other'>(give.presetAmounts[1] ?? give.presetAmounts[0] ?? 1000);
  const [other, setOther] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [state, setState] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [resetKey, setResetKey] = useState(0);

  const amount = preset === 'other' ? Number(other.replace(/[^\d]/g, '')) || 0 : preset;
  const categoryId = kind === 'project' ? projectId : open.find((c) => c.kind === kind)?.id ?? kind;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email address. Paystack sends your receipt there.';
    if (amount < MIN) errs.amount = `The minimum gift is ${naira(MIN)}.`;
    setFields(errs);
    if (Object.keys(errs).length) return;
    setState('submitting');
    setError(null);
    try {
      const res = await fetch('/api/give/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, categoryId, name, email, phone, token }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error || 'We couldn’t start the payment. Please try again.');
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We couldn’t start the payment. Please try again.');
      setState('error');
      setResetKey((k) => k + 1);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className={cn('theme-light flex flex-col gap-6 rounded-2xl p-6 shadow-elev-4 expanded:p-10', className)}>
      <div>
        <Title as={headingLevel} text={title} size="headline-lg" />
        <p className="mt-2 text-body-lg text-on-surface-variant">Your giving funds combined programmes, welfare and outreach on campus.</p>
      </div>

      {!enabled && (
        <FormAlert kind="info">Online giving is being set up. Until then, please give by bank transfer using the details on this page.</FormAlert>
      )}

      <fieldset disabled={!enabled} className="flex flex-col gap-6 disabled:opacity-60">
        <div>
          <p aria-hidden="true" className="mb-2 text-label-md font-semibold uppercase text-on-surface-variant">Category</p>
          <div role="radiogroup" aria-label="Category" className="grid grid-flow-col auto-cols-fr overflow-hidden rounded-full border border-outline">
            {kinds.map((k, i) => {
              const selected = k.kind === kind;
              return (
                <label key={k.kind} className={cn('state-layer relative flex h-12 cursor-pointer items-center justify-center gap-1.5 px-2 text-center text-label-lg font-semibold', i > 0 && 'border-l border-outline', selected ? 'bg-primary-container text-on-primary-container' : 'text-on-surface')}>
                  <input type="radio" name="category" value={k.kind} checked={selected} onChange={() => setKind(k.kind)} className="sr-only" />
                  {selected && <Icon name="check" size={20} />}
                  {k.kind === 'project' ? (
                    <span className="truncate"><span className="medium:hidden">Project</span><span className="hidden medium:inline">{k.label}</span></span>
                  ) : (
                    <span className="truncate">{k.label}</span>
                  )}
                </label>
              );
            })}
          </div>
          {kind === 'project' && projects.length > 0 && (
            <SelectField label="Programme or project" className="mt-4" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </SelectField>
          )}
          {open.find((c) => c.id === categoryId)?.description && (
            <p className="mt-2 text-body-sm text-on-surface-variant">{open.find((c) => c.id === categoryId)?.description}</p>
          )}
        </div>

        <div>
          <p aria-hidden="true" className="mb-2 text-label-md font-semibold uppercase text-on-surface-variant">Amount</p>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Amount">
            {[...give.presetAmounts, 'other' as const].map((a) => {
              const selected = preset === a;
              return (
                <label key={a} className={cn('state-layer relative inline-flex h-12 cursor-pointer items-center gap-1.5 rounded-full px-5 text-label-lg font-semibold tabular-nums', selected ? 'bg-primary-container text-on-primary-container' : 'border border-outline-variant text-on-surface')}>
                  <input type="radio" name="amount" checked={selected} onChange={() => setPreset(a)} className="sr-only" />
                  {selected && <Icon name="check" size={20} />}
                  {a === 'other' ? 'Other' : naira(a)}
                </label>
              );
            })}
          </div>
          {preset === 'other' && (
            <TextField
              className="mt-4"
              label="Amount in naira"
              inputMode="numeric"
              value={other}
              onChange={(e) => setOther(e.target.value)}
              helper={`Minimum ${naira(MIN)}`}
              error={fields.amount}
              autoFocus
            />
          )}
          {preset !== 'other' && fields.amount && <p className="mt-2 text-body-sm text-error">{fields.amount}</p>}
        </div>

        <div className="grid gap-4 medium:grid-cols-2">
          <TextField label="Your name" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={fields.name} />
          <TextField label="Email" required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={fields.email} />
          <TextField label="Phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="medium:col-span-2" helper="Optional" />
        </div>

        <Turnstile onToken={setToken} resetKey={resetKey} />
        {error && <FormAlert>{error}</FormAlert>}

        <Button type="submit" size="lg" loading={state === 'submitting'} icon="volunteer_activism" className="w-full">
          {amount >= MIN ? `Give ${naira(amount)} with Paystack` : 'Give with Paystack'}
        </Button>
      </fieldset>
      <PrivacyNote>Secured by Paystack. Card, bank transfer and USSD accepted. JCCF never sees your card details.</PrivacyNote>
    </form>
  );
}
