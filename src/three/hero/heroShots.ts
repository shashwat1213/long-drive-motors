import * as THREE from 'three';

/**
 * Cinematic camera keyframes for the scroll-driven hero sequence.
 *
 * There are two shot lists, because a phone is not a narrow desktop.
 *
 *  - `heroShots` — the landscape sequence. Six composed shots, sampled by a
 *    0..1 scroll progress value. Authored against a 16:9 frame.
 *  - `heroShotsPortrait` — a separately composed sequence for tall frames.
 *
 * A perspective camera's `fov` is vertical, so horizontal coverage collapses as
 * the frame narrows: the landscape shots span 16.5m across at 16:9 but only
 * 4.3m on a 390x844 phone. The vehicle is 4.6m long, so every landscape shot
 * crops badly in portrait — the close-up pushes the car off-frame entirely.
 * Dollying back to compensate is not an option either: matching 16:9 coverage
 * on a phone needs ~3.8x the distance, which puts the establishing shot outside
 * the showroom walls and deep into the fog.
 *
 * So portrait shots are specified by intent rather than by position: where the
 * camera is looking from, how much of the world the frame should span, and
 * where the subject sits in the frame. Distance is solved per-device from the
 * real aspect ratio, which keeps the framing identical from a 375x667 SE to a
 * 9:20 Android to an iPad held upright.
 *
 * The vehicle is centred at the origin, length along +Z, roughly 4.6m long,
 * 1.9m wide and 1.77m tall.
 */

export interface CameraShot {
  /** Camera world position. */
  position: [number, number, number];
  /** Point the camera looks at. */
  target: [number, number, number];
}

/** Landscape sequence — the reference composition. Unchanged. */
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

/** A portrait shot, described by framing intent instead of a fixed position. */
export interface FramedShot {
  /** The point on the vehicle the shot is about. */
  focus: [number, number, number];
  /** Orbit angle in degrees: 0 looks down the nose (+Z), 90 is broadside. */
  azimuth: number;
  /** Orbit angle in degrees above the horizon. */
  elevation: number;
  /** How many metres the frame spans horizontally at the focus. */
  coverage: number;
  /** Where the focus sits vertically, in clip space: 0 centred, 0.3 high. */
  lift: number;
}

/** Vertical FOV used for portrait frames — wider than landscape's 45°. */
export const PORTRAIT_FOV = 60;

/** Vertical FOV for landscape frames (matches the CanvasShell default). */
export const LANDSCAPE_FOV = 45;

/**
 * Frames at or below this aspect run the portrait sequence. A 1024px-wide
 * desktop window would have to be at least 1078px tall to reach it, so ordinary
 * landscape rendering is untouched.
 */
export const PORTRAIT_ASPECT_MAX = 0.95;

/**
 * Portrait sequence. A car is a wide subject on a tall screen, so it can only
 * ever occupy a horizontal band — these shots make that band deliberate:
 * the vehicle fills roughly three-quarters of the width on the wide shots,
 * with the showroom floor and ceiling filling the space above and below,
 * and the detail shots crop on purpose rather than by accident.
 */
export const heroShotsPortrait: FramedShot[] = [
  // 01 — wide establishing: the whole vehicle, centred, room to breathe
  { focus: [0, 0.85, 0], azimuth: 34, elevation: 14, coverage: 5.8, lift: 0.1 },
  // 02 — push in on the front three-quarter
  { focus: [0, 0.85, 0.45], azimuth: 27, elevation: 11, coverage: 4.9, lift: 0.1 },
  // 03 — around the front quarter panel
  { focus: [0.35, 0.8, 1.25], azimuth: 31, elevation: 8, coverage: 3.3, lift: 0.06 },
  // 04 — headlight and wheel, close
  { focus: [0.8, 0.55, 1.9], azimuth: 36, elevation: 5, coverage: 1.8, lift: 0.1 },
  // 05 — pass across the flank
  { focus: [0, 0.88, 0.05], azimuth: 74, elevation: 9, coverage: 4.2, lift: 0.08 },
  // 06 — pull back and lift the vehicle into the top half, clearing the lower
  //      third of the frame for the headline that fades in here
  { focus: [0, 0.95, 0], azimuth: 30, elevation: 16, coverage: 5.9, lift: 0.34 },
];

// Reusable temporaries to avoid per-frame allocation.
const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();
const tmpTA = new THREE.Vector3();
const tmpTB = new THREE.Vector3();
const tmpFocus = new THREE.Vector3();
const tmpFocusB = new THREE.Vector3();

/** Smoothstep easing for premium, non-linear transitions between shots. */
function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

/** Resolves progress to a shot pair plus the eased blend between them. */
function segment(progress: number, count: number): { index: number; local: number } {
  const p = THREE.MathUtils.clamp(progress, 0, 1);
  const segments = count - 1;
  const scaled = p * segments;
  const index = Math.min(Math.floor(scaled), segments - 1);
  return { index, local: smooth(scaled - index) };
}

/**
 * Samples position + target along the landscape shot list for a given progress
 * (0..1), writing results into the provided vectors (no allocation).
 */
export function sampleHeroCamera(
  progress: number,
  outPosition: THREE.Vector3,
  outTarget: THREE.Vector3,
): void {
  const { index, local } = segment(progress, heroShots.length);
  const a = heroShots[index]!;
  const b = heroShots[index + 1]!;

  tmpA.set(...a.position);
  tmpB.set(...b.position);
  outPosition.copy(tmpA).lerp(tmpB, local);

  tmpTA.set(...a.target);
  tmpTB.set(...b.target);
  outTarget.copy(tmpTA).lerp(tmpTB, local);
}

/**
 * Samples the portrait sequence. Blends the framing intent between shots, then
 * solves the camera position for the viewport's actual aspect ratio — so the
 * vehicle lands in the same place in frame on every phone.
 */
export function samplePortraitCamera(
  progress: number,
  aspect: number,
  outPosition: THREE.Vector3,
  outTarget: THREE.Vector3,
): void {
  const { index, local } = segment(progress, heroShotsPortrait.length);
  const a = heroShotsPortrait[index]!;
  const b = heroShotsPortrait[index + 1]!;

  const lerp = THREE.MathUtils.lerp;
  tmpFocus.set(...a.focus).lerp(tmpFocusB.set(...b.focus), local);
  const azimuth = lerp(a.azimuth, b.azimuth, local);
  const elevation = lerp(a.elevation, b.elevation, local);
  const coverage = lerp(a.coverage, b.coverage, local);
  const lift = lerp(a.lift, b.lift, local);

  // Horizontal half-angle of the frame, from the vertical FOV and the aspect.
  const tanHalfH = Math.tan(THREE.MathUtils.degToRad(PORTRAIT_FOV) / 2) * aspect;
  const distance = coverage / (2 * tanHalfH);

  const az = THREE.MathUtils.degToRad(azimuth);
  const el = THREE.MathUtils.degToRad(elevation);
  const ground = distance * Math.cos(el);
  outPosition.set(
    tmpFocus.x + ground * Math.sin(az),
    tmpFocus.y + distance * Math.sin(el),
    tmpFocus.z + ground * Math.cos(az),
  );

  // Aiming below the focus pitches it up the frame. Expressed against the
  // frame's own height so the composition holds on any portrait aspect.
  const coverageHeight = coverage / aspect;
  outTarget.set(tmpFocus.x, tmpFocus.y - (lift * coverageHeight) / 2, tmpFocus.z);
}
