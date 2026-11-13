import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getStaff } from '@/lib/supabase/server';
import { integrations } from '@/lib/site';
import { Icon } from '@/components/ui/Icon';

export default async function OwnerHome() {
  if (!integrations.supabaseAuth) return <p className="text-body-lg">Supabase is not configured yet. See the README.</p>;
  const staff = await getStaff();
  if (!staff) redirect('/owner/login');
  if (!staff.role) {
    return <p className="max-w-prose text-body-lg">You are signed in as {staff.user.email}, but this account has no site role yet. Ask a site owner to add you.</p>;
  }
  const cards = [
    { href: '/owner/prayer', icon: 'favorite', title: 'Prayer requests', text: 'Read requests and mark them as prayed for.', show: staff.role === 'owner' },
    { href: '/owner/messages', icon: 'mail', title: 'Contact messages', text: 'Messages sent through the contact form.', show: staff.role !== 'treasurer' },
    { href: '/owner/subscribers', icon: 'groups', title: 'Newsletter subscribers', text: 'See and export subscribers as CSV.', show: staff.role !== 'treasurer' },
    { href: '/owner/payments', icon: 'payments', title: 'Payments', text: 'Paystack gifts recorded by the webhook.', show: staff.role !== 'admin' },
    { href: '/studio', icon: 'article', title: 'Content studio', text: 'Programmes, fellowships, news, leaders and settings.', show: staff.role !== 'treasurer' },
  ].filter((c) => c.show);
  return (
    <div>
      <h1 className="mb-6 text-headline-sm font-semibold">Welcome</h1>
      <ul className="grid gap-4 medium:grid-cols-2 expanded:grid-cols-3">
        {cards.map((c) => (
          <li key={c.href}>
            <Link href={c.href} className="flex h-full flex-col gap-2 rounded-xl border border-outline-variant bg-surface p-5 hover:bg-surface-container">
              <Icon name={c.icon} className="text-primary" />
              <span className="text-title-md font-semibold">{c.title}</span>
              <span className="text-body-md text-on-surface-variant">{c.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
