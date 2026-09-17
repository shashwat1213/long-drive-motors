'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**
 * A restrained luxury-studio environment: polished dark floor, a lit turntable
 * stage, structural columns, backlit wall panels, ceiling strips and soft light
 * shafts. Deliberately small — it frames the vehicle rather than competing
 * with it, and everything expensive is gated behind the 'full' quality tier.
 */

interface EnvironmentProps {
  quality?: 'full' | 'reduced';
  /** Enables slow atmospheric drift (dust, shaft shimmer). */
  idle?: boolean;
}

const WALL = '#0a0c10';
const COLUMN = '#12151b';
const STAGE_RADIUS = 3.8;

/** Soft cone of light under each ceiling strip. Additive and very faint. */
function LightShaft({ position, color = '#ffffff' }: { position: [number, number, number]; color?: string }) {
  return (
    <mesh position={position} rotation={[Math.PI, 0, 0]}>
      <coneGeometry args={[2.4, 7, 24, 1, true]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.045}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/** Slow-drifting motes that give the air some depth. Cheap: one draw call. */
function DustMotes({ idle }: { idle: boolean }) {
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const count = 220;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = Math.random() * 6 + 0.3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state, delta) => {
    if (!idle || !points.current) return;
    points.current.rotation.y += delta * 0.012;
    points.current.position.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.12;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={0.022}
        color="#ffffff"
        transparent
        opacity={0.28}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export function ShowroomEnvironment({ quality = 'full', idle = true }: EnvironmentProps) {
  const full = quality === 'full';

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[70, 70]} />
        {full ? (
          <MeshReflectorMaterial
            resolution={512}
            mirror={0.6}
            mixBlur={7}
            mixStrength={1.4}
            blur={[320, 110]}
            roughness={0.82}
            depthScale={0.9}
            minDepthThreshold={0.3}
            maxDepthThreshold={1.3}
            color="#090a0d"
            metalness={0.65}
          />
        ) : (
          <meshStandardMaterial color="#090a0d" metalness={0.45} roughness={0.55} />
        )}
      </mesh>

      {/* Turntable stage — grounds the vehicle and gives the shot a focal plinth */}
      <mesh position={[0, 0.015, 0]} receiveShadow>
        <cylinderGeometry args={[STAGE_RADIUS, STAGE_RADIUS, 0.03, 64]} />
        <meshStandardMaterial color="#0d0f14" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[STAGE_RADIUS - 0.045, STAGE_RADIUS, 64]} />
        <meshStandardMaterial
          color="#e11d2a"
          emissive="#e11d2a"
          emissiveIntensity={2.2}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Rear glass backdrop */}
      <mesh position={[0, 4.5, -11]}>
        <planeGeometry args={[46, 11]} />
        <meshStandardMaterial
          color={WALL}
          metalness={0.35}
          roughness={0.08}
          transparent
          opacity={0.55}
          envMapIntensity={1.4}
        />
      </mesh>

      {/* Backlit wall panels — quiet architectural rhythm behind the car */}
      {[-7.5, -2.5, 2.5, 7.5].map((x) => (
        <mesh key={`panel-${x}`} position={[x, 3.4, -10.8]}>
          <planeGeometry args={[3.2, 5.2]} />
          <meshStandardMaterial
            color="#20242c"
            emissive="#5b6070"
            emissiveIntensity={0.35}
            roughness={0.6}
          />
        </mesh>
      ))}

      {/* Side walls */}
      <mesh position={[-16, 4.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[46, 11]} />
        <meshStandardMaterial color={WALL} metalness={0.2} roughness={0.7} />
      </mesh>
      <mesh position={[16, 4.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[46, 11]} />
        <meshStandardMaterial color={WALL} metalness={0.2} roughness={0.7} />
      </mesh>

      {/* Structural columns down both flanks */}
      {[-10, -3, 4, 11].map((z) =>
        [-10.5, 10.5].map((x) => (
          <mesh key={`col-${x}-${z}`} position={[x, 3.5, z]} castShadow>
            <boxGeometry args={[0.55, 7, 0.55]} />
            <meshStandardMaterial color={COLUMN} metalness={0.45} roughness={0.45} />
          </mesh>
        )),
      )}

      {/* Ceiling light strips */}
      {[-4, 0, 4].map((x) => (
        <mesh key={`strip-${x}`} position={[x, 7, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.55, 18]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={1.8}
            toneMapped={false}
          />
        </mesh>
      ))}

      {full && (
        <>
          <LightShaft position={[0, 3.5, 0]} />
          <LightShaft position={[-4.5, 3.5, -3]} />
          <LightShaft position={[4.5, 3.5, 3]} color="#ffd9dc" />
          <DustMotes idle={idle} />
        </>
      )}
    </group>
  );
}
