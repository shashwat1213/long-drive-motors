'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Procedural premium crossover, built from an extruded side profile rather than
 * stacked boxes — this is what gives it a real automotive silhouette (raked
 * windshield, tapering roofline, sloping hood) instead of reading as blocks.
 *
 * Isolated behind this single component on purpose: swapping in a licensed GLB
 * later means replacing this file's return with `useGLTF`, leaving the camera,
 * lighting, environment and scroll system untouched.
 *
 * Local axes: length along +Z (front at +Z), width along X, ground at y=0.
 */

interface VehicleModelProps {
  quality?: 'full' | 'reduced';
  idle?: boolean;
}

const PAINT = '#1b1f26';
const TRIM_DARK = '#0b0d11';
const RIM = '#c9ced6';
const TIRE = '#08090b';

/** Builds a width-centred extruded geometry from a side-profile shape. */
function extrude(shape: THREE.Shape, width: number, bevel: number): THREE.ExtrudeGeometry {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: width - bevel * 2,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 4,
    curveSegments: 24,
  });
  // Centre across the extrusion axis so the body straddles the centreline.
  geo.translate(0, 0, -(width - bevel * 2) / 2);
  geo.computeVertexNormals();
  return geo;
}

/** Lower body: rear fascia, beltline, sloping hood, front lip. */
function bodyShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-2.26, 0.44);
  s.lineTo(-2.3, 0.9);
  s.quadraticCurveTo(-2.28, 1.14, -2.0, 1.2);
  s.lineTo(0.2, 1.2);
  s.lineTo(1.58, 1.16);
  s.quadraticCurveTo(2.04, 1.1, 2.24, 0.94);
  s.lineTo(2.32, 0.66);
  s.quadraticCurveTo(2.34, 0.46, 2.12, 0.44);
  s.closePath();
  return s;
}

/** Greenhouse: C-pillar rake, roofline, A-pillar, windshield base. */
function glassShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-1.96, 1.15);
  s.quadraticCurveTo(-1.72, 1.21, -1.34, 1.6);
  s.lineTo(-0.2, 1.76);
  s.quadraticCurveTo(0.5, 1.76, 0.92, 1.48);
  s.quadraticCurveTo(1.2, 1.28, 1.3, 1.15);
  s.closePath();
  return s;
}

/** Roof panel following the greenhouse top edge. */
function roofShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-1.32, 1.61);
  s.lineTo(-0.2, 1.77);
  s.quadraticCurveTo(0.5, 1.77, 0.93, 1.49);
  s.lineTo(0.84, 1.38);
  s.quadraticCurveTo(0.45, 1.66, -0.22, 1.66);
  s.lineTo(-1.24, 1.51);
  s.closePath();
  return s;
}

function Wheel({ position, quality }: { position: [number, number, number]; quality: 'full' | 'reduced' }) {
  const seg = quality === 'full' ? 36 : 16;
  return (
    // Axle along X: rotate the cylinders (default axis Y) a quarter turn on Z.
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.43, 0.43, 0.26, seg]} />
        <meshStandardMaterial color={TIRE} roughness={0.95} metalness={0.02} />
      </mesh>
      {/* Rim barrel + face */}
      <mesh position={[0, 0.005, 0]}>
        <cylinderGeometry args={[0.29, 0.29, 0.27, seg]} />
        <meshStandardMaterial color="#15181d" metalness={0.9} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.135, 0]}>
        <cylinderGeometry args={[0.285, 0.285, 0.02, seg]} />
        <meshStandardMaterial color={RIM} metalness={1} roughness={0.24} />
      </mesh>
      <mesh position={[0, 0.152, 0]}>
        <cylinderGeometry args={[0.062, 0.062, 0.03, 14]} />
        <meshStandardMaterial color={RIM} metalness={1} roughness={0.18} />
      </mesh>
      {/* Brake disc + caliper read as depth behind the spokes */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.02, 20]} />
        <meshStandardMaterial color="#3a3f47" metalness={0.9} roughness={0.55} />
      </mesh>
      <mesh position={[0.09, 0.05, 0.08]}>
        <boxGeometry args={[0.06, 0.03, 0.11]} />
        <meshStandardMaterial color="#8e1420" metalness={0.5} roughness={0.5} />
      </mesh>
      {quality === 'full' &&
        Array.from({ length: 5 }).map((_, i) => (
          <mesh key={i} position={[0, 0.128, 0]} rotation={[0, (i / 5) * Math.PI * 2, 0]}>
            <boxGeometry args={[0.075, 0.024, 0.5]} />
            <meshStandardMaterial color={RIM} metalness={1} roughness={0.3} />
          </mesh>
        ))}
    </group>
  );
}

/** Dark satin arch flare that ties the wheel into the body. */
function WheelArch({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} rotation={[0, Math.PI / 2, 0]}>
      <torusGeometry args={[0.53, 0.055, 8, 22, Math.PI]} />
      <meshStandardMaterial color={TRIM_DARK} metalness={0.4} roughness={0.65} />
    </mesh>
  );
}

