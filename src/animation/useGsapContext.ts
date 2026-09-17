'use client';

import { useLayoutEffect, useRef } from 'react';
import { ensureGsap, gsap } from './gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Runs GSAP animations scoped to a container ref with automatic cleanup
 * (gsap.context handles reverting all tweens/ScrollTriggers on unmount).
 *
 * The setup callback receives `reducedMotion` so each animation can provide a
 * calmer alternative (instant state / crossfade) rather than being globally
 * disabled — motion degrades gracefully instead of disappearing.
 *
 * @returns a ref to attach to the animation's root element.
 */
export function useGsapContext(
  setup: (ctx: { gsap: typeof gsap; scope: HTMLElement; reducedMotion: boolean }) => void,
  deps: unknown[] = [],
) {
  const scopeRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    ensureGsap();
    const scope = scopeRef.current;
    if (!scope) return;

    const ctx = gsap.context(() => {
      setup({ gsap, scope, reducedMotion });
    }, scope);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, ...deps]);

  return scopeRef;
}
