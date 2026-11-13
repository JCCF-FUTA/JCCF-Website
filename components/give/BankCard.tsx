'use client';

import { cn } from '@/lib/cn';
import type { GiveSettings } from '@/lib/types';
import { Icon } from '@/components/ui/Icon';
import { showSnackbar } from '@/components/ui/Snackbar';

/** Bank transfer details with a copy button (DESIGN §C17, PRD F5). */
export function BankCard({ give, className }: { give: GiveSettings; className?: string }) {
  const copy = async () => {
    if (!give.accountNumber) return;
    try {
      await navigator.clipboard.writeText(give.accountNumber);
      showSnackbar('Account number copied');
    } catch {
      showSnackbar(`Account number: ${give.accountNumber}`);
    }
  };
  return (
    <div className={cn('flex flex-col gap-5 rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 text-on-surface expanded:p-8', className)}>
      <div className="flex items-center gap-3">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary-container text-on-primary-container"><Icon name="account_balance" /></span>
        <div>
          <h3 className="text-title-lg font-semibold">Bank transfer</h3>
          <p className="text-body-md text-on-surface-variant">Prefer your bank app or the bank hall?</p>
        </div>
      </div>
      {give.accountNumber ? (
        <dl className="flex flex-col gap-4">
          <div>
            <dt className="text-label-md font-semibold uppercase text-on-surface-variant">Bank</dt>
            <dd className="text-title-md font-semibold">{give.bankName}</dd>
          </div>
          <div>
            <dt className="text-label-md font-semibold uppercase text-on-surface-variant">Account name</dt>
            <dd className="text-title-md font-semibold">{give.accountName}</dd>
          </div>
          <div>
            <dt className="text-label-md font-semibold uppercase text-on-surface-variant">Account number</dt>
            <dd className="flex items-center gap-2">
              <span className="text-title-lg font-semibold tracking-wider tabular-nums">{give.accountNumber}</span>
              <button type="button" onClick={copy} className="state-layer inline-flex size-12 items-center justify-center rounded-full text-primary" aria-label="Copy account number">
                <Icon name="content_copy" />
              </button>
            </dd>
          </div>
        </dl>
      ) : (
        <p className="rounded-md bg-surface-container p-4 text-body-md text-on-surface-variant">
          The official JCCF account details will appear here once confirmed by the Financial Secretary/Treasurer.
        </p>
      )}
      <p className="text-body-sm text-on-surface-variant">Use your name and the purpose (e.g. “Offering”) as the transfer narration.</p>
    </div>
  );
}
