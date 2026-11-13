import type { Metadata } from 'next';
import { verifyTransaction } from '@/lib/paystack';
import { naira } from '@/lib/format';
import { LinkButton } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Thank you', robots: { index: false } };

/** Paystack callback page: verifies the transaction server-side before saying thank you. */
export default async function ThanksPage({ searchParams }: { searchParams: Promise<{ reference?: string; trxref?: string }> }) {
  const sp = await searchParams;
  const reference = sp.reference ?? sp.trxref;
  const tx = reference ? await verifyTransaction(reference) : null;
  const ok = tx?.status === 'success';

  return (
    <section className="theme-stage min-h-[80svh]">
      <div className="container-page flex flex-col items-center gap-6 pt-36 pb-24 text-center">
        <span className={`inline-flex size-20 items-center justify-center rounded-full ${ok ? 'bg-white text-primary' : 'bg-white/10 text-on-stage'}`}>
          <Icon name={ok ? 'check_circle' : 'info'} filled={ok} size={48} />
        </span>
        <h1 className="type-display text-display-lg">{ok ? 'Thank you' : 'Payment not confirmed'}</h1>
        {ok ? (
          <p className="max-w-[48ch] text-body-lg text-on-stage-variant">
            Your gift of <span className="font-semibold text-on-stage">{naira(tx.amount / 100)}</span> was received. Paystack has emailed your receipt.
            <br />Reference: <span className="font-mono text-on-stage">{reference}</span>
          </p>
        ) : (
          <p className="max-w-[48ch] text-body-lg text-on-stage-variant">
            We couldn’t confirm this payment yet. If you were charged, keep your Paystack reference{reference ? <> (<span className="font-mono text-on-stage">{reference}</span>)</> : null} and contact us — we’ll sort it out.
          </p>
        )}
        <p className="max-w-[48ch] text-body-md italic text-on-stage-variant">“God loveth a cheerful giver.” — 2 Corinthians 9:7</p>
        <div className="flex flex-wrap justify-center gap-3">
          <LinkButton href="/" tone="stage" variant="filled-inverse">Back to home</LinkButton>
          {!ok && <LinkButton href="/contact" tone="stage" variant="outlined">Contact us</LinkButton>}
        </div>
      </div>
    </section>
  );
}
