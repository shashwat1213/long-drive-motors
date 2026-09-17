'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks the user's reduced-motion preference. All GSAP/3D motion checks this
 * so animation can degrade to instant/crossfade alternatives while keeping
 * every interaction functional. SSR-safe: returns false until mounted.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
