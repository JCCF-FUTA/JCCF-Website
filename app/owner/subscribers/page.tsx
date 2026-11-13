import { requireRole, when } from '../guard';

export default async function SubscribersPage() {
  const { sb } = await requireRole(['owner', 'admin']);
  const { data, count } = await sb.from('newsletter_subscribers').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(100);
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-headline-sm font-semibold">Newsletter subscribers <span className="text-on-surface-variant">({count ?? 0})</span></h1>
        <a href="/owner/subscribers/export" className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-label-lg font-semibold text-on-primary">Export CSV</a>
      </div>
      <div className="overflow-x-auto rounded-xl border border-outline-variant bg-surface">
        <table className="w-full text-left text-body-md">
          <thead><tr className="border-b border-outline-variant"><th className="p-3">Email</th><th className="p-3">Source</th><th className="p-3">Joined</th></tr></thead>
          <tbody>
            {data?.map((s) => (
              <tr key={s.id} className="border-b border-outline-variant last:border-0"><td className="p-3">{s.email}</td><td className="p-3">{s.source}</td><td className="p-3">{when(s.created_at)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      {(count ?? 0) > 100 && <p className="mt-3 text-body-sm text-on-surface-variant">Showing the latest 100. The CSV export has everyone.</p>}
    </div>
  );
}
