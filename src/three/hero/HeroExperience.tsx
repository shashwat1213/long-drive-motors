'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { HeroLoader } from '@/three/hero/HeroLoader';
import { Button } from '@/components/ui/Button';
import { useCapability } from '@/hooks/useCapability';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ensureGsap, gsap, ScrollTrigger } from '@/animation/gsap';
import { primaryCta } from '@/config/navigation';

/** Decorative scroll captions (aria-hidden — purely visual storytelling). */
const captions = [
  'Hand-picked vehicles. A better way to shop.',
  'Explore every angle.',
  'Step inside.',
  'Find your next drive.',
];

/**
 * three.js is pulled in only on the client, and only once the hero mounts —
 * the surrounding copy and CTAs are server-rendered and never blocked by it.
 */
const HeroCanvas = dynamic(() => import('@/three/hero/HeroCanvas'), {
  ssr: false,
  loading: () => <HeroLoader visible />,
});

export function HeroExperience() {
  const { report, ready: capReady } = useCapability();
  const reducedMotion = useReducedMotion();

  const sectionRef = useRef<HTMLDivElement>(null);
  const heroBlockRef = useRef<HTMLDivElement>(null);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progress = useRef({ value: 0 });

  const [sceneReady, setSceneReady] = useState(false);

  const quality: 'full' | 'reduced' = report.tier === 'full' ? 'full' : 'reduced';
  const isFallback = capReady && report.tier === 'fallback';
  const motionEnabled = capReady && !reducedMotion;
  const showLoader = capReady && !isFallback && !sceneReady;

  // Scroll wiring: maps scroll progress to the camera proxy + caption fades.
  useLayoutEffect(() => {
    if (!capReady) return;
    const section = sectionRef.current;
    if (!section) return;

    // Reduced motion / no motion: static composition, show only the last caption.
    if (!motionEnabled) {
      progress.current.value = 0.82;
      captionRefs.current.forEach((el, i) => {
        if (el) el.style.opacity = i === captions.length - 1 ? '1' : '0';
      });
      if (heroBlockRef.current) heroBlockRef.current.style.opacity = '1';
      return;
    }

    ensureGsap();
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          progress.current.value = p;

          // Persistent hero block: subtle parallax, never fully hidden.
          if (heroBlockRef.current) {
            const fade = gsap.utils.clamp(0.35, 1, 1 - (p - 0.12) * 1.6);
            heroBlockRef.current.style.opacity = String(fade);
            heroBlockRef.current.style.transform = `translateY(${p * -40}px)`;
          }

          // Decorative captions crossfade across the sequence.
          const count = captions.length;
          captionRefs.current.forEach((el, i) => {
            if (!el) return;
            const center = (i + 1.15) / (count + 1);
            const dist = Math.abs(p - center);
            const win = 0.9 / (count + 1);
            const op = gsap.utils.clamp(0, 1, 1 - dist / win);
            el.style.opacity = String(op);
            el.style.transform = `translateY(${(p - center) * -60}px)`;
          });
        },
      });
    }, section);

    return () => ctx.revert();
  }, [capReady, motionEnabled]);

  return (
    <section
      ref={sectionRef}
      className="relative -mt-16"
      style={{ height: motionEnabled ? '520vh' : '100vh' }}
      aria-label="Long Drive Motors immersive hero"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* 3D canvas (or static fallback on unsupported devices) */}
        <div className="absolute inset-0">
          <HeroCanvas
            progressRef={progress}
            quality={quality}
            cameraEnabled={motionEnabled}
            idle={motionEnabled}
            onReady={() => setSceneReady(true)}
          />
        </div>

        {/* Readability scrim */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(7,8,10,0.85) 0%, rgba(7,8,10,0.1) 35%, transparent 60%)',
          }}
        />

        {/* Decorative scroll-story captions (visual only) */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {captions.map((caption, i) => (
            <div
              key={caption}
              ref={(el) => {
                captionRefs.current[i] = el;
              }}
              className="absolute inset-x-0 top-[22%] mx-auto max-w-3xl px-gutter text-center opacity-0"
            >
              <p className="font-display text-display-md text-fog-50">{caption}</p>
            </div>
          ))}
        </div>

        {/* Persistent, accessible hero content (single H1 + primary CTAs) */}
        <div className="pointer-events-none absolute inset-0 flex items-end pb-[12vh]">
          <div ref={heroBlockRef} className="container-content">
            <div className="max-w-2xl">
              <span className="eyebrow">
                <span className="h-px w-6 bg-brand-500" aria-hidden />
                Toronto · Pre-Owned Vehicles
              </span>
              <h1 className="mt-5 text-display-2xl">
                The long drive
                <br />
                <span className="text-fog-400">starts here.</span>
              </h1>
              <p className="mt-5 max-w-prose text-lg leading-relaxed text-fog-200">
                Step into an immersive showroom, explore hand-picked vehicles in 3D, and discover a
                better way to buy pre-owned.
              </p>
              <div className="pointer-events-auto mt-8 flex flex-wrap items-center gap-3">
                <Button href={primaryCta.href} size="lg">
                  Explore Showroom
                </Button>
                <Button href="/inventory" variant="ghost" size="lg">
                  Browse Inventory
                </Button>
              </div>
              <p className="mt-8 text-xs uppercase tracking-eyebrow text-fog-500">
                Hand-picked · Inspected · Trusted
              </p>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        {motionEnabled && (
          <div
            aria-hidden
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-fog-500"
          >
            Scroll to explore
          </div>
        )}

        <HeroLoader visible={showLoader} />
      </div>
    </section>
  );
}
