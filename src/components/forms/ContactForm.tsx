'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';

const fieldClass =
  'w-full rounded-xl border border-line bg-ink-900/80 px-4 py-3 text-sm text-fog-100 outline-none transition-colors placeholder:text-fog-500 focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500';

type Status = 'idle' | 'error' | 'success';

/**
 * Contact form with client-side validation and a success state. Submissions are
 * handled locally for now; wiring to a real endpoint/CRM is a drop-in change to
 * onSubmit (POST to an API route) without touching the markup.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [values, setValues] = useState({ name: '', email: '', phone: '', message: '' });

  const update = (key: keyof typeof values) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!values.name.trim() || !values.email.trim() || !values.message.trim()) {
      setStatus('error');
      return;
    }
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <div
        className="rounded-card border border-line bg-ink-800/60 p-8 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-500/15 text-brand-400">
          ✓
        </div>
        <h3 className="mt-4 font-display text-xl text-fog-50">Thanks — we’ll be in touch</h3>
        <p className="mt-2 text-sm text-fog-400">
          Your message has been received. Our team will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => {
            setValues({ name: '', email: '', phone: '', message: '' });
            setStatus('idle');
          }}
          className="mt-6 text-sm text-brand-400 hover:text-brand-300"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-eyebrow text-fog-500">
            Name <span className="text-brand-400">*</span>
          </span>
          <input
            className={fieldClass}
            type="text"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={update('name')}
            placeholder="Your name"
            required
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-eyebrow text-fog-500">
            Email <span className="text-brand-400">*</span>
          </span>
          <input
            className={fieldClass}
            type="email"
            name="email"
            autoComplete="email"
            value={values.email}
            onChange={update('email')}
            placeholder="you@example.com"
            required
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-xs uppercase tracking-eyebrow text-fog-500">Phone</span>
        <input
          className={fieldClass}
          type="tel"
          name="phone"
          autoComplete="tel"
          value={values.phone}
          onChange={update('phone')}
          placeholder="Optional"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs uppercase tracking-eyebrow text-fog-500">
          Message <span className="text-brand-400">*</span>
        </span>
        <textarea
          className={`${fieldClass} min-h-32 resize-y`}
          name="message"
          rows={5}
          value={values.message}
          onChange={update('message')}
          placeholder="How can we help?"
          required
        />
      </label>

      {status === 'error' && (
        <p className="text-sm text-brand-400" role="alert">
          Please complete the required fields (name, email, and message).
        </p>
      )}

      <Button type="submit" size="lg" className="w-full sm:w-auto">
        Send Message
      </Button>
    </form>
  );
}
