'use client';

/**
 * Branded loading state for 3D scenes. Rendered as an HTML overlay (not inside
 * the canvas) so the user never faces a blank canvas while assets stream in.
 * A determinate progress value can be wired to drei's <Html>/useProgress in a
 * later phase; for now it presents a calm, on-brand indeterminate state.
 */
export function SceneLoader({ label = 'Preparing the experience' }: { label?: string }) {
  return (
    <div
      className="absolute inset-0 z-10 grid place-items-center bg-ink-900"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-10 w-10">
          <span className="absolute inset-0 rounded-full border border-line" />
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-brand-500" />
        </div>
        <p className="text-sm tracking-tight text-fog-400">{label}…</p>
      </div>
    </div>
  );
}
