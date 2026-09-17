'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Central GSAP setup. Plugins are registered once, on the client only.
 * Import { gsap, ScrollTrigger } from here rather than from 'gsap' directly so
 * registration is guaranteed and configuration stays consistent.
 */
let registered = false;

export function ensureGsap() {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out', duration: 0.7 });
  registered = true;
}

export { gsap, ScrollTrigger };
