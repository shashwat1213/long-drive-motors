/**
 * Device / WebGL capability detection.
 *
 * Drives the three-tier 3D strategy from the blueprint:
 *   - 'full'     — capable desktop GPU: full scene, post-processing allowed
 *   - 'reduced'  — mobile / mid GPU: simplified scene, no post-processing
 *   - 'fallback' — no WebGL or very constrained: HTML/image experience only
 *
 * Pure functions (no React) so they can run in the CanvasShell, in a hook, or
 * during an SSR-safe client effect. Detection is deliberately conservative and
 * cheap — we never run a heavy benchmark on the main thread.
 */

export type CapabilityTier = 'full' | 'reduced' | 'fallback';

export interface CapabilityReport {
  tier: CapabilityTier;
  webglSupported: boolean;
  isMobile: boolean;
  /** Capped device pixel ratio recommended for the renderer. */
  recommendedDpr: number;
  reasons: string[];
}

function detectWebgl(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

function detectMobile(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const coarse =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches;
  return /Android|iPhone|iPad|iPod|Mobile|Silk/i.test(ua) || coarse;
}

/**
 * Synchronous capability read. Safe to call in a client effect. Returns a
 * 'fallback' report during SSR (no window/document) so nothing 3D renders on
 * the server.
 */
export function detectCapability(): CapabilityReport {
  const reasons: string[] = [];

  if (typeof window === 'undefined') {
    return {
      tier: 'fallback',
      webglSupported: false,
      isMobile: false,
      recommendedDpr: 1,
      reasons: ['server-render'],
    };
  }

  const webglSupported = detectWebgl();
  if (!webglSupported) {
    reasons.push('no-webgl');
    return { tier: 'fallback', webglSupported, isMobile: false, recommendedDpr: 1, reasons };
  }

  const isMobile = detectMobile();
  const cores = navigator.hardwareConcurrency ?? 4;
  // deviceMemory is non-standard/optional; treat missing as "unknown, assume ok".
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;

  const lowPower = cores <= 4 || memory <= 4;
  if (isMobile) reasons.push('mobile');
  if (lowPower) reasons.push('low-power');

  const dpr = typeof window.devicePixelRatio === 'number' ? window.devicePixelRatio : 1;

  if (isMobile || lowPower) {
    return {
      tier: 'reduced',
      webglSupported,
      isMobile,
      recommendedDpr: Math.min(dpr, 1.5),
      reasons,
    };
  }

  return {
    tier: 'full',
    webglSupported,
    isMobile,
    recommendedDpr: Math.min(dpr, 2),
    reasons,
  };
}
