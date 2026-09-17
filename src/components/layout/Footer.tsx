import Link from 'next/link';
import { dealership, directionsUrl, siteMeta } from '@/config/site';
import { footerNav } from '@/config/navigation';
import { Wordmark } from './Wordmark';

function formatHour(value: string): string {
  const [hStr, mStr] = value.split(':');
  const h = Number(hStr ?? 0);
  const m = Number(mStr ?? 0);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? hour12 + ' ' + period : hour12 + ':' + String(m).padStart(2, '0') + ' ' + period;
}

export function Footer() {
  const { address, phone, phoneHref } = dealership;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-ink-950">
      <div className="container-content py-section">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          {/* Brand + address + primary contact actions */}
          <div>
            <Wordmark />
            <address className="mt-6 not-italic text-sm leading-relaxed text-fog-300">
              {address.street}
              <br />
              {address.city}, {address.region} {address.postalCode}
              <br />
              {address.country}
            </address>
            <p className="mt-4">
              <a
                href={'tel:' + phoneHref}
                className="font-display text-lg text-fog-50 transition-colors hover:text-brand-400"
              >
                {phone}
              </a>
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={'tel:' + phoneHref}
                className="rounded-pill bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
              >
                Call Us
              </a>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-pill border border-line px-4 py-2 text-sm text-fog-100 transition-colors hover:bg-white/5"
              >
                Get Directions
              </a>
              <Link
                href="/test-drive"
                className="rounded-pill border border-line px-4 py-2 text-sm text-fog-100 transition-colors hover:bg-white/5"
              >
                Book a Test Drive
              </Link>
            </div>
          </div>

          {/* Quick links */}
          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-xs font-medium uppercase tracking-eyebrow text-fog-500">
                {group.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-fog-300 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Hours */}
          <div>
            <h2 className="text-xs font-medium uppercase tracking-eyebrow text-fog-500">Hours</h2>
            <ul className="mt-4 space-y-1.5 text-sm">
              {dealership.hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-4 text-fog-300">
                  <span className="text-fog-400">{h.day.slice(0, 3)}</span>
                  <span>
                    {formatHour(h.open)} – {formatHour(h.close)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-14 border-t border-line pt-8">
          <p className="text-xs uppercase tracking-eyebrow text-fog-500">Accredited & Trusted</p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {siteMeta.trustBadges.map((badge) => (
              <li
                key={badge.id}
                className="flex items-center gap-3 rounded-card border border-line bg-ink-800/60 px-4 py-3"
              >
                <span
                  aria-hidden
                  className="grid h-8 w-8 place-items-center rounded-md bg-ink-700 text-[10px] font-semibold uppercase tracking-wide text-brand-400"
                >
                  {badge.label.slice(0, 2)}
                </span>
                <span>
                  <span className="block text-sm text-fog-100">{badge.label}</span>
                  <span className="block text-xs text-fog-500">{badge.blurb}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 text-sm text-fog-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {dealership.legalName}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/legal/privacy" className="hover:text-fog-200">
              Privacy
            </Link>
            <Link href="/contact" className="hover:text-fog-200">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
