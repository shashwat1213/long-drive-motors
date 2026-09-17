import type { Metadata } from 'next';
import { Container, Section, SectionHeading } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { JsonLd } from '@/components/seo/JsonLd';
import { autoDealerSchema, organizationSchema } from '@/lib/seo/structured-data';
import { buildMetadata } from '@/lib/seo/metadata';
import { getFeaturedVehicles, getInventoryFacets } from '@/lib/content';
import { siteMeta } from '@/config/site';
import { HeroExperience } from '@/three/hero/HeroExperience';
import { QuickSearch } from '@/components/sections/QuickSearch';
import { VehicleCard } from '@/components/inventory/VehicleCard';

export const metadata: Metadata = buildMetadata({
  title: 'Long Drive Motors | Pre-Owned Vehicles in Toronto',
  absoluteTitle: true,
  description:
    'Explore hand-picked, inspected pre-owned vehicles in an immersive 3D showroom. Serving Toronto, Etobicoke, Mississauga, Brampton, Oakville and the GTA.',
  path: '/',
});

const experiences = [
  {
    title: 'Immersive Showroom',
    body: 'Walk a cinematic 3D space and step up to any vehicle, from any angle.',
    href: '/showroom',
    cta: 'Enter showroom',
  },
  {
    title: 'Financing, Simplified',
    body: 'Estimate payments and explore options with clarity and no pressure.',
    href: '/financing',
    cta: 'Explore financing',
  },
  {
    title: 'Trade-In & Test Drive',
    body: 'Value your current car and book a drive without the friction.',
    href: '/trade-in',
    cta: 'Value my car',
  },
];

const reasons = [
  { title: 'Hand-picked vehicles', body: 'Every vehicle is selected to a consistent standard for quality and value.' },
  { title: 'Inspected pre-owned', body: 'Thoroughly inspected before it earns a place on our floor.' },
  { title: 'No-pressure experience', body: 'Honest guidance, on your timeline — never a hard sell.' },
  { title: 'Transparent buying', body: 'Clear pricing and history so you can buy with confidence.' },
];

export default async function HomePage() {
  const [featured, facets] = await Promise.all([
    getFeaturedVehicles(6),
    getInventoryFacets(),
  ]);

  return (
    <>
      <JsonLd data={[organizationSchema(), autoDealerSchema()]} />

      {/* Cinematic 3D hero */}
      <HeroExperience />

      {/* Quick inventory search */}
      <Section className="border-t border-line">
        <Container>
          <SectionHeading
            eyebrow="Start here"
            title="Find your next drive"
            description="Narrow the lineup by make, body style, year, and budget."
          />
          <div className="mt-10">
            <QuickSearch
              makes={facets.makes}
              bodyTypes={facets.bodyTypes}
              years={facets.years}
              priceMax={facets.priceRange.max}
            />
          </div>
        </Container>
      </Section>

      {/* Featured inventory */}
      <Section className="border-t border-line">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Featured" title="This week on the floor" />
            <Reveal>
              <Button href="/inventory" variant="secondary">
                View all inventory
              </Button>
            </Reveal>
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((vehicle, i) => (
              <li key={vehicle.slug}>
                <Reveal delay={(i % 3) * 0.06} className="h-full">
                  <VehicleCard vehicle={vehicle} priority={i < 3} />
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 3D experience rails */}
      <Section className="border-t border-line">
        <Container>
          <SectionHeading eyebrow="The experience" title="Built to be explored" align="center" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {experiences.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06} className="h-full">
                <div className="group flex h-full flex-col rounded-card border border-line bg-ink-800/60 p-7 transition-colors duration-fast hover:border-line-strong">
                  <h3 className="font-display text-xl text-fog-50">{item.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-fog-400">{item.body}</p>
                  <a
                    href={item.href}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm text-brand-400 transition-colors group-hover:text-brand-300"
                  >
                    {item.cta}
                    <span aria-hidden className="transition-transform duration-fast group-hover:translate-x-0.5">→</span>
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Why Long Drive Motors */}
      <Section className="border-t border-line">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <SectionHeading
              eyebrow="Why Long Drive Motors"
              title="A better way to buy pre-owned"
              description="Family-owned and rooted in Toronto — here to make buying a car simple, transparent, and genuinely enjoyable."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {reasons.map((r, i) => (
                <Reveal key={r.title} delay={i * 0.05} className="h-full">
                  <div className="h-full rounded-card border border-line bg-ink-800/60 p-6">
                    <h3 className="font-display text-lg text-fog-50">{r.title}</h3>
                    <p className="mt-2 text-sm text-fog-400">{r.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Trust badges */}
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
        </Container>
      </Section>

      {/* Final CTA */}
      <Section className="border-t border-line">
        <Container>
          <div className="relative overflow-hidden rounded-card border border-line bg-ink-800/60 px-gutter py-16 text-center sm:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: 'radial-gradient(60% 120% at 50% 0%, rgba(225,29,42,0.16), transparent 60%)' }}
            />
            <div className="relative">
              <Reveal>
                <h2 className="text-display-lg">Ready for your next drive?</h2>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="mx-auto mt-4 max-w-prose text-fog-300">
                  Browse the full lineup or book a test drive at our Toronto showroom.
                </p>
              </Reveal>
              <Reveal delay={0.16}>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button href="/inventory" size="lg">Explore Inventory</Button>
                  <Button href="/test-drive" variant="ghost" size="lg">Book a Test Drive</Button>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
