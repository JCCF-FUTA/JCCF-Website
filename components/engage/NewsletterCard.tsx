import { cn } from '@/lib/cn';
import { LinkButton } from '@/components/ui/Button';
import { Brand } from '@/components/ui/Brand';
import { PrivacyNote } from '@/components/forms/Fields';
import { NewsletterForm } from './NewsletterForm';

/**
 * Newsletter sign-up + WhatsApp channel (DESIGN §C18, PRD F7).
 * `band` is the full-width strip shown above the footer on every page (the site's only email sign-up).
 */
export function NewsletterCard({
  whatsapp,
  source,
  variant = 'card',
  className,
}: {
  whatsapp?: string;
  source: string;
  variant?: 'card' | 'band';
  className?: string;
}) {
  const body = (
    <div className="grid gap-6 expanded:grid-cols-2 expanded:items-center expanded:gap-16">
      <div className="flex flex-col gap-3">
        <h2 id={`newsletter-${source}`} className="type-headline text-headline-lg text-on-primary-container">Subscribe to our newsletter</h2>
        <p className="max-w-[44ch] text-body-lg text-on-primary-container">
          Household programme dates, announcements and devotionals in your inbox. About two emails a month.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <NewsletterForm source={source} />
        <div className="flex flex-col gap-3 medium:flex-row medium:items-center medium:justify-between">
          <PrivacyNote>We only use your email to send JCCF updates. Unsubscribe at any time.</PrivacyNote>
          {whatsapp && (
            <LinkButton href={whatsapp} variant="outlined" size="sm" className="shrink-0 self-start">
              <span className="inline-flex items-center gap-2"><Brand name="whatsapp" size={18} /> WhatsApp channel</span>
            </LinkButton>
          )}
        </div>
      </div>
    </div>
  );

  if (variant === 'band') {
    return (
      <section aria-labelledby={`newsletter-${source}`} className={cn('bg-primary-container [--field-bg:var(--md-sys-color-primary-container)]', className)}>
        <div className="container-page py-14 expanded:py-20">{body}</div>
      </section>
    );
  }
  return (
    <div className={cn('rounded-2xl bg-primary-container p-6 [--field-bg:var(--md-sys-color-primary-container)] expanded:p-10', className)}>{body}</div>
  );
}
