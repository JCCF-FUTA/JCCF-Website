import { LoginForm } from './LoginForm';

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm py-12">
      <h1 className="text-headline-sm font-semibold">Staff sign in</h1>
      <p className="mt-2 text-body-md text-on-surface-variant">Use your office’s role email (for example pro@jccffuta.org), not a personal email.</p>
      <LoginForm />
    </div>
  );
}
