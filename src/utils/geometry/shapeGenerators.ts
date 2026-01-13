/**
 * Shape Generation Utilities
 *
 * Generates particle coordinates for various 3D shapes including
 * spheres, scatter effects, and other geometric formations.
 */

import * as THREE from 'three';
import { SHAPE_CONFIG } from '@/config/constants';

/**
 * Generates evenly distributed points on a sphere using the Golden Spiral algorithm
 *
 * Uses the Fibonacci sphere algorithm to create a uniform distribution
 * of points on a sphere surface, avoiding clustering at poles.
 *
 * @param count - Number of points to generate
 * @param radius - Radius of the sphere
 * @returns Array of 3D coordinates on the sphere surface
 *
 * @example
 * ```ts
 * const spherePoints = getSphereCoordinates(10000, 30);
 * // Returns 10,000 evenly distributed points on a sphere of radius 30
 * ```
 */
export function getSphereCoordinates(
  count: number,
  radius: number = SHAPE_CONFIG.SPHERE_RADIUS
): THREE.Vector3[] {
  const coords: THREE.Vector3[] = [];

  for (let i = 0; i < count; i++) {
    // Golden ratio-based angle for even distribution
    const phi = Math.acos(-1 + (2 * i) / count);
    const theta = Math.sqrt(count * Math.PI) * phi;

    // Convert spherical coordinates to Cartesian
    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);

    coords.push(new THREE.Vector3(x, y, z));
  }

  return coords;
}

/**
 * Generates random scatter coordinates for explosion/blast effects
 *
 * Creates particles randomly distributed in a cubic volume,
 * useful for creating dynamic scatter/explosion effects.
 *
 * @param count - Number of points to generate
 * @param range - Half-width of the cubic volume (default from config)
 * @returns Array of randomly positioned 3D coordinates
 *
 * @example
 * ```ts
 * const scatterPoints = getScatterCoordinates(10000);
 * // Returns 10,000 randomly scattered points in a 300x300x300 volume
 * ```
 */
export function getScatterCoordinates(
  count: number,
  range: number = SHAPE_CONFIG.SCATTER_RANGE
): THREE.Vector3[] {
  const coords: THREE.Vector3[] = [];

  for (let i = 0; i < count; i++) {
    // Random position in cubic volume
    const x = (Math.random() - 0.5) * range;
    const y = (Math.random() - 0.5) * range;
    const z = (Math.random() - 0.5) * range;

    coords.push(new THREE.Vector3(x, y, z));
  }

  return coords;
}

/**
 * Generates random initial positions for particles
 *
 * Creates initial particle positions scattered in a volume,
 * used when first initializing the particle system.
 *
 * @param count - Number of particles
 * @param range - Half-width of distribution range
 * @returns Array of initial particle positions
 */
export function getInitialParticlePositions(
  count: number,
  range: number = 100
): THREE.Vector3[] {
  return getScatterCoordinates(count, range);
}

/**
 * Generates coordinates for a cube shape
 *
 * Creates particles arranged on the surface of a cube.
 *
 * @param count - Target number of points (actual count may vary)
 * @param size - Half-width of the cube
 * @returns Array of 3D coordinates on cube surface
 */
export function getCubeCoordinates(count: number, size: number = 40): THREE.Vector3[] {
  const coords: THREE.Vector3[] = [];
  const pointsPerFace = Math.floor(count / 6);
  const pointsPerSide = Math.ceil(Math.sqrt(pointsPerFace));

  // Generate points on each face of the cube
  for (let face = 0; face < 6; face++) {
    for (let i = 0; i < pointsPerSide; i++) {
      for (let j = 0; j < pointsPerSide; j++) {
        const u = (i / (pointsPerSide - 1)) * 2 - 1; // -1 to 1
        const v = (j / (pointsPerSide - 1)) * 2 - 1; // -1 to 1

        let x: number, y: number, z: number;

        // Position based on which face we're generating
        switch (face) {
          case 0: // Front
            [x, y, z] = [u * size, v * size, size];
            break;
          case 1: // Back
            [x, y, z] = [u * size, v * size, -size];
            break;
          case 2: // Top
            [x, y, z] = [u * size, size, v * size];
            break;
          case 3: // Bottom
            [x, y, z] = [u * size, -size, v * size];
            break;
          case 4: // Right
            [x, y, z] = [size, u * size, v * size];
            break;
          case 5: // Left
            [x, y, z] = [-size, u * size, v * size];
            break;
          default:
            [x, y, z] = [0, 0, 0];
        }

        coords.push(new THREE.Vector3(x, y, z));
      }
    }
  }

  return coords;
}

/**
 * Generates coordinates for a torus (donut) shape
 *
 * @param count - Number of points
 * @param majorRadius - Radius from center to tube center
 * @param minorRadius - Radius of the tube
 * @returns Array of 3D coordinates forming a torus
 */
export function getTorusCoordinates(
  count: number,
  majorRadius: number = 30,
  minorRadius: number = 10
): THREE.Vector3[] {
  const coords: THREE.Vector3[] = [];

  for (let i = 0; i < count; i++) {
    const u = (i / count) * Math.PI * 2;
    const v = ((i * 7) % count / count) * Math.PI * 2; // Prime number for distribution

    const x = (majorRadius + minorRadius * Math.cos(v)) * Math.cos(u);
    const y = (majorRadius + minorRadius * Math.cos(v)) * Math.sin(u);
    const z = minorRadius * Math.sin(v);

    coords.push(new THREE.Vector3(x, y, z));
  }

  return coords;
}

export {};
