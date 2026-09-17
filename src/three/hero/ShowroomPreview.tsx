'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { HeroLoader } from '@/three/hero/HeroLoader';
import { useCapability } from '@/hooks/useCapability';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * A contained, premium 3D composition for the showroom page: the studio scene
 * with a static hero camera and a gentle idle turn. Reuses the hero scene
 * modules — the full walkable environment (stations, hotspots, free-explore)
 * mounts into this same architecture next.
 */
const HeroCanvas = dynamic(() => import('@/three/hero/HeroCanvas'), {
  ssr: false,
  loading: () => <HeroLoader visible />,
});

export function ShowroomPreview() {
  const { report } = useCapability();
  const reducedMotion = useReducedMotion();
  const progress = useRef({ value: 0.5 });

  const quality: 'full' | 'reduced' = report.tier === 'full' ? 'full' : 'reduced';

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-card border border-line md:aspect-[21/9]">
      <HeroCanvas
        progressRef={progress}
        quality={quality}
        cameraEnabled={false}
        idle={!reducedMotion}
      />
    </div>
  );
}
