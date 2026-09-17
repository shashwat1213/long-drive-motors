'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { BodyType } from '@/lib/content/types';

interface QuickSearchProps {
  makes: string[];
  bodyTypes: BodyType[];
  years: number[];
  priceMax: number;
}

const selectClass =
  'w-full appearance-none rounded-pill border border-line bg-ink-900/80 px-4 py-3 text-sm text-fog-100 outline-none transition-colors focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500';

/**
 * Quick inventory search. Builds a query string and routes to /inventory.
 * The inventory page consumes these params when its filter UI is wired up;
 * shareable URLs work today.
 */
export function QuickSearch({ makes, bodyTypes, years, priceMax }: QuickSearchProps) {
  const router = useRouter();
  const [make, setMake] = useState('');
  const [bodyStyle, setBodyStyle] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');

  const onSearch = () => {
    const params = new URLSearchParams();
    if (make) params.set('make', make);
    if (bodyStyle) params.set('body_style', bodyStyle);
    if (year) params.set('min_year', year);
    if (price) params.set('max_price', price);
    const query = params.toString();
    router.push(query ? `/inventory?${query}` : '/inventory');
  };

  const priceSteps = [20000, 30000, 40000, 50000, 60000].filter((p) => p <= priceMax);

  return (
    <div className="rounded-card border border-line bg-ink-800/70 p-4 shadow-card backdrop-blur sm:p-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-eyebrow text-fog-500">Make</span>
          <select className={selectClass} value={make} onChange={(e) => setMake(e.target.value)}>
            <option value="">Any make</option>
            {makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-eyebrow text-fog-500">
            Body style
          </span>
          <select
            className={selectClass}
            value={bodyStyle}
            onChange={(e) => setBodyStyle(e.target.value)}
          >
            <option value="">Any style</option>
            {bodyTypes.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-eyebrow text-fog-500">
            Min year
          </span>
          <select className={selectClass} value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">Any year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-eyebrow text-fog-500">
            Max price
          </span>
          <select className={selectClass} value={price} onChange={(e) => setPrice(e.target.value)}>
            <option value="">Any price</option>
            {priceSteps.map((p) => (
              <option key={p} value={p}>
                ${p.toLocaleString()}
              </option>
            ))}
          </select>
        </label>

        <Button onClick={onSearch} size="lg" className="w-full">
          Search
        </Button>
      </div>
    </div>
  );
}
