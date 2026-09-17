'use client';

import { useEffect, useRef, type MutableRefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  LANDSCAPE_FOV,
  PORTRAIT_ASPECT_MAX,
  PORTRAIT_FOV,
  sampleHeroCamera,
  samplePortraitCamera,
} from './heroShots';

/**
 * Interpolates the default camera along the hero shot spline based on a shared
 * scroll-progress proxy (mutated by GSAP outside React, so the render loop is
 * decoupled from React state). Smooths with per-frame damping for cinematic,
 * non-linear motion, and adds a very subtle idle drift for life.
 *
 * Tall frames run the portrait sequence at a wider vertical FOV, solved against
 * the live aspect ratio — see `heroShots.ts` for why a phone gets its own shots
 * rather than a squeezed version of the landscape ones.
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
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const desiredPos = useRef(new THREE.Vector3());
  const desiredTarget = useRef(new THREE.Vector3());
  const currentTarget = useRef(new THREE.Vector3(0, 0.9, 0));
  const snapped = useRef(false);
  const elapsed = useRef(0);

  const aspect = size.height > 0 ? size.width / size.height : 1;
  // Inclusive, so this agrees exactly with the `tall` CSS breakpoint and the
  // GSAP media query, which are both inclusive maxima.
  const portrait = aspect <= PORTRAIT_ASPECT_MAX;

  // The two sequences are composed for different frames, so crossing the
  // threshold (a device rotating) re-cuts rather than sliding across the room.
  useEffect(() => {
    snapped.current = false;
  }, [portrait]);

  useFrame((_, delta) => {
    // Asserted every frame rather than in an effect: the canvas owns the
    // camera, and anything that re-applies its props would silently put the
    // landscape fov back on a portrait frame.
    const perspective = camera as THREE.PerspectiveCamera;
    const fov = portrait ? PORTRAIT_FOV : LANDSCAPE_FOV;
    if (perspective.isPerspectiveCamera && perspective.fov !== fov) {
      perspective.fov = fov;
      perspective.updateProjectionMatrix();
    }

    const progress = enabled ? progressRef.current.value : staticProgress;

    if (portrait) {
      samplePortraitCamera(progress, aspect, desiredPos.current, desiredTarget.current);
    } else {
      sampleHeroCamera(progress, desiredPos.current, desiredTarget.current);
    }

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