export function VehicleModel({ quality = 'full', idle = true }: VehicleModelProps) {
  const group = useRef<THREE.Group>(null);
  const width = 1.9;

  const geometries = useMemo(() => {
    const body = extrude(bodyShape(), width, 0.07);
    const glass = extrude(glassShape(), width - 0.14, 0.04);
    const roof = extrude(roofShape(), width - 0.08, 0.03);
    return { body, glass, roof };
  }, []);

  const materials = useMemo(() => {
    const paint = new THREE.MeshStandardMaterial({
      color: PAINT,
      metalness: 0.92,
      roughness: quality === 'full' ? 0.22 : 0.38,
      envMapIntensity: 1.35,
    });
    const glass = new THREE.MeshPhysicalMaterial({
      color: '#04060a',
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0,
      envMapIntensity: 2,
      transparent: true,
      opacity: 0.82,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
    });
    return { paint, glass };
  }, [quality]);

  // Dispose procedurally-created resources when the scene unmounts.
  useMemo(
    () => () => {
      Object.values(geometries).forEach((g) => g.dispose());
      Object.values(materials).forEach((m) => m.dispose());
    },
    [geometries, materials],
  );

  useFrame((_, delta) => {
    if (idle && group.current) group.current.rotation.y += delta * 0.035;
  });

  return (
    <group ref={group}>
      {/* Extruded shells are authored length-along-X, so rotate into length-along-Z. */}
      <group rotation={[0, -Math.PI / 2, 0]}>
        <mesh geometry={geometries.body} material={materials.paint} castShadow receiveShadow />
        <mesh geometry={geometries.glass} material={materials.glass} />
        <mesh geometry={geometries.roof} material={materials.paint} castShadow />
      </group>

      {/* Rocker / lower cladding */}
      <mesh position={[0, 0.5, -0.1]}>
        <boxGeometry args={[1.93, 0.14, 3.7]} />
        <meshStandardMaterial color={TRIM_DARK} metalness={0.45} roughness={0.7} />
      </mesh>

      {/* Beltline crease — a thin bright edge catches the key light down the flank */}
      {[0.96, -0.96].map((x) => (
        <mesh key={`crease-${x}`} position={[x, 1.06, -0.1]}>
          <boxGeometry args={[0.012, 0.035, 3.5]} />
          <meshStandardMaterial color="#454b55" metalness={1} roughness={0.3} />
        </mesh>
      ))}

      {/* Door shut lines */}
      {[0.955, -0.955].map((x) =>
        [0.35, -1.05].map((z) => (
          <mesh key={`door-${x}-${z}`} position={[x, 0.86, z]}>
            <boxGeometry args={[0.006, 0.62, 0.012]} />
            <meshStandardMaterial color="#05070a" roughness={0.9} />
          </mesh>
        )),
      )}

      <Wheel position={[0.9, 0.43, 1.45]} quality={quality} />
      <Wheel position={[-0.9, 0.43, 1.45]} quality={quality} />
      <Wheel position={[0.9, 0.43, -1.45]} quality={quality} />
      <Wheel position={[-0.9, 0.43, -1.45]} quality={quality} />

      <WheelArch position={[0.95, 0.43, 1.45]} />
      <WheelArch position={[-0.95, 0.43, 1.45]} />
      <WheelArch position={[0.95, 0.43, -1.45]} />
      <WheelArch position={[-0.95, 0.43, -1.45]} />

      {/* Grille + lower intake */}
      <mesh position={[0, 0.83, 2.3]}>
        <boxGeometry args={[1.32, 0.26, 0.06]} />
        <meshStandardMaterial color="#0a0c10" metalness={0.8} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.55, 2.28]}>
        <boxGeometry args={[1.62, 0.16, 0.05]} />
        <meshStandardMaterial color={TRIM_DARK} metalness={0.4} roughness={0.7} />
      </mesh>

      {/* Headlights — slim swept units */}
      {[0.66, -0.66].map((x) => (
        <mesh key={`hl-${x}`} position={[x, 1.0, 2.22]} rotation={[0, 0, x > 0 ? -0.08 : 0.08]}>
          <boxGeometry args={[0.46, 0.1, 0.1]} />
          <meshStandardMaterial
            color="#eef4ff"
            emissive="#dce9ff"
            emissiveIntensity={2.6}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Full-width taillight bar */}
      <mesh position={[0, 1.06, -2.28]}>
        <boxGeometry args={[1.62, 0.075, 0.06]} />
        <meshStandardMaterial
          color="#ff2b39"
          emissive="#e11d2a"
          emissiveIntensity={2.8}
          toneMapped={false}
        />
      </mesh>

      {/* Side mirrors: arm + housing */}
      {[1.0, -1.0].map((x) => (
        <group key={`mirror-${x}`} position={[x, 1.24, 0.82]}>
          <mesh position={[x > 0 ? 0.05 : -0.05, 0, 0]}>
            <boxGeometry args={[0.12, 0.035, 0.05]} />
            <meshStandardMaterial color={TRIM_DARK} metalness={0.6} roughness={0.5} />
          </mesh>
          <mesh position={[x > 0 ? 0.14 : -0.14, 0.02, 0]} rotation={[0, 0, 0.12]}>
            <boxGeometry args={[0.08, 0.09, 0.17]} />
            <meshStandardMaterial color={PAINT} metalness={0.9} roughness={0.25} />
          </mesh>
        </group>
      ))}

      {/* Roof rails */}
      {[0.62, -0.62].map((x) => (
        <mesh key={`rail-${x}`} position={[x, 1.79, -0.6]}>
          <boxGeometry args={[0.055, 0.03, 1.3]} />
          <meshStandardMaterial color="#2a2f37" metalness={0.9} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}
