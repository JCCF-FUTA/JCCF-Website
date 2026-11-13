'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { FormAlert, PrivacyNote, SelectField, TextArea, TextField } from './Fields';
import { Turnstile } from './Turnstile';
import { useSubmit } from './useSubmit';

const SUBJECTS = ['General enquiry', 'Fellowship profile update', 'Programmes', 'Giving', 'Media & publicity', 'Alumni', 'Other'];

/** Contact form (PRD F8). */
export function ContactForm() {
  const [v, setV] = useState({ name: '', contact: '', subject: SUBJECTS[0], message: '' });
  const [token, setToken] = useState<string | null>(null);
  const { state, error, fieldErrors, submit, resetKey } = useSubmit('/api/contact');
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setV({ ...v, [k]: e.target.value });

  if (state === 'success') {
    return (
      <div role="status" className="flex flex-col items-start gap-3 rounded-2xl bg-surface-container-low p-8">
        <Icon name="check_circle" filled size={40} className="text-primary" />
        <h2 className="type-headline text-headline-md">Message sent</h2>
        <p className="text-body-lg text-on-surface-variant">Thank you, {v.name.split(' ')[0] || 'friend'}. The Secretariat will reply to {v.contact} as soon as possible.</p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); submit({ ...v, token }); }} className="flex flex-col gap-5">
      <div className="grid gap-5 medium:grid-cols-2">
        <TextField label="Your name" required autoComplete="name" value={v.name} onChange={set('name')} error={fieldErrors.name} />
        <TextField label="Email or phone" required value={v.contact} onChange={set('contact')} error={fieldErrors.contact} />
      </div>
      <SelectField label="Subject" value={v.subject} onChange={set('subject')}>
        {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
      </SelectField>
      <TextArea label="Message" required rows={6} maxLength={3000} value={v.message} onChange={set('message')} error={fieldErrors.message} />
      <Turnstile onToken={setToken} resetKey={resetKey} />
      {error && <FormAlert>{error}</FormAlert>}
      <div className="flex flex-col gap-4 medium:flex-row medium:items-center medium:justify-between">
        <PrivacyNote>Your message is read by the JCCF Secretariat and Publicity Unit only.</PrivacyNote>
        <Button type="submit" size="lg" loading={state === 'submitting'} icon="mail" className="shrink-0">Send message</Button>
      </div>
    </form>
  );
}
