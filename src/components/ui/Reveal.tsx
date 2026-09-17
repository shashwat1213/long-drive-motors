'use client';

import { createElement, useLayoutEffect, useRef, type ElementType, type ReactNode } from 'react';
import { ensureGsap, gsap, ScrollTrigger } from '@/animation/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils/format';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in seconds for sequenced reveals. */
  delay?: number;
  as?: ElementType;
}

/**
 * Scroll-triggered fade-up primitive used across content sections.
 * When reduced motion is preferred it renders content in its final state with
 * no transform/animation. Content is always present in the DOM (never hidden
 * from crawlers or assistive tech) — only the visual transition is affected.
 */
export function Reveal({ children, className, delay = 0, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    ensureGsap();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        },
      );
    }, el);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [delay, reducedMotion]);

  return createElement(Tag, { ref, className: cn(className) }, children);
}
