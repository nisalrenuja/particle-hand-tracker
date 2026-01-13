/**
 * Three.js Scene Hook
 *
 * Manages Three.js scene setup, renderer initialization, and animation loop.
 * Handles window resizing and cleanup.
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SCENE_CONFIG, STARFIELD_CONFIG } from '@/config/constants';

/**
 * Hook return value
 */
interface UseThreeSceneResult {
  /** Three.js scene instance */
  scene: THREE.Scene | null;
  /** Three.js camera instance */
  camera: THREE.PerspectiveCamera | null;
  /** Three.js renderer instance */
  renderer: THREE.WebGLRenderer | null;
  /** Animation frame ID for cleanup */
  animationId: number | null;
}

/**
 * Initializes and manages a Three.js scene
 *
 * Sets up the scene, camera, renderer, and background starfield.
 * Handles window resizing and provides cleanup.
 *
 * @param containerRef - React ref to the container div
 * @param onAnimate - Optional callback invoked each animation frame
 * @returns Scene, camera, renderer instances
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * const { scene, camera, renderer } = useThreeScene(containerRef, () => {
 *   // Custom animation logic
 * });
 * ```
 */
export function useThreeScene(
  containerRef: React.RefObject<HTMLDivElement | null>,
  onAnimate?: (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => void
): UseThreeSceneResult {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const starFieldRef = useRef<THREE.Points | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    try {
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Camera setup
      const camera = new THREE.PerspectiveCamera(
        SCENE_CONFIG.CAMERA_FOV,
        window.innerWidth / window.innerHeight,
        SCENE_CONFIG.CAMERA_NEAR,
        SCENE_CONFIG.CAMERA_FAR
      );
      camera.position.z = SCENE_CONFIG.CAMERA_Z_POSITION;
      cameraRef.current = camera;

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(SCENE_CONFIG.CLEAR_COLOR, SCENE_CONFIG.CLEAR_ALPHA);
      renderer.domElement.className =
        'absolute top-0 left-0 w-full h-full pointer-events-none z-40';
      rendererRef.current = renderer;

      containerRef.current.appendChild(renderer.domElement);

      // Create background starfield
      const starField = createStarfield();
      scene.add(starField);
      starFieldRef.current = starField;

      // Animation loop
      const animate = (): void => {
        animationIdRef.current = requestAnimationFrame(animate);

        // Rotate starfield
        if (starFieldRef.current) {
          starFieldRef.current.rotation.y += STARFIELD_CONFIG.ROTATION_Y_SPEED;
          starFieldRef.current.rotation.x += STARFIELD_CONFIG.ROTATION_X_SPEED;
        }

        // Call custom animation callback
        if (onAnimate) {
          onAnimate(scene, camera);
        }

        renderer.render(scene, camera);
      };

      animate();

      // Window resize handler
      const handleResize = (): void => {
        if (!containerRef.current) return;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);

        if (animationIdRef.current !== null) {
          cancelAnimationFrame(animationIdRef.current);
        }

        // Dispose Three.js resources
        if (starFieldRef.current) {
          starFieldRef.current.geometry.dispose();
          (starFieldRef.current.material as THREE.Material).dispose();
        }

        if (rendererRef.current) {
          rendererRef.current.dispose();
          if (containerRef.current && rendererRef.current.domElement) {
            containerRef.current.removeChild(rendererRef.current.domElement);
          }
        }
      };
    } catch (error) {
      console.error('Failed to initialize Three.js scene:', error);
      return;
    }
  }, [containerRef, onAnimate]);

  return {
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current,
    animationId: animationIdRef.current,
  };
}

/**
 * Creates a starfield background
 *
 * @returns Three.js Points object representing stars
 */
function createStarfield(): THREE.Points {
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(STARFIELD_CONFIG.COUNT * 3);

  for (let i = 0; i < STARFIELD_CONFIG.COUNT; i++) {
    const range = STARFIELD_CONFIG.RANGE;
    starPos[i * 3] = (Math.random() - 0.5) * range;
    starPos[i * 3 + 1] = (Math.random() - 0.5) * range;
    starPos[i * 3 + 2] = (Math.random() - 0.5) * range;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));

  const starMat = new THREE.PointsMaterial({
    size: STARFIELD_CONFIG.SIZE,
    color: STARFIELD_CONFIG.COLOR,
    transparent: true,
    opacity: STARFIELD_CONFIG.OPACITY,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(starGeo, starMat);
}

export {};
