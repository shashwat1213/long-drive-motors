'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { primaryCta, primaryNav } from '@/config/navigation';
import { Button } from '@/components/ui/Button';
import { Wordmark } from './Wordmark';
import { MobileNav } from './MobileNav';
import { cn } from '@/lib/utils/format';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile nav on route change.
  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-pill focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-colors duration-base ease-standard',
          scrolled
            ? 'border-b border-line bg-ink-950/80 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <div className="container-content flex h-16 items-center justify-between gap-4">
          <Wordmark />

          <nav className="hidden lg:block" aria-label="Primary">
            <ul className="flex items-center gap-1">
              {primaryNav.map((link) => {
                const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'rounded-pill px-4 py-2 text-sm transition-colors duration-fast ease-standard',
                        active
                          ? 'text-white'
                          : 'text-fog-300 hover:text-white hover:bg-white/5',
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Button href={primaryCta.href} size="sm" className="hidden sm:inline-flex">
              {primaryCta.label}
            </Button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className="grid h-10 w-10 place-items-center rounded-pill border border-line text-fog-100 hover:bg-white/5 lg:hidden"
            >
              <span className="sr-only">Open menu</span>
              <span aria-hidden className="flex flex-col gap-1.5">
                <span className="block h-px w-5 bg-current" />
                <span className="block h-px w-5 bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
