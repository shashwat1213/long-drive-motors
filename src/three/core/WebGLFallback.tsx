import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/format';

/**
 * Accessible fallback surface shown when WebGL is unavailable or the device is
 * too constrained for the 3D experience. Consumers pass real HTML content
 * (imagery, copy, links) so nothing meaningful is lost when 3D can't run.
 */
export function WebGLFallback({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative flex min-h-[60vh] items-center justify-center overflow-hidden rounded-card border border-line bg-ink-800',
        className,
      )}
    >
      {children}
    </div>
  );
}
