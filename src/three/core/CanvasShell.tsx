'use client';

import { Suspense, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useCapability } from '@/hooks/useCapability';
import { CanvasErrorBoundary } from './CanvasErrorBoundary';
import { SceneLoader } from './SceneLoader';
import { cn } from '@/lib/utils/format';

interface CanvasShellProps {
  /** The 3D scene graph (R3F components) to render inside the canvas. */
  children: ReactNode;
  /** Accessible non-3D content shown when WebGL is unavailable / errors. */
  fallback: ReactNode;
  /** Optional loading label while assets stream in. */
  loaderLabel?: string;
  /** Optional custom Suspense fallback (overrides the default SceneLoader). */
  suspenseFallback?: ReactNode;
  className?: string;
  /** Force a static (no continuous render loop) frameloop when idle. */
  frameloop?: 'always' | 'demand';
}

/**
 * The single entry point for every 3D surface in the app.
 *
 * Responsibilities:
 *  - Reads device capability and renders the HTML fallback on the 'fallback'
 *    tier (or before the client capability check resolves) — the canvas never
 *    mounts on unsupported devices or during SSR.
 *  - Caps DPR per the capability report to protect low-end GPUs.
 *  - Wraps the scene in an error boundary + Suspense loader so failures and
 *    loads degrade gracefully.
 *
 * Individual scenes (hero, showroom, vehicle viewer) are composed as children
 * in their respective phases — this shell stays scene-agnostic.
 */
/**
 * Hoisted so its identity never changes between renders: R3F re-applies the
 * `camera` prop when it does, which would stomp on any fov a scene's own rig
 * has set for the current frame shape.
 */
const DEFAULT_CAMERA = { position: [0, 1.4, 6], fov: 45 } as const;

export function CanvasShell({
  children,
  fallback,
  loaderLabel,
  suspenseFallback,
  className,
  frameloop = 'always',
}: CanvasShellProps) {
  const { report, ready } = useCapability();

  // Until the client-side capability check resolves, or on the fallback tier,
  // present the accessible non-3D experience.
  if (!ready || report.tier === 'fallback') {
    return <>{fallback}</>;
  }

  return (
    <div className={cn('relative h-full w-full', className)}>
      <CanvasErrorBoundary fallback={fallback}>
        <Suspense fallback={suspenseFallback ?? <SceneLoader label={loaderLabel} />}>
          <Canvas
            frameloop={frameloop}
            dpr={[1, report.recommendedDpr]}
            gl={{
              antialias: report.tier === 'full',
              powerPreference: 'high-performance',
              // Filmic tone mapping is what keeps bright emissives and metallic
              // highlights from clipping to flat white — it reads as cinematic
              // rather than raw WebGL.
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.05,
            }}
            camera={DEFAULT_CAMERA}
          >
            {children}
          </Canvas>
        </Suspense>
      </CanvasErrorBoundary>
    </div>
  );
}
