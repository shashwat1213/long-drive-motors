import type { Metadata } from 'next';
import { Container, Section, SectionHeading } from '@/components/ui/Section';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/seo/structured-data';
import { buildMetadata } from '@/lib/seo/metadata';
import { getShowroomVehicles } from '@/lib/content';
import { formatPrice } from '@/lib/utils/format';
import { ShowroomPreview } from '@/three/hero/ShowroomPreview';

export const metadata: Metadata = buildMetadata({
  title: 'Immersive 3D Showroom',
  description:
    'Step into an immersive 3D showroom and explore hand-picked vehicles up close — a cinematic way to browse the Long Drive Motors lineup.',
  path: '/showroom',
});

const zones = [
  { title: 'Entrance', body: 'Arrive into a cinematic, light-filled studio space.' },
  { title: 'Vehicle stations', body: 'Step up to featured vehicles and view every angle.' },
  { title: 'Finance desk', body: 'Estimate payments and options right where you stand.' },
  { title: 'Trade-in & test drive', body: 'Value your car or book a drive without leaving the floor.' },
];

export default async function ShowroomPage() {
  const vehicles = await getShowroomVehicles();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Showroom', path: '/showroom' },
        ])}
      />

      <PageHeader
        eyebrow="Immersive experience"
        title="The 3D showroom"
        description="A cinematic, explorable space that makes browsing feel like walking the floor — from the comfort of anywhere."
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/inventory">Browse the lineup</Button>
          <Button href="/test-drive" variant="ghost">Book a test drive</Button>
        </div>
      </PageHeader>

      <Section>
        <Container>
          <Reveal>
            <ShowroomPreview />
          </Reveal>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-prose text-sm text-fog-400">
              Fully walkable exploration — move through the space, step up to any vehicle, and open
              details on the spot — is coming to the showroom next. The lineup below is always
              available to browse.
            </p>
            <span className="rounded-pill border border-line px-4 py-2 text-xs uppercase tracking-eyebrow text-fog-400">
              Walkable exploration · Coming soon
            </span>
          </div>
        </Container>
      </Section>

      {/* Zones */}
      <Section className="border-t border-line">
        <Container>
          <SectionHeading eyebrow="Inside the space" title="What you’ll find" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {zones.map((zone, i) => (
              <Reveal key={zone.title} delay={i * 0.06} className="h-full">
                <div className="h-full rounded-card border border-line bg-ink-800/60 p-6">
                  <h3 className="font-display text-lg text-fog-50">{zone.title}</h3>
                  <p className="mt-2 text-sm text-fog-400">{zone.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Vehicles on the floor (crawlable HTML — never canvas-only) */}
      <Section className="border-t border-line">
        <Container>
          <SectionHeading eyebrow="On the floor" title="Featured vehicles" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((v, i) => (
              <li key={v.slug}>
                <Reveal delay={(i % 3) * 0.05} className="h-full">
                  <a
                    href={'/inventory/' + v.slug}
                    className="flex h-full items-center justify-between rounded-card border border-line bg-ink-800/60 p-5 transition-colors hover:border-line-strong"
                  >
                    <span>
                      <span className="block font-display text-lg text-fog-50">
                        {v.year} {v.make} {v.model}
                      </span>
                      <span className="block text-sm text-fog-400">{v.bodyType}</span>
                    </span>
                    <span className="font-display text-white">{formatPrice(v.price)}</span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
