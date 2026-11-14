import type { Metadata } from 'next';
import { getGiveSettings } from '@/lib/data';
import { integrations } from '@/lib/site';
import { BankCard } from '@/components/give/BankCard';
import { GiveForm } from '@/components/give/GiveForm';
import { Accordion } from '@/components/ui/Accordion';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Give',
  description: 'Give to the JCCF FUTA Household by card, transfer or USSD with Paystack, or by bank transfer to the official account.',
};

export default async function GivePage() {
  const give = await getGiveSettings();
  return (
    <>
      <PageHero crumb="Give" compact title="Give to the Household" intro="“Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver” (2 Corinthians 9:7)." />

      <section aria-label="Give" className="section">
        <div className="container-page grid gap-6 expanded:grid-cols-12">
          <div className="expanded:col-span-7" data-reveal="up">
            <GiveForm give={give} enabled={integrations.paystack} headingLevel="h2" title="Give online" />
          </div>
          <div className="expanded:col-span-5" data-reveal="up">
            <BankCard give={give} className="expanded:sticky expanded:top-24" />
          </div>
        </div>
      </section>

      <section aria-labelledby="where-title" className="section bg-surface-container-low">
        <div className="container-page grid gap-10 expanded:grid-cols-12">
          <div className="expanded:col-span-4">
            <SectionHeader id="where-title" title="Where your giving goes" className="mb-0" />
          </div>
          <dl className="divide-y divide-outline-variant border-y border-outline-variant expanded:col-span-8">
            {[
              { title: 'Household programmes', text: 'Combined services, the Week of Prayers and Teaching Week: venues, sound, publicity and guest ministers.' },
              { title: 'Welfare', text: 'Care for Christians on campus, including the academic, social and spiritual needs of students (constitution, Article 2).' },
              { title: 'Outreach', text: 'Evangelism on campus and beyond, and support for the units that serve every programme.' },
            ].map((t) => (
              <div key={t.title} className="grid gap-1 py-5 medium:grid-cols-[14rem_1fr] medium:gap-6" data-reveal="up">
                <dt className="text-title-md font-semibold">{t.title}</dt>
                <dd className="text-body-lg text-on-surface-variant">{t.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="section">
        <div className="container-page grid gap-10 expanded:grid-cols-12">
          <div className="expanded:col-span-4">
            <SectionHeader id="faq-title" title="Questions about giving" className="mb-0" />
          </div>
          <div className="expanded:col-span-8">
            <Accordion
              items={[
                { q: 'Will I get a receipt?', a: 'Yes. Paystack emails a receipt to the address you enter as soon as your payment succeeds. Every gift is also recorded for the Treasurer and the semester audit.' },
                { q: 'Is it safe to pay online?', a: 'Payments are processed by Paystack, a licensed Nigerian payment company. Your card details go straight to Paystack. JCCF never sees or stores them.' },
                { q: 'Which payment methods can I use?', a: 'Card, bank transfer and USSD through Paystack, or a direct transfer to the official JCCF account shown on this page.' },
                { q: 'What if I made a mistake?', a: 'Contact the Household through the contact page with your Paystack reference. The Financial Secretary/Treasurer will help with refunds where appropriate.' },
                { q: 'Can I give towards a specific programme?', a: 'Yes. Choose “Programme/Project” and pick the programme or project. Admins open and close these funds as needed.' },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
