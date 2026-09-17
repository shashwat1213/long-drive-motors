import type { Metadata } from 'next';
import { Container, Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { JsonLd } from '@/components/seo/JsonLd';
import { autoDealerSchema, breadcrumbSchema, faqSchema } from '@/lib/seo/structured-data';
import { buildMetadata } from '@/lib/seo/metadata';
import { getFaqs } from '@/lib/content';
import { dealership, siteMeta } from '@/config/site';

export const metadata: Metadata = buildMetadata({
  title: 'About Us',
  description:
    'Long Drive Motors is a family-owned Toronto dealership focused on hand-picked, inspected pre-owned vehicles and honest, no-pressure service.',
  path: '/about',
});

const values = [
  { title: 'Hand-picked', body: 'Every vehicle is selected and inspected to a consistent standard.' },
  { title: 'Transparent', body: 'Clear pricing and history — no pressure, no surprises.' },
  { title: 'Family-owned', body: 'We treat every customer the way we’d want to be treated.' },
];

export default async function AboutPage() {
  const faqs = await getFaqs('general');
  const areas = dealership.serviceAreas;

  return (
    <>
      <JsonLd
        data={[
          autoDealerSchema(),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
          faqSchema(faqs),
        ]}
      />

      <PageHeader eyebrow="Our story" title="Built on the long drive" description={dealership.tagline}>
        <div className="flex flex-wrap gap-3">
          <Button href="/inventory">Browse inventory</Button>
          <Button href="/contact" variant="ghost">Visit us</Button>
        </div>
      </PageHeader>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="max-w-prose space-y-5 leading-relaxed text-fog-300">
              <p>
                {siteMeta.name} is a family-owned dealership on Lake Shore Blvd West in Toronto,
                serving {areas.slice(0, -1).join(', ')} and the wider {areas[areas.length - 1]}. We
                believe buying a car should be simple, transparent, and genuinely enjoyable.
              </p>
              <p>
                Every vehicle is hand-picked and inspected before it earns a place on the floor. Our
                team is here to help you find the right fit for your life and budget — with honest
                guidance and none of the pressure you might expect.
              </p>
              <p>
                That same thinking shapes how we built this site. Our immersive showroom lets you
                walk around a vehicle and see it properly before you ever set foot in the door.
              </p>
            </div>

            <ul className="space-y-4">
              {values.map((v, i) => (
                <li key={v.title}>
                  <Reveal delay={i * 0.06}>
                    <div className="rounded-card border border-line bg-ink-800/60 p-6">
                      <h2 className="font-display text-lg text-fog-50">{v.title}</h2>
                      <p className="mt-2 text-sm text-fog-400">{v.body}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>

          {/* Accreditations */}
          <div className="mt-14 flex flex-wrap items-center gap-3">
            {siteMeta.trustBadges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-3 rounded-card border border-line bg-ink-800/60 px-4 py-3"
              >
                <span
                  aria-hidden
                  className="grid h-9 w-9 place-items-center rounded-md bg-ink-700 text-[10px] font-semibold uppercase tracking-wide text-brand-400"
                >
                  {badge.label.slice(0, 2)}
                </span>
                <span>
                  <span className="block text-sm text-fog-100">{badge.label}</span>
                  <span className="block text-xs text-fog-500">{badge.blurb}</span>
                </span>
              </div>
            ))}
          </div>

          {faqs.length > 0 && (
            <div className="mt-16">
              <h2 className="text-display-md">Good to know</h2>
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
