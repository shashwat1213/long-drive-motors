'use client';

import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
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

/** The custom property the track's fill gradient reads (see globals.css). */
type RangeStyle = CSSProperties & { '--range-fill': string };

interface RangeFieldProps {
  label: string;
  /** The formatted current value, shown opposite the label. */
  display: ReactNode;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}

/**
 * A labelled range control. The filled portion of the track is painted from
 * `--range-fill` rather than `accent-color`, which browsers ignore once the
 * native appearance has been reset to allow a custom thumb.
 */
function RangeField({ label, display, min, max, step, value, onChange }: RangeFieldProps) {
  const fill = max > min ? ((value - min) / (max - min)) * 100 : 0;
  const style: RangeStyle = { '--range-fill': `${fill}%` };

  return (
    <label className="block">
      <span className="flex items-center justify-between text-sm">
        <span className="text-fog-400">{label}</span>
        <span className="font-display text-fog-50">{display}</span>
      </span>
      <input
        className="range-input mt-1"
        style={style}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

export function PaymentCalculator({ defaultPrice, maxPrice }: PaymentCalculatorProps) {
  const [price, setPrice] = useState(defaultPrice);
  const [down, setDown] = useState(Math.round(defaultPrice * 0.1));
  const [term, setTerm] = useState(60);
  const [apr, setApr] = useState(7.99);

  const principal = Math.max(price - down, 0);
  const payment = useMemo(() => monthlyPayment(principal, apr, term), [principal, apr, term]);
  const totalInterest = payment * term - principal;

  return (
    <div className="rounded-card border border-line bg-ink-800/60 p-5 sm:p-7">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div className="space-y-4">
          <RangeField
            label="Vehicle price"
            display={formatPrice(price)}
            min={10000}
            max={maxPrice}
            step={500}
            value={price}
            onChange={(next) => {
              setPrice(next);
              if (down > next) setDown(next);
            }}
          />

          <RangeField
            label="Down payment"
            display={formatPrice(down)}
            min={0}
            max={price}
            step={250}
            value={down}
            onChange={setDown}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <RangeField
              label="Term"
              display={`${term} mo`}
              min={24}
              max={84}
              step={12}
              value={term}
              onChange={setTerm}
            />
            <RangeField
              label="Rate"
              display={`${apr.toFixed(2)}%`}
              min={2}
              max={19.99}
              step={0.25}
              value={apr}
              onChange={setApr}
            />
          </div>
        </div>

        {/* Result */}
        <div
          className="rounded-card border border-line bg-ink-900/70 p-5 text-center sm:p-7"
          aria-live="polite"
        >
          <p className="text-xs uppercase tracking-eyebrow text-fog-500">Estimated payment</p>
          <p className="mt-3 font-display text-4xl text-white sm:text-5xl">
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
