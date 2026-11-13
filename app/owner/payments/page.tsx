import { naira } from '@/lib/format';
import { requireRole, when } from '../guard';

export default async function PaymentsPage() {
  const { sb } = await requireRole(['owner', 'treasurer']);
  const { data } = await sb.from('payments').select('*').order('paid_at', { ascending: false }).limit(300);
  const total = data?.reduce((s, p) => s + p.amount_kobo, 0) ?? 0;
  return (
    <div>
      <h1 className="text-headline-sm font-semibold">Payments</h1>
      <p className="mb-6 text-body-md text-on-surface-variant">Recorded automatically from Paystack. Latest {data?.length ?? 0} · total {naira(total / 100)}. The Paystack dashboard is the source of truth for the audit.</p>
      <div className="overflow-x-auto rounded-xl border border-outline-variant bg-surface">
        <table className="w-full text-left text-body-md">
          <thead><tr className="border-b border-outline-variant">{['Date', 'Amount', 'Category', 'Giver', 'Channel', 'Reference'].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody>
            {data?.map((p) => (
              <tr key={p.id} className="border-b border-outline-variant last:border-0">
                <td className="p-3 whitespace-nowrap">{when(p.paid_at)}</td>
                <td className="p-3 tabular-nums">{naira(p.amount_kobo / 100)}</td>
                <td className="p-3">{p.category_label}</td>
                <td className="p-3">{p.giver_name}<br /><span className="text-on-surface-variant">{p.giver_email}</span></td>
                <td className="p-3">{p.channel}</td>
                <td className="p-3 font-mono text-body-sm">{p.reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
