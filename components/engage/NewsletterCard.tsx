import { cn } from '@/lib/cn';
import { LinkButton } from '@/components/ui/Button';
import { Brand } from '@/components/ui/Brand';
import { PrivacyNote } from '@/components/forms/Fields';
import { Title } from '@/components/ui/Title';
import { NewsletterForm } from './NewsletterForm';

/** Newsletter + WhatsApp card (DESIGN §C18). `wide` lays it out in two columns on expanded+. */
export function NewsletterCard({ whatsapp, source, tone = 'light', className, wide }: { whatsapp?: string; source: string; tone?: 'light' | 'stage'; className?: string; wide?: boolean }) {
  return (
    <div
      data-reveal="up"
      className={cn(
        'relative overflow-hidden rounded-2xl p-6 expanded:p-10',
        tone === 'stage' ? 'bg-stage-container text-on-stage' : 'bg-primary-container text-on-primary-container [--field-bg:var(--md-sys-color-primary-container)]',
        wide ? 'grid gap-6 expanded:grid-cols-2 expanded:items-center expanded:gap-12' : 'flex flex-col gap-5',
        className,
      )}
    >
      <div className="flex flex-col gap-3">
        <Title text="Get programme dates by email" size="headline-lg" tone={tone} />
        <p className="text-body-lg">Household programme dates, announcements and devotionals. About two emails a month.</p>
      </div>
      <div className="flex flex-col gap-4">
        <NewsletterForm source={source} tone={tone} />
        {whatsapp && (
          <LinkButton href={whatsapp} variant="tonal" tone={tone} className={tone === 'light' ? 'self-start bg-surface-container-lowest text-on-surface' : 'self-start'}>
            <span className="inline-flex items-center gap-2"><Brand name="whatsapp" /> Join our WhatsApp channel</span>
          </LinkButton>
        )}
        <PrivacyNote>We only use your email to send JCCF updates. Unsubscribe at any time.</PrivacyNote>
      </div>
    </div>
  );
}
