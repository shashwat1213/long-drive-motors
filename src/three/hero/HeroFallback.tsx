'use client';

/**
 * Static, premium automotive backdrop shown when WebGL is unavailable or the
 * 3D scene errors. The hero's copy + CTAs live in the DOM overlay above this,
 * so no information is lost — this only replaces the visual canvas layer.
 */
export function HeroFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-ink-950">
      {/* Layered cinematic gradients */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(80% 60% at 50% 15%, rgba(225,29,42,0.18), transparent 60%), radial-gradient(120% 90% at 50% 110%, rgba(20,22,28,0.95), #07080a 70%)',
        }}
      />
      {/* Floor sheen */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background: 'linear-gradient(to top, rgba(255,255,255,0.05), transparent)',
        }}
      />
      {/* Stylised vehicle silhouette */}
      <svg
        className="absolute left-1/2 top-[46%] w-[min(80vw,900px)] -translate-x-1/2 -translate-y-1/2 opacity-90"
        viewBox="0 0 900 300"
        fill="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a2f38" />
            <stop offset="100%" stopColor="#101318" />
          </linearGradient>
        </defs>
        <path
          d="M70 210 C110 150 180 120 300 118 L420 116 C520 112 560 120 620 150 L760 176 C820 186 840 196 840 210 L840 230 L70 230 Z"
          fill="url(#body)"
          stroke="rgba(255,255,255,0.08)"
        />
        <path d="M300 120 L360 84 L520 82 L600 122 Z" fill="#05070b" opacity="0.9" />
        <circle cx="250" cy="232" r="46" fill="#0a0a0c" stroke="#c7ccd4" strokeWidth="3" />
        <circle cx="660" cy="232" r="46" fill="#0a0a0c" stroke="#c7ccd4" strokeWidth="3" />
        <rect x="800" y="150" width="42" height="12" rx="4" fill="#e11d2a" />
      </svg>
    </div>
  );
}
