import { ImageResponse } from 'next/og';
import { getVehicleBySlug, getVehicleSlugs } from '@/lib/content';
import { formatMileage, formatPrice } from '@/lib/utils/format';
import { siteMeta } from '@/config/site';

/**
 * Per-vehicle social card.
 *
 * The listing photographs are placeholder SVGs, which no social platform will
 * render, so a shared vehicle link previously showed no image at all. This
 * renders the listing's actual facts — year, model, price, mileage — as a PNG.
 * Once real photography replaces the placeholders, pass it through
 * `buildMetadata({ image })` on the page and it will take precedence over this.
 */

export const alt = 'Vehicle listing at Long Drive Motors';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
  const slugs = await getVehicleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function VehicleOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);

  const headline = vehicle
    ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
    : siteMeta.name;
  const subline = vehicle ? `${vehicle.trim} · ${vehicle.bodyType}` : 'Pre-owned vehicles';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          backgroundColor: '#0A0B0D',
          backgroundImage:
            'radial-gradient(900px 500px at 80% 0%, rgba(225,29,42,0.20), rgba(10,11,13,0) 70%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 24,
            letterSpacing: 9,
            color: '#E11D2A',
          }}
        >
          {siteMeta.name.toUpperCase()}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 30, color: '#8B8E96' }}>{subline}</div>
          <div
            style={{
              display: 'flex',
              marginTop: 14,
              fontSize: 76,
              letterSpacing: -2,
              color: '#F7F7F8',
            }}
          >
            {headline}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 22, letterSpacing: 4, color: '#63666E' }}>PRICE</span>
            <span style={{ fontSize: 56, color: '#F7F7F8', marginTop: 8 }}>
              {vehicle ? formatPrice(vehicle.price) : '—'}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 22, letterSpacing: 4, color: '#63666E' }}>ODOMETER</span>
            <span style={{ fontSize: 56, color: '#F7F7F8', marginTop: 8 }}>
              {vehicle ? formatMileage(vehicle.mileageKm) : '—'}
            </span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
