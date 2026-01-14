import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { ShapeType } from '@/types/shapes';
import { PARTICLE_CONFIG, ANIMATION_CONFIG, SHAPE_COLORS } from '@/config/constants';
import { getSphereCoordinates, getScatterCoordinates } from '@/utils/geometry/shapeGenerators';
import { getTextCoordinates } from '@/utils/geometry/textRenderer';
import { lerpPositions, lerpColors } from '@/utils/math/interpolation';

interface UseParticleSystemResult {
  particles: THREE.Points | null;
  currentShape: ShapeType;
  setTargetShape: (shape: ShapeType) => void;
  particleCount: number;
}

export function useParticleSystem(
  scene: THREE.Scene | null,
  targetShape: string
): UseParticleSystemResult {
  const [currentShape, setCurrentShape] = useState<ShapeType>('sphere');
  const particlesRef = useRef<THREE.Points | null>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const materialRef = useRef<THREE.PointsMaterial | null>(null);
  const targetPositionsRef = useRef<THREE.Vector3[]>([]);
  const targetColorsRef = useRef<THREE.Color[]>([]);
  const animationIdRef = useRef<number | null>(null);

  // Shape coordinates (generated on client side only)
  const shapesRef = useRef<Record<string, THREE.Vector3[]> | null>(null);

  // Initialize particle system
  useEffect(() => {
    if (!scene) return;

    // Generate shape coordinates (client-side only)
    if (!shapesRef.current) {
      shapesRef.current = {
        sphere: getSphereCoordinates(PARTICLE_CONFIG.COUNT),
        hello: getTextCoordinates('Hello'),
        gemini: getTextCoordinates('Gemini'),
        'sinhala-great': getTextCoordinates('නියමයි'),
        'sinhala-hello': getTextCoordinates('ආයුබෝවන්'),
        scatter: getScatterCoordinates(PARTICLE_CONFIG.COUNT),
      };
    }

    // Create geometry
    const geometry = new THREE.BufferGeometry();
    geometryRef.current = geometry;

    const positions = new Float32Array(PARTICLE_CONFIG.COUNT * 3);
    const colors = new Float32Array(PARTICLE_CONFIG.COUNT * 3);

    // Initialize with random positions
    for (let i = 0; i < PARTICLE_CONFIG.COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
      colors[i * 3] = 0;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Create material
    const material = new THREE.PointsMaterial({
      size: PARTICLE_CONFIG.SIZE,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: PARTICLE_CONFIG.OPACITY,
    });
    materialRef.current = material;

    // Create particles
    const particles = new THREE.Points(geometry, material);
    particlesRef.current = particles;
    scene.add(particles);

    // Start animation loop
    startAnimation();

    // Cleanup
    return () => {
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
      }

      if (geometryRef.current) {
        geometryRef.current.dispose();
      }

      if (materialRef.current) {
        materialRef.current.dispose();
      }

      if (particlesRef.current && scene) {
        scene.remove(particlesRef.current);
      }
    };
  }, [scene]);

  // Update target shape when it changes
  useEffect(() => {
    if (!targetShape) return;
    updateTargetShape(targetShape as ShapeType);
  }, [targetShape]);

  /**
   * Updates the target shape for particle morphing
   */
  const updateTargetShape = (shapeKey: ShapeType): void => {
    if (!shapesRef.current) return;

    setCurrentShape(shapeKey);

    let newTargets = shapesRef.current[shapeKey] || shapesRef.current.sphere;
    const newColor = SHAPE_COLORS[shapeKey] || new THREE.Color(1, 1, 1);

    // Regenerate scatter for dynamic effect
    if (shapeKey === 'scatter') {
      newTargets = getScatterCoordinates(PARTICLE_CONFIG.COUNT);
    }

    // Set target positions and colors
    targetPositionsRef.current = [];
    targetColorsRef.current = [];

    for (let i = 0; i < PARTICLE_CONFIG.COUNT; i++) {
      targetPositionsRef.current.push(newTargets[i % newTargets.length]);
      targetColorsRef.current.push(newColor);
    }
  };

  /**
   * Starts the particle animation loop
   */
  const startAnimation = (): void => {
    const animate = (): void => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (!geometryRef.current || targetPositionsRef.current.length === 0) return;

      const positionsArray = geometryRef.current.attributes.position
        .array as Float32Array;
      const colorsArray = geometryRef.current.attributes.color.array as Float32Array;

      // Determine lerp factor based on current shape
      const posLerpFactor =
        currentShape === 'scatter'
          ? ANIMATION_CONFIG.SCATTER_LERP_FACTOR
          : ANIMATION_CONFIG.DEFAULT_LERP_FACTOR;

      // Animate positions
      lerpPositions(positionsArray, targetPositionsRef.current, posLerpFactor);

      // Animate colors
      if (targetColorsRef.current.length > 0) {
        lerpColors(
          colorsArray,
          targetColorsRef.current,
          ANIMATION_CONFIG.COLOR_LERP_FACTOR
        );
      }

      // Mark for update
      geometryRef.current.attributes.position.needsUpdate = true;
      geometryRef.current.attributes.color.needsUpdate = true;
    };

    animate();
  };

  return {
    particles: particlesRef.current,
    currentShape,
    setTargetShape: updateTargetShape,
    particleCount: PARTICLE_CONFIG.COUNT,
  };
}

export {};
