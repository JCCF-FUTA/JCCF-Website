'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { FormAlert, TextField } from '@/components/forms/Fields';
import { signIn } from '../actions';

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, undefined);
  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      <TextField label="Email" name="email" type="email" autoComplete="username" required />
      <TextField label="Password" name="password" type="password" autoComplete="current-password" required />
      {state?.error && <FormAlert>{state.error}</FormAlert>}
      <Button type="submit" loading={pending} className="w-full">Sign in</Button>
    </form>
  );
}
