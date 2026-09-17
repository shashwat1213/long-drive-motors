'use client';

import { useRef, type MutableRefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { sampleHeroCamera } from './heroShots';

/**
 * Interpolates the default camera along the hero shot spline based on a shared
 * scroll-progress proxy (mutated by GSAP outside React, so the render loop is
 * decoupled from React state). Smooths with per-frame damping for cinematic,
 * non-linear motion, and adds a very subtle idle drift for life.
 *
 * When `enabled` is false (reduced motion), it snaps once to `staticProgress`
 * and stops updating — a calm, static hero composition.
 */
export function CameraRig({
  progressRef,
  enabled,
  staticProgress = 0.82,
}: {
  progressRef: MutableRefObject<{ value: number }>;
  enabled: boolean;
  staticProgress?: number;
}) {
  const { camera } = useThree();
  const desiredPos = useRef(new THREE.Vector3());
  const desiredTarget = useRef(new THREE.Vector3());
  const currentTarget = useRef(new THREE.Vector3(0, 0.9, 0));
  const snapped = useRef(false);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    const progress = enabled ? progressRef.current.value : staticProgress;
    sampleHeroCamera(progress, desiredPos.current, desiredTarget.current);

    elapsed.current += delta;
    if (enabled) {
      // Subtle idle drift — barely perceptible, adds life without motion sickness.
      const drift = Math.sin(elapsed.current * 0.3) * 0.06;
      desiredPos.current.y += drift;
      desiredPos.current.x += Math.cos(elapsed.current * 0.22) * 0.05;
    }

    if (!snapped.current) {
      // Avoid a first-frame pop from the canvas default camera.
      camera.position.copy(desiredPos.current);
      currentTarget.current.copy(desiredTarget.current);
      snapped.current = true;
    } else {
      const damp = enabled ? 1 - Math.pow(0.0016, delta) : 1 - Math.pow(0.02, delta);
      camera.position.lerp(desiredPos.current, damp);
      currentTarget.current.lerp(desiredTarget.current, damp);
    }

    camera.lookAt(currentTarget.current);
  });

  return null;
}
