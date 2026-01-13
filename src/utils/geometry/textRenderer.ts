/**
 * Text Rendering Utility
 *
 * Renders text to a canvas and extracts pixel coordinates for particle positioning.
 * Supports both Latin and Sinhala scripts.
 */

import * as THREE from 'three';
import { SHAPE_CONFIG, GESTURE_CONFIG } from '@/config/constants';

/**
 * Generates 3D coordinates from text by rendering to canvas and sampling pixels
 *
 * This function:
 * 1. Creates a canvas and renders the text
 * 2. Samples pixels at regular intervals
 * 3. Converts lit pixels to 3D coordinates
 * 4. Centers the result around the origin
 *
 * @param text - The text to render (supports Unicode including Sinhala)
 * @param font - CSS font specification (default from constants)
 * @returns Array of 3D vector coordinates representing the text shape
 * @throws Error if canvas context cannot be created
 *
 * @example
 * ```ts
 * const coords = getTextCoordinates('Hello');
 * // Returns array of Vector3 positions forming the word "Hello"
 * ```
 */
export function getTextCoordinates(
  text: string,
  font: string = SHAPE_CONFIG.TEXT_FONT
): THREE.Vector3[] {
  // Create canvas for text rendering
  const canvas = document.createElement('canvas');
  const size = SHAPE_CONFIG.TEXT_CANVAS_SIZE;
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas 2D context for text rendering');
  }

  // Configure canvas for text rendering
  ctx.font = font;
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Render text to canvas
  ctx.fillText(text, size / 2, size / 2);

  // Extract pixel data
  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;
  const coords: THREE.Vector3[] = [];

  // Sample pixels to create particle coordinates
  // Step size controls density - larger step = fewer particles
  const step = SHAPE_CONFIG.TEXT_STEP;
  const scale = SHAPE_CONFIG.TEXT_SCALE;

  for (let y = 0; y < size; y += step) {
    for (let x = 0; x < size; x += step) {
      const pixelIndex = (y * size + x) * 4;
      const pixelValue = data[pixelIndex]; // Red channel (grayscale)

      // Check if pixel is "lit" (above threshold)
      if (pixelValue > GESTURE_CONFIG.TEXT_PIXEL_THRESHOLD) {
        // Convert 2D canvas coordinates to centered 3D coordinates
        coords.push(
          new THREE.Vector3(
            (x - size / 2) * scale,  // Center X around origin
            -(y - size / 2) * scale, // Center Y and invert (canvas Y is inverted)
            0                         // Flat on Z plane
          )
        );
      }
    }
  }

  return coords;
}

/**
 * Generates coordinates for multiple text strings
 *
 * Useful for pre-generating multiple text shapes at initialization.
 *
 * @param texts - Array of text strings to render
 * @param font - Optional font override
 * @returns Map of text to coordinate arrays
 *
 * @example
 * ```ts
 * const textShapes = getMultipleTextCoordinates(['Hello', 'World']);
 * const helloCoords = textShapes.get('Hello');
 * ```
 */
export function getMultipleTextCoordinates(
  texts: string[],
  font?: string
): Map<string, THREE.Vector3[]> {
  const result = new Map<string, THREE.Vector3[]>();

  for (const text of texts) {
    result.set(text, getTextCoordinates(text, font));
  }

  return result;
}

export {};
