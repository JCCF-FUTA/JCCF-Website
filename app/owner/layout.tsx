import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getStaff } from '@/lib/supabase/server';
import { Icon } from '@/components/ui/Icon';
import { signOut } from './actions';

export const metadata: Metadata = { title: 'Owner area', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

/** Plain, functional layout for staff pages (DESIGN §12 Owner pages): no marketing motion. */
export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  const staff = await getStaff();
  const role = staff?.role;
  const links = [
    { href: '/owner/prayer', label: 'Prayer requests', icon: 'favorite', show: role === 'owner' },
    { href: '/owner/messages', label: 'Messages', icon: 'mail', show: role === 'owner' || role === 'admin' },
    { href: '/owner/subscribers', label: 'Subscribers', icon: 'groups', show: role === 'owner' || role === 'admin' },
    { href: '/owner/payments', label: 'Payments', icon: 'payments', show: role === 'owner' || role === 'treasurer' },
  ].filter((l) => l.show);
  return (
    <div className="min-h-svh bg-surface-container-low">
      <header className="border-b border-outline-variant bg-surface">
        <div className="container-page flex h-16 items-center gap-3">
          <Link href="/owner" className="mr-auto flex items-center gap-2 font-semibold">
            <Image src="/brand/jccf-logo-160.webp" alt="" width={32} height={32} /> JCCF FUTA · Staff
          </Link>
          {staff && (
            <>
              <span className="hidden text-body-sm text-on-surface-variant medium:inline">{staff.user.email} · {role ?? 'no role'}</span>
              <Link href="/studio" className="inline-flex h-10 items-center rounded-full px-4 text-label-lg font-semibold text-primary">Studio</Link>
              <form action={signOut}>
                <button className="inline-flex h-10 items-center gap-1 rounded-full border border-outline-variant px-4 text-label-lg font-semibold"><Icon name="logout" size={20} /> Sign out</button>
              </form>
            </>
          )}
        </div>
        {links.length > 0 && (
          <nav aria-label="Staff" className="container-page flex gap-1 overflow-x-auto pb-2">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-label-lg font-semibold hover:bg-surface-container">
                <Icon name={l.icon} size={20} /> {l.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main className="container-page py-8">{children}</main>
    </div>
  );
}
