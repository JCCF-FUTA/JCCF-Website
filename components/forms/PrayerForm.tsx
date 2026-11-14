'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Checkbox, FormAlert, PrivacyNote, TextArea, TextField } from './Fields';
import { Turnstile } from './Turnstile';
import { useSubmit } from './useSubmit';

/** Private prayer request (PRD F6). */
export function PrayerForm() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [request, setRequest] = useState('');
  const [followUp, setFollowUp] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const { state, error, fieldErrors, submit, resetKey } = useSubmit('/api/prayer');

  if (state === 'success') {
    return (
      <div role="status" className="flex flex-col items-center gap-4 rounded-2xl bg-surface-container-low p-8 text-center">
        <span className="inline-flex size-16 items-center justify-center rounded-full bg-primary-container text-on-primary-container"><Icon name="check_circle" filled size={40} /></span>
        <h2 className="type-headline text-headline-md">We are praying with you</h2>
        <p className="max-w-[44ch] text-body-lg text-on-surface-variant">Your request was received and only the PRO and General Secretary can read it.</p>
        <blockquote className="max-w-[44ch] border-l-4 border-primary pl-4 text-left text-body-lg italic">
          “Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.” <cite className="block not-italic text-body-md text-on-surface-variant">Philippians 4:6</cite>
        </blockquote>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        submit({ name, contact, request, followUp, token });
      }}
      className="flex flex-col gap-5"
    >
      <div className="grid gap-5 medium:grid-cols-2">
        <TextField label="Your name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} helper="Optional. Leave blank to stay anonymous." />
        <TextField label="Phone or email" value={contact} onChange={(e) => setContact(e.target.value)} helper="Optional. Only if you want us to reach you." error={fieldErrors.contact} />
      </div>
      <TextArea label="Your prayer request" required rows={6} maxLength={2000} value={request} onChange={(e) => setRequest(e.target.value)} error={fieldErrors.request} />
      <Checkbox label="You may contact me" description="A member of the prayer team may reach out to pray with you." checked={followUp} onChange={(e) => setFollowUp(e.target.checked)} />
      <Turnstile onToken={setToken} resetKey={resetKey} />
      {error && <FormAlert>{error}</FormAlert>}
      <div className="flex flex-col gap-4 medium:flex-row medium:items-center medium:justify-between">
        <PrivacyNote>Only the JCCF PRO and General Secretary can read prayer requests. They are never shared or emailed.</PrivacyNote>
        <Button type="submit" size="lg" loading={state === 'submitting'} icon="favorite" className="shrink-0">Send request</Button>
      </div>
    </form>
  );
}
