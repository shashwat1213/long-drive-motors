'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { HeroLoader } from '@/three/hero/HeroLoader';
import { Button } from '@/components/ui/Button';
import { useCapability } from '@/hooks/useCapability';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ensureGsap, gsap, ScrollTrigger } from '@/animation/gsap';
import { primaryCta } from '@/config/navigation';
import { cn } from '@/lib/utils/format';

/** Decorative scroll captions (aria-hidden — purely visual storytelling). */
const captions = [
  'Hand-picked vehicles. A better way to shop.',
  'Explore every angle.',
  'Step inside.',
  'Find your next drive.',
];

/**
 * Frame shape the hero's layout branches on. Kept in sync with
 * PORTRAIT_ASPECT_MAX (the camera) and the `tall` Tailwind screen (the markup),
 * so all three agree on where the portrait composition begins.
 */
const TALL_FRAME = '(max-aspect-ratio: 95/100)';
const WIDE_FRAME = '(min-aspect-ratio: 95/100)';

/**
 * On a tall frame the hero carries no text at all while the camera sequence is
 * running — the vehicle gets the whole screen. The headline, copy and CTAs fade
 * up over this window at the end of the scroll, together with the scrim that
 * makes them readable.
 */
const REVEAL_START = 0.68;
const REVEAL_END = 0.9;

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
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progress = useRef({ value: 0 });

  const [sceneReady, setSceneReady] = useState(false);

  const quality: 'full' | 'reduced' = report.tier === 'full' ? 'full' : 'reduced';
  const isFallback = capReady && report.tier === 'fallback';
  const motionEnabled = capReady && !reducedMotion;
  const showLoader = capReady && !isFallback && !sceneReady;

  // Scroll wiring: maps scroll progress to the camera proxy + the copy reveal.
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
    const mm = gsap.matchMedia();

    // Wide frames — the reference composition.
    mm.add(WIDE_FRAME, () => {
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
    });

    // Tall frames — nothing but the vehicle until the sequence resolves.
    mm.add(TALL_FRAME, () => {
      const block = heroBlockRef.current;
      const scrim = scrimRef.current;
      const cta = ctaRef.current;
      const hint = hintRef.current;

      // Captions belong to the wide composition; a phone frame has no room to
      // put type over the vehicle without covering it.
      captionRefs.current.forEach((el) => {
        if (el) el.style.opacity = '0';
      });

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          progress.current.value = p;

          const raw = gsap.utils.clamp(0, 1, (p - REVEAL_START) / (REVEAL_END - REVEAL_START));
          const reveal = raw * raw * (3 - 2 * raw);

          if (block) {
            block.style.opacity = String(reveal);
            block.style.transform = `translateY(${(1 - reveal) * 28}px)`;
          }
          // The scrim exists to make type legible; while there is no type it
          // would only be dimming the car, so it arrives with the copy.
          if (scrim) scrim.style.opacity = String(reveal);
          // Keep the CTAs untappable until they are actually on screen.
          if (cta) cta.style.pointerEvents = reveal > 0.6 ? 'auto' : 'none';
          if (hint) hint.style.opacity = String(1 - reveal);
        },
      });

      // Restore inline state when the frame stops being tall (device rotated).
      return () => {
        if (block) {
          block.style.opacity = '';
          block.style.transform = '';
        }
        if (scrim) scrim.style.opacity = '';
        if (cta) cta.style.pointerEvents = '';
        if (hint) hint.style.opacity = '';
      };
    });

    return () => mm.revert();
  }, [capReady, motionEnabled]);

  return (
    <section
      ref={sectionRef}
      className={cn('relative -mt-16', motionEnabled ? 'hero-scroll' : 'hero-stage')}
      aria-label="Long Drive Motors immersive hero"
    >
      <div className="hero-stage sticky top-0 w-full overflow-hidden">
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
          ref={scrimRef}
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(7,8,10,0.85) 0%, rgba(7,8,10,0.1) 35%, transparent 60%)',
          }}
        />

        {/* Decorative scroll-story captions (visual only, wide frames) */}
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
        <div className="pointer-events-none absolute inset-0 flex items-end pb-[12vh] tall:pb-[9vh]">
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
              <p className="mt-5 max-w-prose text-lg leading-relaxed text-fog-200 tall:mt-4 tall:max-w-[34ch] tall:text-base">
                Step into an immersive showroom, explore hand-picked vehicles in 3D, and discover a
                better way to buy pre-owned.
              </p>
              <div
                ref={ctaRef}
                className="pointer-events-auto mt-8 flex flex-wrap items-center gap-3 tall:mt-6"
              >
                <Button href={primaryCta.href} size="lg">
                  Explore Showroom
                </Button>
                <Button href="/inventory" variant="ghost" size="lg">
                  Browse Inventory
                </Button>
              </div>
              {/* Repeated by the trust badges further down the page — on a phone
                  the vertical room is better spent on the vehicle. */}
              <p className="mt-8 text-xs uppercase tracking-eyebrow text-fog-500 tall:hidden">
                Hand-picked · Inspected · Trusted
              </p>
            </div>
          </div>
        </div>

        {/* Scroll hint — wordless on tall frames, where the hero holds no type */}
        {motionEnabled && (
          <div
            ref={hintRef}
            aria-hidden
            className="absolute bottom-6 left-1/2 flex -translate-x-1/2 justify-center"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-fog-500 tall:hidden">
              Scroll to explore
            </span>
            <span className="scroll-cue hidden tall:block" />
          </div>
        )}

        <HeroLoader visible={showLoader} />
      </div>
    </section>
  );
}
