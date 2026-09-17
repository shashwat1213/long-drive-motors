import type { Metadata } from 'next';
import { Container, Section, SectionHeading } from '@/components/ui/Section';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema, faqSchema } from '@/lib/seo/structured-data';
import { buildMetadata } from '@/lib/seo/metadata';
import { getFaqs, getFinancingPlanExamples, getInventoryFacets } from '@/lib/content';
import { PaymentCalculator } from '@/components/forms/PaymentCalculator';
import { dealership } from '@/config/site';

export const metadata: Metadata = buildMetadata({
  title: 'Financing',
  description:
    'Estimate your monthly payment and explore financing options at Long Drive Motors in Toronto. We work with a wide range of credit situations.',
  path: '/financing',
});

export default async function FinancingPage() {
  const [plans, faqs, facets] = await Promise.all([
    getFinancingPlanExamples(),
    getFaqs('financing'),
    getInventoryFacets(),
  ]);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Financing', path: '/financing' },
          ]),
          faqSchema(faqs),
        ]}
      />

      <PageHeader
        eyebrow="Financing"
        title="Shop with confidence"
        description="Know your numbers before you visit. Move the sliders to see how price, down payment, and term shape your monthly cost."
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/inventory">Browse inventory</Button>
          <Button href={'tel:' + dealership.phoneHref} variant="ghost">
            Talk to our finance team
          </Button>
        </div>
      </PageHeader>

      <Section>
        <Container>
          <PaymentCalculator
            defaultPrice={Math.round((facets.priceRange.min + facets.priceRange.max) / 2)}
            maxPrice={facets.priceRange.max}
          />

          <div className="mt-14">
            <SectionHeading eyebrow="Example structures" title="Ways to structure your loan" />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {plans.map((plan, i) => (
                <Reveal key={plan.id} delay={i * 0.06} className="h-full">
                  <div className="h-full rounded-card border border-line bg-ink-800/60 p-7">
                    <p className="text-xs uppercase tracking-eyebrow text-brand-400">{plan.label}</p>
                    <p className="mt-4 font-display text-3xl text-white">{plan.aprPercent}%</p>
                    <p className="text-sm text-fog-500">APR · {plan.termMonths} months</p>
                    <p className="mt-4 text-sm leading-relaxed text-fog-400">{plan.note}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="mt-6 text-xs text-fog-500">
              Rates shown are illustrative examples, not credit offers. Your actual rate depends on
              credit approval, term, and the vehicle selected.
            </p>
          </div>

          {faqs.length > 0 && (
            <div className="mt-16">
              <h2 className="text-display-md">Financing questions</h2>
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
