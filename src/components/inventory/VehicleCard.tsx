import Link from 'next/link';
import Image from 'next/image';
import type { Vehicle } from '@/lib/content/types';
import { formatMileage, formatPrice } from '@/lib/utils/format';

/** Premium vehicle card. Uses next/image for the placeholder art (optimized). */
export function VehicleCard({ vehicle, priority = false }: { vehicle: Vehicle; priority?: boolean }) {
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  const image = vehicle.images[0];

  return (
    <Link
      href={`/inventory/${vehicle.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-ink-800 shadow-card transition-all duration-base ease-standard hover:-translate-y-1 hover:border-line-strong"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-700">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-slow ease-standard group-hover:scale-[1.04]"
          />
        ) : null}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-transparent"
        />
        <span className="absolute left-3 top-3 rounded-pill bg-ink-950/70 px-3 py-1 text-[11px] uppercase tracking-eyebrow text-brand-400 backdrop-blur">
          {vehicle.condition}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between text-xs text-fog-500">
          <span>{vehicle.bodyType}</span>
          <span>{vehicle.fuelType}</span>
        </div>
        <h3 className="mt-2 font-display text-lg text-fog-50">{title}</h3>
        <p className="text-sm text-fog-400">{vehicle.trim}</p>
        <div className="mt-auto flex items-end justify-between pt-5">
          <span className="font-display text-xl text-white">{formatPrice(vehicle.price)}</span>
          <span className="text-xs text-fog-500">{formatMileage(vehicle.mileageKm)}</span>
        </div>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand-400 transition-colors group-hover:text-brand-300">
          View details
          <span aria-hidden className="transition-transform duration-fast group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
