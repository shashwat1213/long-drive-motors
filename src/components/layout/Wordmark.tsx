import Link from 'next/link';
import { cn } from '@/lib/utils/format';

/**
 * Typographic wordmark. Kept as text (not an image) so it stays crisp at any
 * size, is crawlable, and needs no asset. A real logo can replace this later
 * behind the same component API.
 */
export function Wordmark({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Long Drive Motors — home"
      className={cn('group inline-flex items-center gap-2.5', className)}
    >
      <span
        aria-hidden
        className="grid h-8 w-8 place-items-center rounded-md bg-brand-500 text-white shadow-glow transition-transform duration-fast ease-standard group-hover:scale-105"
      >
        <span className="font-display text-sm font-semibold leading-none">L</span>
      </span>
      {!compact && (
        <span className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-fog-50">
          Long Drive
          <span className="text-brand-500">.</span>
        </span>
      )}
    </Link>
  );
}
