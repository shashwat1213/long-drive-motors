'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { VehicleImage } from '@/lib/content/types';
import { cn } from '@/lib/utils/format';

/** Premium gallery: large stage image with selectable thumbnails. */
export function VehicleGallery({ images, title }: { images: VehicleImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  if (!current) return null;

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-card border border-line bg-ink-800">
        <Image
          src={current.src}
          alt={current.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority
          className="object-cover"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/50 to-transparent"
        />
      </div>

      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-3 gap-3" role="list">
          {images.map((image, i) => (
            <li key={image.src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1} of ${title}`}
                aria-current={i === active}
                className={cn(
                  'relative block aspect-[16/10] w-full overflow-hidden rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                  i === active ? 'border-brand-500' : 'border-line hover:border-line-strong',
                )}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="20vw"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
