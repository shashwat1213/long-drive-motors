'use client';

import { useMemo, useState } from 'react';
import { formatPrice } from '@/lib/utils/format';

interface PaymentCalculatorProps {
  defaultPrice: number;
  maxPrice: number;
}

/**
 * Standard amortized-loan estimator. Figures are illustrative and clearly
 * labelled as such — the real rate comes from the lender at approval.
 */
function monthlyPayment(principal: number, aprPercent: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = aprPercent / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

const sliderClass =
  'w-full cursor-pointer appearance-none rounded-pill bg-ink-700 accent-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500';

export function PaymentCalculator({ defaultPrice, maxPrice }: PaymentCalculatorProps) {
  const [price, setPrice] = useState(defaultPrice);
  const [down, setDown] = useState(Math.round(defaultPrice * 0.1));
  const [term, setTerm] = useState(60);
  const [apr, setApr] = useState(7.99);

  const principal = Math.max(price - down, 0);
  const payment = useMemo(() => monthlyPayment(principal, apr, term), [principal, apr, term]);
  const totalInterest = payment * term - principal;

  return (
    <div className="rounded-card border border-line bg-ink-800/60 p-7">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div className="space-y-6">
          <label className="block">
            <span className="flex items-center justify-between text-sm">
              <span className="text-fog-400">Vehicle price</span>
              <span className="font-display text-fog-50">{formatPrice(price)}</span>
            </span>
            <input
              className={`${sliderClass} mt-3`}
              type="range"
              min={10000}
              max={maxPrice}
              step={500}
              value={price}
              onChange={(e) => {
                const next = Number(e.target.value);
                setPrice(next);
                if (down > next) setDown(next);
              }}
            />
          </label>

          <label className="block">
            <span className="flex items-center justify-between text-sm">
              <span className="text-fog-400">Down payment</span>
              <span className="font-display text-fog-50">{formatPrice(down)}</span>
            </span>
            <input
              className={`${sliderClass} mt-3`}
              type="range"
              min={0}
              max={price}
              step={250}
              value={down}
              onChange={(e) => setDown(Number(e.target.value))}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="flex items-center justify-between text-sm">
                <span className="text-fog-400">Term</span>
                <span className="font-display text-fog-50">{term} mo</span>
              </span>
              <input
                className={`${sliderClass} mt-3`}
                type="range"
                min={24}
                max={84}
                step={12}
                value={term}
                onChange={(e) => setTerm(Number(e.target.value))}
              />
            </label>
            <label className="block">
              <span className="flex items-center justify-between text-sm">
                <span className="text-fog-400">Rate</span>
                <span className="font-display text-fog-50">{apr.toFixed(2)}%</span>
              </span>
              <input
                className={`${sliderClass} mt-3`}
                type="range"
                min={2}
                max={19.99}
                step={0.25}
                value={apr}
                onChange={(e) => setApr(Number(e.target.value))}
              />
            </label>
          </div>
        </div>

        {/* Result */}
        <div
          className="rounded-card border border-line bg-ink-900/70 p-7 text-center"
          aria-live="polite"
        >
          <p className="text-xs uppercase tracking-eyebrow text-fog-500">Estimated payment</p>
          <p className="mt-3 font-display text-5xl text-white">
            {formatPrice(Math.round(payment))}
            <span className="ml-1 align-middle text-base text-fog-400">/mo</span>
          </p>
          <dl className="mt-7 space-y-2 text-sm">
            <div className="flex justify-between text-fog-400">
              <dt>Amount financed</dt>
              <dd className="text-fog-200">{formatPrice(principal)}</dd>
            </div>
            <div className="flex justify-between text-fog-400">
              <dt>Total interest</dt>
              <dd className="text-fog-200">{formatPrice(Math.max(Math.round(totalInterest), 0))}</dd>
            </div>
            <div className="flex justify-between text-fog-400">
              <dt>Total cost</dt>
              <dd className="text-fog-200">
                {formatPrice(Math.round(principal + Math.max(totalInterest, 0) + down))}
              </dd>
            </div>
          </dl>
          <p className="mt-6 text-xs leading-relaxed text-fog-500">
            Estimates only, before taxes, licensing and fees. Your actual rate depends on credit
            approval.
          </p>
        </div>
      </div>
    </div>
  );
}
