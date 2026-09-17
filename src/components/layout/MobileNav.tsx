'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { primaryCta, primaryNav } from '@/config/navigation';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/format';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Full-screen mobile navigation overlay.
 * - Locks body scroll while open.
 * - Closes on Escape.
 * - Moves focus to the panel on open and restores it on close.
 */
export function MobileNav({ open, onClose }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 lg:hidden transition-opacity duration-base ease-standard',
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
      )}
      aria-hidden={!open}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={cn(
          'absolute inset-0 flex flex-col bg-ink-950/98 backdrop-blur-sm transition-transform duration-base ease-cinematic',
          open ? 'translate-y-0' : '-translate-y-4',
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-gutter py-5">
          <span className="font-display text-sm font-semibold uppercase tracking-[0.18em]">
            Menu
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-pill border border-line px-4 py-2 text-sm text-fog-200 hover:text-white hover:bg-white/5"
          >
            Close
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-gutter py-8" aria-label="Primary">
          <ul className="flex flex-col gap-1">
            {primaryNav.map((link, i) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="group flex items-baseline justify-between border-b border-line/60 py-4"
                >
                  <span className="font-display text-2xl text-fog-50 transition-colors group-hover:text-brand-400">
                    {link.label}
                  </span>
                  <span className="text-xs text-fog-500">0{i + 1}</span>
                </Link>
                {link.description ? (
                  <p className="pb-4 text-sm text-fog-400">{link.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-line px-gutter py-6">
          <Button href={primaryCta.href} size="lg" className="w-full" onClick={onClose}>
            {primaryCta.label}
          </Button>
        </div>
      </div>
    </div>
  );
}
