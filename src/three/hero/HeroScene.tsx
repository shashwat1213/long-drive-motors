'use client';

import { useEffect, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { VehicleModel } from './VehicleModel';
import { ShowroomEnvironment } from './ShowroomEnvironment';
import { CameraRig } from './CameraRig';

interface HeroSceneProps {
  progressRef: MutableRefObject<{ value: number }>;
  quality: 'full' | 'reduced';
  /** Drives the scroll-linked camera rig. */
  cameraEnabled: boolean;
  /** Enables idle micro-animation (slow vehicle turn, breathing accent light). */
  idle: boolean;
  onReady?: () => void;
}

/** Slowly breathing red accent light — subtle environmental motion. */
function AccentLight({ enabled }: { enabled: boolean }) {
  const light = useRef<THREE.PointLight>(null);
  useFrame(() => {
    if (!enabled || !light.current) return;
    light.current.intensity = 18 + Math.sin(performance.now() * 0.0006) * 6;
  });
  return (
    <pointLight
      ref={light}
      position={[-4, 2.2, 3.5]}
      color="#e11d2a"
      intensity={18}
      distance={16}
      decay={2}
    />
  );
}

export function HeroScene({ progressRef, quality, cameraEnabled, idle, onReady }: HeroSceneProps) {
  useEffect(() => {
    // Procedural scene has no async assets; signal ready on next tick so the
    // branded loader can cross-fade out smoothly.
    const id = requestAnimationFrame(() => onReady?.());
    return () => cancelAnimationFrame(id);
  }, [onReady]);

  return (
    <>
      <color attach="background" args={['#07080a']} />
      <fog attach="fog" args={['#07080a', 14, 34]} />

      <CameraRig progressRef={progressRef} enabled={cameraEnabled} />

      {/* Base lighting */}
      <hemisphereLight args={['#cfd6e6', '#0a0b0e', 0.5]} />
      <ambientLight intensity={0.15} />

      {/* Key light */}
      <directionalLight position={[6, 9, 6]} intensity={2.2} color="#ffffff" />
      {/* Cool rim / back light separates the roofline from the dark backdrop */}
      <directionalLight position={[-6, 4, -8]} intensity={1.4} color="#9fb4ff" />
      {/* Warm fill */}
      <directionalLight position={[0, 3, 10]} intensity={0.5} color="#fff1e6" />
      {/* Overhead strip bounce, tight to the roof */}
      <spotLight
        position={[0, 7.5, 0]}
        angle={0.7}
        penumbra={1}
        intensity={35}
        distance={16}
        color="#e9f0ff"
      />
      {/* Headlight spill onto the floor ahead of the vehicle */}
      <pointLight position={[0, 0.7, 3.4]} color="#cfe0ff" intensity={6} distance={6} decay={2} />

      <AccentLight enabled={idle} />

      {/* Procedural studio reflections (no external HDRI download). */}
      <Environment resolution={quality === 'full' ? 256 : 128}>
        <Lightformer
          form="rect"
          intensity={3}
          color="#ffffff"
          position={[0, 6, 2]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[10, 6, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.4}
          color="#aec2ff"
          position={[-6, 3, -4]}
          rotation={[0, Math.PI / 3, 0]}
          scale={[6, 4, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.2}
          color="#e11d2a"
          position={[6, 2, 4]}
          rotation={[0, -Math.PI / 3, 0]}
          scale={[5, 3, 1]}
        />
      </Environment>

      <ShowroomEnvironment quality={quality} idle={idle} />

      {/*
        The vehicle only turns when the camera is parked (showroom turntable).
        During the scroll sequence the camera does the work — rotating both at
        once drags the subject out of frame on the close-up shots.
      */}
      <VehicleModel quality={quality} idle={idle && !cameraEnabled} />

      {/* Soft grounded contact shadow (cheaper + cleaner than full shadow maps). */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.6}
        scale={14}
        blur={2.6}
        far={6}
        resolution={quality === 'full' ? 1024 : 512}
        color="#000000"
      />
    </>
  );
}
