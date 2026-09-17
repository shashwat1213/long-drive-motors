import type { Metadata } from 'next';
import { Container, Section, SectionHeading } from '@/components/ui/Section';
import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema, faqSchema } from '@/lib/seo/structured-data';
import { buildMetadata } from '@/lib/seo/metadata';
import { getFaqs } from '@/lib/content';
import { BookingForm, type BookingField } from '@/components/forms/BookingForm';

export const metadata: Metadata = buildMetadata({
  title: 'Trade-In & Sell',
  description:
    'Value your vehicle for a trade-in or sell it to Long Drive Motors outright. Share a few details to start your appraisal.',
  path: '/trade-in',
});

const paths = [
  {
    title: 'Trade in toward your next vehicle',
    body: 'Apply your vehicle’s value directly to something new from our inventory.',
  },
  {
    title: 'Sell us your car',
    body: 'Not buying right now? We’ll still make an offer on your vehicle.',
  },
];

const steps = [
  { n: '01', title: 'Share the details', body: 'Tell us the year, make, model, and condition.' },
  { n: '02', title: 'Get an estimate', body: 'We’ll come back with an estimated range.' },
  { n: '03', title: 'Confirm in person', body: 'A quick look confirms the final number.' },
];

const currentYear = new Date().getFullYear();

export default async function TradeInPage() {
  const faqs = await getFaqs('trade-in');

  const fields: BookingField[] = [
    { name: 'year', label: 'Year', type: 'select', required: true, half: true,
      options: Array.from({ length: 20 }, (_, i) => String(currentYear - i)).map((y) => ({ label: y, value: y })) },
    { name: 'make', label: 'Make', type: 'text', required: true, half: true, placeholder: 'e.g. Aurora' },
    { name: 'model', label: 'Model', type: 'text', required: true, half: true, placeholder: 'e.g. GT' },
    { name: 'mileage', label: 'Mileage (km)', type: 'number', required: true, half: true, placeholder: '85000' },
    { name: 'condition', label: 'Condition', type: 'select', required: true, half: true,
      options: ['Excellent', 'Good', 'Fair', 'Needs work'].map((c) => ({ label: c, value: c })) },
    { name: 'intent', label: 'I want to', type: 'select', required: true, half: true,
      options: [
        { label: 'Trade in toward another vehicle', value: 'trade' },
        { label: 'Sell outright', value: 'sell' },
      ] },
    { name: 'name', label: 'Full name', type: 'text', required: true, half: true, placeholder: 'Your name' },
    { name: 'phone', label: 'Phone', type: 'tel', required: true, half: true, placeholder: '(416) 000-0000' },
    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'you@example.com' },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Trade-In & Sell', path: '/trade-in' },
          ]),
          faqSchema(faqs),
        ]}
      />

      <PageHeader
        eyebrow="Trade-in & sell"
        title="Two ways to move on from your car"
        description="Whether you’re upgrading or simply selling, it starts the same way — a few details and an honest number."
      />

      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {paths.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06} className="h-full">
                <div className="h-full rounded-card border border-line bg-ink-800/60 p-7">
                  <h2 className="font-display text-xl text-fog-50">{p.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-fog-400">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <SectionHeading eyebrow="How it works" title="Three simple steps" />
              <ol className="mt-8 space-y-5">
                {steps.map((s) => (
                  <li key={s.n} className="flex gap-4">
                    <span className="font-display text-sm text-brand-400">{s.n}</span>
                    <span>
                      <span className="block font-display text-lg text-fog-50">{s.title}</span>
                      <span className="block text-sm text-fog-400">{s.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-card border border-line bg-ink-800/60 p-7">
              <h2 className="font-display text-xl text-fog-50">Start your appraisal</h2>
              <p className="mt-1.5 text-sm text-fog-400">
                Share a few details and we’ll follow up with an estimated range.
              </p>
              <div className="mt-6">
                <BookingForm
                  fields={fields}
                  submitLabel="Request My Estimate"
                  successTitle="Appraisal request received"
                  successBody="We’ll review the details and get back to you with an estimated range shortly."
                />
              </div>
              <p className="mt-4 text-xs text-fog-500">
                Estimates are subject to an in-person inspection.
              </p>
            </div>
          </div>

          {faqs.length > 0 && (
            <div className="mt-16">
              <h2 className="text-display-md">Trade-in questions</h2>
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
