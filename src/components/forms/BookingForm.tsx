'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';

export interface BookingFieldOption {
  label: string;
  value: string;
}

export interface BookingField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'select' | 'textarea' | 'number';
  required?: boolean;
  placeholder?: string;
  options?: BookingFieldOption[];
  /** Half-width on wider screens. */
  half?: boolean;
}

interface BookingFormProps {
  fields: BookingField[];
  submitLabel: string;
  successTitle: string;
  successBody: string;
  /** Optional callback to render a computed result (e.g. a valuation range). */
  renderResult?: (values: Record<string, string>) => React.ReactNode;
}

const fieldClass =
  'w-full rounded-xl border border-line bg-ink-900/80 px-4 py-3 text-sm text-fog-100 outline-none transition-colors placeholder:text-fog-500 focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500';

/**
 * Shared form shell for booking-style flows. Validation is client-side and the
 * confirmation is rendered locally; connecting a real endpoint means replacing
 * the submit handler, not the markup.
 */
export function BookingForm({
  fields,
  submitLabel,
  successTitle,
  successBody,
  renderResult,
}: BookingFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const missing = fields.filter((f) => f.required && !values[f.name]?.trim());
    if (missing.length > 0) {
      setError(`Please complete: ${missing.map((f) => f.label).join(', ')}.`);
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className="rounded-card border border-line bg-ink-800/60 p-8 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-500/15 text-brand-400">
          ✓
        </div>
        <h3 className="mt-4 font-display text-xl text-fog-50">{successTitle}</h3>
        <p className="mx-auto mt-2 max-w-prose text-sm text-fog-400">{successBody}</p>
        {renderResult ? <div className="mt-6">{renderResult(values)}</div> : null}
        <button
          type="button"
          onClick={() => {
            setValues({});
            setSubmitted(false);
          }}
          className="mt-6 text-sm text-brand-400 hover:text-brand-300"
        >
          Start over
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      {fields.map((field) => {
        const id = `field-${field.name}`;
        const label = (
          <span className="mb-1.5 block text-xs uppercase tracking-eyebrow text-fog-500">
            {field.label}
            {field.required ? <span className="text-brand-400"> *</span> : null}
          </span>
        );

        return (
          <div key={field.name} className={field.half ? 'sm:col-span-1' : 'sm:col-span-2'}>
            <label htmlFor={id}>{label}</label>
            {field.type === 'select' ? (
              <select
                id={id}
                className={fieldClass}
                value={values[field.name] ?? ''}
                onChange={(e) => set(field.name, e.target.value)}
                required={field.required}
              >
                <option value="">{field.placeholder ?? 'Select an option'}</option>
                {field.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                id={id}
                rows={4}
                className={`${fieldClass} resize-y`}
                value={values[field.name] ?? ''}
                onChange={(e) => set(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
              />
            ) : (
              <input
                id={id}
                type={field.type}
                className={fieldClass}
                value={values[field.name] ?? ''}
                onChange={(e) => set(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
              />
            )}
          </div>
        );
      })}

      {error ? (
        <p className="text-sm text-brand-400 sm:col-span-2" role="alert">
          {error}
        </p>
      ) : null}

      <div className="sm:col-span-2">
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
