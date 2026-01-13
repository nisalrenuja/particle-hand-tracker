/**
 * Particle Hand Tracker Component
 *
 * Main component that orchestrates hand tracking, gesture recognition,
 * and 3D particle visualization. Uses hooks and subcomponents for
 * clean separation of concerns.
 */

'use client';

import { useRef, useEffect } from 'react';
import Script from 'next/script';
import * as THREE from 'three';
import { useMediaPipeScripts } from '@/hooks/useMediaPipeScripts';
import { useHandTracking } from '@/hooks/useHandTracking';
import { useGestureDetection } from '@/hooks/useGestureDetection';
import { useThreeScene } from '@/hooks/useThreeScene';
import { useParticleSystem } from '@/hooks/useParticleSystem';
import { GestureRecognizer } from '@/services/GestureRecognizer';
import { StatusDisplay } from '@/components/ui/StatusDisplay';
import { GestureDisplay } from '@/components/ui/GestureDisplay';
import { PhysicsDisplay } from '@/components/ui/PhysicsDisplay';
import { CyberpunkBorder } from '@/components/ui/CyberpunkBorder';
import { VideoFeed } from '@/components/VideoFeed';
import { ThreeCanvas } from '@/components/ThreeCanvas';
import { LANDMARK_INDICES, ANIMATION_CONFIG } from '@/config/constants';

/**
 * ParticleHandTracker component
 *
 * Captures hand movements via webcam, recognizes gestures, and
 * displays reactive 3D particle effects that morph based on gestures.
 *
 * @example
 * ```tsx
 * <ParticleHandTracker />
 * ```
 */
export default function ParticleHandTracker() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Load MediaPipe scripts
  const { handsReady, cameraReady, onHandsLoad, onCameraLoad } = useMediaPipeScripts();

  // Initialize hand tracking
  const { landmarks, status } = useHandTracking(videoRef, handsReady, cameraReady);

  // Detect gestures from landmarks
  const { shape, displayName } = useGestureDetection(landmarks);

  // Initialize Three.js scene with custom animation callback
  const { scene } = useThreeScene(containerRef, (sceneInstance) => {
    // Custom animation logic for particle rotation based on hand position
    if (landmarks && particlesRef.current) {
      const recognizer = new GestureRecognizer(landmarks);
      const handCenter = recognizer.getHandCenter();

      if (shape === 'sphere') {
        // Hand controls rotation for sphere
        particlesRef.current.rotation.y = (handCenter.x - 0.5) * ANIMATION_CONFIG.HAND_ROTATION_MULTIPLIER;
        particlesRef.current.rotation.x = (handCenter.y - 0.5) * ANIMATION_CONFIG.HAND_ROTATION_MULTIPLIER;
      } else if (shape === 'scatter') {
        // Continuous rotation for scatter effect
        particlesRef.current.rotation.y += ANIMATION_CONFIG.SCATTER_ROTATION_INCREMENT;
        particlesRef.current.rotation.x += ANIMATION_CONFIG.SCATTER_ROTATION_INCREMENT;
      } else {
        // Smoothly return to neutral rotation for other shapes
        particlesRef.current.rotation.y = THREE.MathUtils.lerp(
          particlesRef.current.rotation.y,
          0,
          ANIMATION_CONFIG.ROTATION_LERP_FACTOR
        );
        particlesRef.current.rotation.x = THREE.MathUtils.lerp(
          particlesRef.current.rotation.x,
          0,
          ANIMATION_CONFIG.ROTATION_LERP_FACTOR
        );
      }
    }
  });

  // Initialize particle system
  const { particles, currentShape, particleCount } = useParticleSystem(scene, shape);
  const particlesRef = useRef<THREE.Points | null>(null);

  // Update particles ref when particles change
  useEffect(() => {
    particlesRef.current = particles;
  }, [particles]);

  return (
    <>
      {/* Load MediaPipe scripts */}
      <Script
        src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
        onLoad={onCameraLoad}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js"
        onLoad={onHandsLoad}
      />

      {/* Main container */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Video feed with overlay */}
        <VideoFeed videoRef={videoRef} isActive={cameraReady} />

        {/* Three.js canvas container */}
        <ThreeCanvas containerRef={containerRef} />

        {/* Cyberpunk decorative elements */}
        <CyberpunkBorder />

        {/* UI Overlays */}
        <div className="absolute top-10 left-10 font-mono text-cyan-400 select-none z-50">
          <StatusDisplay label="SYSTEM STATUS" value="ONLINE" />
          <div className="mt-4">
            <StatusDisplay
              label="PARTICLES"
              value={`${particleCount.toLocaleString()} UNITS`}
              subtitle="FPS: 60 | SECTOR 7"
            />
          </div>
        </div>

        <div className="absolute bottom-10 left-10 font-mono select-none z-50">
          <GestureDisplay gesture={displayName} />
        </div>

        <div className="absolute bottom-10 right-10 font-mono text-right select-none z-50">
          <PhysicsDisplay mode={currentShape} />
        </div>
      </div>
    </>
  );
}
