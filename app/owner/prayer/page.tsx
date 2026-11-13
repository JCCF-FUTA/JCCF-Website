import { requireRole, when } from '../guard';
import { setPrayed } from '../actions';

export default async function PrayerRequestsPage({ searchParams }: { searchParams: Promise<{ show?: string }> }) {
  const { sb } = await requireRole(['owner']);
  const showAll = (await searchParams).show === 'all';
  let q = sb.from('prayer_requests').select('*').order('created_at', { ascending: false }).limit(200);
  if (!showAll) q = q.eq('prayed_for', false);
  const { data, error } = await q;
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-headline-sm font-semibold">Prayer requests</h1>
        <a href={showAll ? '/owner/prayer' : '/owner/prayer?show=all'} className="text-label-lg font-semibold text-primary">
          {showAll ? 'Show only waiting' : 'Show all, including prayed for'}
        </a>
      </div>
      <p className="mb-6 text-body-md text-on-surface-variant">Visible to the two site owners only. Do not copy requests into email or chats.</p>
      {error && <p className="text-error">Could not load requests.</p>}
      {!data?.length ? (
        <p className="rounded-xl bg-surface p-6 text-body-lg">No requests waiting. 🙏</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {data.map((r) => (
            <li key={r.id} className={`rounded-xl border border-outline-variant bg-surface p-5 ${r.prayed_for ? 'opacity-60' : ''}`}>
              <div className="mb-2 flex flex-wrap gap-x-4 text-body-sm text-on-surface-variant">
                <span>{when(r.created_at)}</span>
                <span>{r.name || 'Anonymous'}</span>
                {r.contact && <span>{r.contact}</span>}
                {r.may_contact && <span className="font-semibold text-primary">May contact</span>}
              </div>
              <p className="whitespace-pre-wrap text-body-lg">{r.request}</p>
              <form action={setPrayed.bind(null, r.id, !r.prayed_for)} className="mt-3">
                <button className="inline-flex h-10 items-center rounded-full border border-outline-variant px-4 text-label-lg font-semibold">
                  {r.prayed_for ? 'Mark as waiting' : 'Mark as prayed for'}
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
