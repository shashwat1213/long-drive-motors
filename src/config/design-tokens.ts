/**
 * Design tokens — single source of truth for values that need to be shared
 * between Tailwind (build-time) and runtime TypeScript (e.g. GSAP durations,
 * capability breakpoints). Colour + spacing scales live in tailwind.config.ts;
 * this file holds the tokens that JS/animation code needs to read directly.
 */

/** Animation timing tokens (seconds) — keep motion consistent across GSAP + CSS. */
export const DURATION = {
  instant: 0.12,
  fast: 0.24,
  base: 0.4,
  slow: 0.7,
  cinematic: 1.2,
} as const;

/** Easing tokens. GSAP-compatible strings; CSS equivalents in globals.css. */
export const EASE = {
  /** Standard UI ease — confident, slightly weighted. */
  standard: 'power2.out',
  /** Entrances / reveals. */
  entrance: 'power3.out',
  /** Cinematic camera + hero motion. */
  cinematic: 'power4.inOut',
} as const;

/** Responsive breakpoints (px). Mirrors tailwind.config.ts screens. */
export const BREAKPOINT = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type DurationToken = keyof typeof DURATION;
export type EaseToken = keyof typeof EASE;
export type Breakpoint = keyof typeof BREAKPOINT;
