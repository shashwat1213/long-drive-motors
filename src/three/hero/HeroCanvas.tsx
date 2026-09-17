'use client';

import type { MutableRefObject } from 'react';
import { CanvasShell } from '@/three/core/CanvasShell';
import { HeroScene } from '@/three/hero/HeroScene';
import { HeroLoader } from '@/three/hero/HeroLoader';
import { HeroFallback } from '@/three/hero/HeroFallback';

export interface HeroCanvasProps {
  progressRef: MutableRefObject<{ value: number }>;
  quality: 'full' | 'reduced';
  cameraEnabled: boolean;
  idle: boolean;
  onReady?: () => void;
}

/**
 * Single import boundary for everything that pulls in three.js.
 *
 * Consumers load this with next/dynamic, which keeps the ~270kB three/R3F
 * bundle out of the initial page payload. The surrounding hero markup (H1,
 * CTAs) stays server-rendered so content and SEO never wait on WebGL.
 */
export default function HeroCanvas({
  progressRef,
  quality,
  cameraEnabled,
  idle,
  onReady,
}: HeroCanvasProps) {
  return (
    <CanvasShell fallback={<HeroFallback />} suspenseFallback={<HeroLoader visible />}>
      <HeroScene
        progressRef={progressRef}
        quality={quality}
        cameraEnabled={cameraEnabled}
        idle={idle}
        onReady={onReady}
      />
    </CanvasShell>
  );
}
