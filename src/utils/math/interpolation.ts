/**
 * Mathematical Interpolation Utilities
 *
 * Provides linear interpolation (lerp) functions for smooth
 * animations and transitions between values.
 */

import * as THREE from 'three';

/**
 * Linear interpolation between two numbers
 *
 * Calculates a value between start and end based on the factor.
 * Factor of 0 returns start, factor of 1 returns end, values
 * between create smooth transitions.
 *
 * @param start - Starting value
 * @param end - Ending value
 * @param factor - Interpolation factor (0-1), where 0=start and 1=end
 * @returns Interpolated value between start and end
 *
 * @example
 * ```ts
 * lerp(0, 100, 0.5); // Returns 50
 * lerp(10, 20, 0.25); // Returns 12.5
 * ```
 */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

/**
 * Linear interpolation for THREE.Color objects
 *
 * Smoothly transitions from one color to another.
 *
 * @param startColor - Starting color
 * @param endColor - Target color
 * @param factor - Interpolation factor (0-1)
 * @returns New interpolated color
 *
 * @example
 * ```ts
 * const red = new THREE.Color(1, 0, 0);
 * const blue = new THREE.Color(0, 0, 1);
 * const purple = lerpColor(red, blue, 0.5);
 * ```
 */
export function lerpColor(
  startColor: THREE.Color,
  endColor: THREE.Color,
  factor: number
): THREE.Color {
  return new THREE.Color(
    lerp(startColor.r, endColor.r, factor),
    lerp(startColor.g, endColor.g, factor),
    lerp(startColor.b, endColor.b, factor)
  );
}

/**
 * Linear interpolation for THREE.Vector3 objects
 *
 * Smoothly transitions from one 3D position to another.
 *
 * @param startVec - Starting vector
 * @param endVec - Target vector
 * @param factor - Interpolation factor (0-1)
 * @returns New interpolated vector
 *
 * @example
 * ```ts
 * const start = new THREE.Vector3(0, 0, 0);
 * const end = new THREE.Vector3(10, 10, 10);
 * const mid = lerpVector3(start, end, 0.5);
 * // Returns Vector3(5, 5, 5)
 * ```
 */
export function lerpVector3(
  startVec: THREE.Vector3,
  endVec: THREE.Vector3,
  factor: number
): THREE.Vector3 {
  return new THREE.Vector3(
    lerp(startVec.x, endVec.x, factor),
    lerp(startVec.y, endVec.y, factor),
    lerp(startVec.z, endVec.z, factor)
  );
}

/**
 * Interpolates an array of positions towards target positions
 *
 * Modifies the positions array in-place for performance.
 * Useful for animating particle positions.
 *
 * @param positions - Float32Array of current positions [x,y,z,x,y,z,...]
 * @param targets - Array of target Vector3 positions
 * @param factor - Interpolation factor (0-1)
 *
 * @example
 * ```ts
 * const positions = new Float32Array([0, 0, 0, 1, 1, 1]);
 * const targets = [new Vector3(10, 10, 10), new Vector3(20, 20, 20)];
 * lerpPositions(positions, targets, 0.1);
 * // positions array is updated with interpolated values
 * ```
 */
export function lerpPositions(
  positions: Float32Array,
  targets: THREE.Vector3[],
  factor: number
): void {
  const particleCount = targets.length;

  for (let i = 0; i < particleCount; i++) {
    const idx = i * 3;
    const target = targets[i];

    positions[idx] += (target.x - positions[idx]) * factor;
    positions[idx + 1] += (target.y - positions[idx + 1]) * factor;
    positions[idx + 2] += (target.z - positions[idx + 2]) * factor;
  }
}

/**
 * Interpolates an array of colors towards target colors
 *
 * Modifies the colors array in-place for performance.
 * Useful for animating particle colors.
 *
 * @param colors - Float32Array of current colors [r,g,b,r,g,b,...]
 * @param targets - Array of target Color objects
 * @param factor - Interpolation factor (0-1)
 *
 * @example
 * ```ts
 * const colors = new Float32Array([1, 0, 0, 0, 1, 0]); // Red, Green
 * const targets = [new Color(0, 0, 1), new Color(1, 1, 0)]; // Blue, Yellow
 * lerpColors(colors, targets, 0.1);
 * // colors array is updated with interpolated values
 * ```
 */
export function lerpColors(
  colors: Float32Array,
  targets: THREE.Color[],
  factor: number
): void {
  const particleCount = targets.length;

  for (let i = 0; i < particleCount; i++) {
    const idx = i * 3;
    const target = targets[i];

    colors[idx] += (target.r - colors[idx]) * factor;
    colors[idx + 1] += (target.g - colors[idx + 1]) * factor;
    colors[idx + 2] += (target.b - colors[idx + 2]) * factor;
  }
}

/**
 * Clamps a value between min and max
 *
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 *
 * @example
 * ```ts
 * clamp(150, 0, 100); // Returns 100
 * clamp(-10, 0, 100); // Returns 0
 * clamp(50, 0, 100); // Returns 50
 * ```
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Maps a value from one range to another
 *
 * @param value - Value to map
 * @param inMin - Input range minimum
 * @param inMax - Input range maximum
 * @param outMin - Output range minimum
 * @param outMax - Output range maximum
 * @returns Mapped value
 *
 * @example
 * ```ts
 * mapRange(5, 0, 10, 0, 100); // Returns 50
 * mapRange(0.5, 0, 1, -1, 1); // Returns 0
 * ```
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export {};
