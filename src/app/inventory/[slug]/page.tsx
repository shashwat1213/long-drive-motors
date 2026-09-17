import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema, vehicleSchema } from '@/lib/seo/structured-data';
import { buildMetadata } from '@/lib/seo/metadata';
import { getVehicleBySlug, getVehicleSlugs, getFeaturedVehicles } from '@/lib/content';
import { formatMileage, formatPrice } from '@/lib/utils/format';
import { VehicleGallery } from '@/components/inventory/VehicleGallery';
import { VehicleCard } from '@/components/inventory/VehicleCard';
import { dealership } from '@/config/site';

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getVehicleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) {
    return buildMetadata({
      title: 'Vehicle not found',
      description: 'This vehicle is no longer listed.',
      path: '/inventory/' + slug,
      noindex: true,
    });
  }

  const title = vehicle.year + ' ' + vehicle.make + ' ' + vehicle.model + ' ' + vehicle.trim;
  return buildMetadata({
    title,
    description: vehicle.description,
    path: '/inventory/' + vehicle.slug,
    image: vehicle.images[0]?.src,
  });
}

export default async function VehicleDetailPage({ params }: Params) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const title = vehicle.year + ' ' + vehicle.make + ' ' + vehicle.model;
  const related = (await getFeaturedVehicles(4)).filter((v) => v.slug !== vehicle.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          vehicleSchema(vehicle),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Inventory', path: '/inventory' },
            { name: title, path: '/inventory/' + vehicle.slug },
          ]),
        ]}
      />

      <Section>
        <Container>
          <nav aria-label="Breadcrumb" className="text-sm text-fog-500">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/inventory" className="hover:text-fog-200">
                  Inventory
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-fog-300">{title}</li>
            </ol>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.35fr_1fr]">
            <VehicleGallery images={vehicle.images} title={title} />

            <div>
              <p className="text-xs uppercase tracking-eyebrow text-brand-400">
                {vehicle.condition}
              </p>
              <h1 className="mt-2 text-display-md">{title}</h1>
              <p className="text-fog-400">{vehicle.trim}</p>

              <div className="mt-6 flex items-end gap-4">
                <p className="font-display text-4xl text-white">{formatPrice(vehicle.price)}</p>
                <p className="pb-1.5 text-sm text-fog-500">{formatMileage(vehicle.mileageKm)}</p>
              </div>

              <p className="mt-6 leading-relaxed text-fog-300">{vehicle.description}</p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {vehicle.highlights.map((h) => (
                  <li
                    key={h}
                    className="rounded-pill border border-line bg-ink-800/60 px-3 py-1.5 text-xs text-fog-300"
                  >
                    {h}
                  </li>
                ))}
              </ul>

              {vehicle.colors.length > 0 && (
                <div className="mt-7">
                  <p className="text-xs uppercase tracking-eyebrow text-fog-500">
                    Exterior · {vehicle.exteriorColor}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {vehicle.colors.map((c) => (
                      <li key={c.name} className="flex items-center gap-2 text-xs text-fog-400">
                        <span
                          aria-hidden
                          className="h-6 w-6 rounded-full border border-line-strong"
                          style={{ backgroundColor: c.hex }}
                        />
                        {c.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/test-drive" size="lg">Book a test drive</Button>
                <Button href="/financing" variant="secondary">Estimate financing</Button>
                <Button href={'tel:' + dealership.phoneHref} variant="ghost">
                  Call {dealership.phone}
                </Button>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="mt-16">
            <h2 className="text-display-md">Specifications</h2>
            <dl className="mt-6 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Body', value: vehicle.bodyType },
                { label: 'Fuel', value: vehicle.fuelType },
                { label: 'Transmission', value: vehicle.transmission },
                { label: 'Drivetrain', value: vehicle.drivetrain },
                ...vehicle.specs,
              ].map((spec) => (
                <div key={spec.label} className="bg-ink-800 p-5">
                  <dt className="text-xs uppercase tracking-eyebrow text-fog-500">{spec.label}</dt>
                  <dd className="mt-1.5 text-fog-100">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-display-md">You might also like</h2>
              <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((v) => (
                  <li key={v.slug}>
                    <VehicleCard vehicle={v} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
