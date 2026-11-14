import type { Metadata } from 'next';
import { PrayerForm } from '@/components/forms/PrayerForm';
import { Icon } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';

export const metadata: Metadata = {
  title: 'Prayer request',
  description: 'Send a private prayer request to JCCF FUTA. Only the PRO and General Secretary can read it.',
};

export default function PrayerPage() {
  return (
    <>
      <PageHero crumb="Prayer request" compact title="Send a prayer request" intro="“The effectual fervent prayer of a righteous man availeth much” (James 5:16)." />
      <section className="section">
        <div className="container-page grid gap-10 expanded:grid-cols-12">
          <aside className="expanded:col-span-4">
            <div className="flex flex-col gap-4 rounded-2xl bg-primary-container p-6 text-on-primary-container expanded:sticky expanded:top-24" data-reveal="up">
              <h2 className="flex items-center gap-2 text-title-lg font-semibold"><Icon name="lock" size={24} /> Only two people can read it</h2>
              <p className="text-body-lg">The JCCF PRO and General Secretary. Your request is never published, shared with other admins or sent by email.</p>
              <p className="text-body-lg">Your name and contact are optional. Leave them blank to stay anonymous.</p>
            </div>
          </aside>
          <div className="expanded:col-span-8" data-reveal="up">
            <PrayerForm />
          </div>
        </div>
      </section>
    </>
  );
}
