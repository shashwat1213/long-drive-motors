import type { Metadata } from 'next';
import { Container, Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/seo/structured-data';
import { buildMetadata } from '@/lib/seo/metadata';
import { getAllVehicles, getInventoryFacets } from '@/lib/content';
import { formatPrice } from '@/lib/utils/format';
import { VehicleCard } from '@/components/inventory/VehicleCard';

export const metadata: Metadata = buildMetadata({
  title: 'Inventory',
  description:
    'Browse hand-picked pre-owned vehicles at Long Drive Motors in Toronto — sedans, SUVs, coupes, trucks and more, each inspected before it hits the floor.',
  path: '/inventory',
});

export default async function InventoryPage() {
  const [vehicles, facets] = await Promise.all([getAllVehicles(), getInventoryFacets()]);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Inventory', path: '/inventory' },
        ])}
      />

      <PageHeader
        eyebrow="Inventory"
        title="Find your next vehicle"
        description="Every vehicle on this page is hand-picked and inspected. Take a closer look, then book a drive."
      >
        <Button href="/test-drive" variant="ghost">
          Book a test drive
        </Button>
      </PageHeader>

      <Section>
        <Container>
          <div className="flex flex-wrap gap-2 text-xs text-fog-400">
            <span className="rounded-pill border border-line bg-ink-800/60 px-3 py-1.5">
              {vehicles.length} vehicles available
            </span>
            <span className="rounded-pill border border-line bg-ink-800/60 px-3 py-1.5">
              {facets.bodyTypes.join(' · ')}
            </span>
            <span className="rounded-pill border border-line bg-ink-800/60 px-3 py-1.5">
              From {formatPrice(facets.priceRange.min)}
            </span>
          </div>

          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle, i) => (
              <li key={vehicle.slug}>
                <Reveal delay={(i % 3) * 0.05} className="h-full">
                  <VehicleCard vehicle={vehicle} priority={i < 3} />
                </Reveal>
              </li>
            ))}
          </ul>

          <div className="mt-16 flex flex-col items-center gap-4 rounded-card border border-line bg-ink-800/60 px-gutter py-12 text-center">
            <h2 className="text-display-md">Not seeing the right fit?</h2>
            <p className="max-w-prose text-fog-300">
              Tell us what you’re after and we’ll keep an eye out as new vehicles arrive.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <Button href="/contact" size="lg">Get in touch</Button>
              <Button href="/trade-in" variant="ghost" size="lg">Value your trade-in</Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
