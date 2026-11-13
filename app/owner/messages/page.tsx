import { requireRole, when } from '../guard';
import { setHandled } from '../actions';

export default async function MessagesPage() {
  const { sb } = await requireRole(['owner', 'admin']);
  const { data } = await sb.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(200);
  return (
    <div>
      <h1 className="mb-6 text-headline-sm font-semibold">Contact messages</h1>
      {!data?.length ? <p className="rounded-xl bg-surface p-6 text-body-lg">No messages yet.</p> : (
        <ul className="flex flex-col gap-3">
          {data.map((m) => (
            <li key={m.id} className={`rounded-xl border border-outline-variant bg-surface p-5 ${m.handled ? 'opacity-60' : ''}`}>
              <div className="mb-1 flex flex-wrap gap-x-4 text-body-sm text-on-surface-variant">
                <span>{when(m.created_at)}</span><span className="font-semibold text-on-surface">{m.subject}</span>
              </div>
              <p className="text-title-sm font-semibold">{m.name} · <a className="text-primary" href={/@/.test(m.contact) ? `mailto:${m.contact}` : `tel:${m.contact}`}>{m.contact}</a></p>
              <p className="mt-2 whitespace-pre-wrap text-body-lg">{m.message}</p>
              <form action={setHandled.bind(null, m.id, !m.handled)} className="mt-3">
                <button className="inline-flex h-10 items-center rounded-full border border-outline-variant px-4 text-label-lg font-semibold">{m.handled ? 'Mark as open' : 'Mark as handled'}</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
