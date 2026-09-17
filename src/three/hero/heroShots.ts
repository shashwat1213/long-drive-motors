import * as THREE from 'three';

/**
 * Cinematic camera keyframes for the scroll-driven hero sequence.
 * Six composed shots, sampled by a 0..1 scroll progress value. The vehicle is
 * centred at the origin, length along +Z, roughly 4.6m long and 1.7m tall.
 */

export interface CameraShot {
  /** Camera world position. */
  position: [number, number, number];
  /** Point the camera looks at. */
  target: [number, number, number];
}

export const heroShots: CameraShot[] = [
  // 01 — wide establishing
  { position: [7.4, 2.7, 8.2], target: [0, 0.8, 0] },
  // 02 — slow push toward the vehicle, front 3/4
  { position: [4.8, 1.9, 5.6], target: [0, 0.9, 0.4] },
  // 03 — around the front quarter panel
  { position: [3.3, 1.25, 3.7], target: [0.4, 0.8, 1.4] },
  // 04 — down toward wheel / headlight detail
  { position: [2.5, 0.85, 2.7], target: [0.85, 0.55, 1.9] },
  // 05 — across the vehicle side
  { position: [4.4, 1.35, -0.6], target: [0, 0.85, 0.2] },
  // 06 — pull back into the hero composition
  { position: [6.4, 2.3, 6.6], target: [0, 0.95, 0] },
];

// Reusable temporaries to avoid per-frame allocation.
const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();
const tmpTA = new THREE.Vector3();
const tmpTB = new THREE.Vector3();

/** Smoothstep easing for premium, non-linear transitions between shots. */
function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

/**
 * Samples position + target along the shot list for a given progress (0..1),
 * writing results into the provided vectors (no allocation).
 */
export function sampleHeroCamera(
  progress: number,
  outPosition: THREE.Vector3,
  outTarget: THREE.Vector3,
): void {
  const p = THREE.MathUtils.clamp(progress, 0, 1);
  const segments = heroShots.length - 1;
  const scaled = p * segments;
  const index = Math.min(Math.floor(scaled), segments - 1);
  const local = smooth(scaled - index);

  const a = heroShots[index]!;
  const b = heroShots[index + 1]!;

  tmpA.set(...a.position);
  tmpB.set(...b.position);
  outPosition.copy(tmpA).lerp(tmpB, local);

  tmpTA.set(...a.target);
  tmpTB.set(...b.target);
  outTarget.copy(tmpTA).lerp(tmpTB, local);
}
