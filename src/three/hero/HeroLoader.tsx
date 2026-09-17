'use client';

import { cn } from '@/lib/utils/format';

/**
 * Branded loading overlay for the hero — never a blank canvas. Fades out once
 * the scene signals ready. Presented as HTML above the canvas.
 */
export function HeroLoader({ visible }: { visible: boolean }) {
  return (
    <div
      className={cn(
        'absolute inset-0 z-20 grid place-items-center bg-ink-950 transition-opacity duration-700 ease-standard',
        visible ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
      role="status"
      aria-live="polite"
      aria-hidden={!visible}
    >
      <div className="flex flex-col items-center gap-6 px-6 text-center">
        <span className="font-display text-sm uppercase tracking-[0.4em] text-fog-50">
          Long Drive Motors
        </span>
        <div className="h-px w-40 overflow-hidden bg-white/10">
          <span className="block h-full w-1/3 animate-[loadbar_1.4s_ease-in-out_infinite] bg-brand-500" />
        </div>
        <span className="text-xs uppercase tracking-eyebrow text-fog-500">Loading experience</span>
      </div>

      <style>{`
        @keyframes loadbar {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(360%); }
        }
      `}</style>
    </div>
  );
}
