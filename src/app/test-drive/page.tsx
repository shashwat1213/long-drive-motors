import type { Metadata } from 'next';
import { Container, Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/layout/PageHeader';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema, faqSchema } from '@/lib/seo/structured-data';
import { buildMetadata } from '@/lib/seo/metadata';
import { getAllVehicles, getFaqs } from '@/lib/content';
import { BookingForm, type BookingField } from '@/components/forms/BookingForm';
import { dealership } from '@/config/site';

export const metadata: Metadata = buildMetadata({
  title: 'Book a Test Drive',
  description:
    'Pick a vehicle and a time that suits you and take it for a drive at Long Drive Motors, 3725 Lake Shore Blvd W, Toronto.',
  path: '/test-drive',
});

export default async function TestDrivePage() {
  const [vehicles, faqs] = await Promise.all([getAllVehicles(), getFaqs('test-drive')]);

  const fields: BookingField[] = [
    { name: 'vehicle', label: 'Vehicle', type: 'select', required: true, placeholder: 'Choose a vehicle',
      options: vehicles.map((v) => ({ label: v.year + ' ' + v.make + ' ' + v.model, value: v.slug })) },
    { name: 'date', label: 'Preferred date', type: 'date', required: true, half: true },
    { name: 'time', label: 'Preferred time', type: 'select', required: true, half: true,
      options: ['Morning', 'Afternoon', 'Evening'].map((t) => ({ label: t, value: t })) },
    { name: 'name', label: 'Full name', type: 'text', required: true, half: true, placeholder: 'Your name' },
    { name: 'phone', label: 'Phone', type: 'tel', required: true, half: true, placeholder: '(416) 000-0000' },
    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'you@example.com' },
    { name: 'notes', label: 'Anything we should know?', type: 'textarea', placeholder: 'Optional' },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Book a Test Drive', path: '/test-drive' },
          ]),
          faqSchema(faqs),
        ]}
      />

      <PageHeader
        eyebrow="Test drive"
        title="Feel it on the road"
        description="The best way to know is to drive. Choose a vehicle and a time, and we’ll have it ready when you arrive."
      />

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-card border border-line bg-ink-800/60 p-7">
              <h2 className="font-display text-xl text-fog-50">Request your drive</h2>
              <p className="mt-1.5 text-sm text-fog-400">
                We’ll confirm your appointment by phone or email.
              </p>
              <div className="mt-6">
                <BookingForm
                  fields={fields}
                  submitLabel="Request Test Drive"
                  successTitle="Your test drive is requested"
                  successBody="We’ve got your details and will confirm your appointment shortly."
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-card border border-line bg-ink-800/60 p-7">
                <h2 className="text-xs uppercase tracking-eyebrow text-fog-500">Where to find us</h2>
                <address className="mt-3 not-italic leading-relaxed text-fog-300">
                  {dealership.address.street}
                  <br />
                  {dealership.address.city}, {dealership.address.region}{' '}
                  {dealership.address.postalCode}
                </address>
                <p className="mt-4">
                  <a
                    href={'tel:' + dealership.phoneHref}
                    className="font-display text-lg text-fog-50 hover:text-brand-400"
                  >
                    {dealership.phone}
                  </a>
                </p>
              </div>

              <div className="rounded-card border border-line bg-ink-800/60 p-7">
                <h2 className="text-xs uppercase tracking-eyebrow text-fog-500">What to bring</h2>
                <ul className="mt-4 space-y-2 text-sm text-fog-300">
                  <li>A valid driver’s licence</li>
                  <li>Proof of insurance, if you have it</li>
                  <li>Your trade-in, if you’d like it appraised</li>
                </ul>
              </div>
            </div>
          </div>

          {faqs.length > 0 && (
            <div className="mt-16">
              <h2 className="text-display-md">Test-drive questions</h2>
              <dl className="mt-6 divide-y divide-line border-y border-line">
                {faqs.map((f) => (
                  <div key={f.question} className="py-6">
                    <dt className="font-display text-lg text-fog-50">{f.question}</dt>
                    <dd className="mt-2 text-fog-400">{f.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
