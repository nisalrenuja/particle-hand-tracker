/**
 * TypeScript type definitions for particle shapes and gestures
 *
 * These types define the shape configurations, gesture types, and
 * particle system interfaces used throughout the application.
 */

import * as THREE from 'three';

/**
 * Available particle shape formations
 */
export type ShapeType =
  | 'sphere'
  | 'hello'
  | 'gemini'
  | 'sinhala-great'
  | 'sinhala-hello'
  | 'scatter';

/**
 * Recognized hand gestures
 */
export type GestureType =
  | 'thumbs-up'
  | 'index'
  | 'peace'
  | 'three-fingers'
  | 'open-palm'
  | 'fist'
  | 'none';

/**
 * Configuration for a particle shape
 *
 * @property coordinates - Array of 3D positions for particles to morph into
 * @property color - RGB color for the shape
 */
export interface ShapeConfig {
  coordinates: THREE.Vector3[];
  color: THREE.Color;
}

/**
 * Mapping of shape names to their configurations
 */
export type ShapeMap = Record<ShapeType, ShapeConfig>;

/**
 * Color configuration using RGB values (0-1 range)
 *
 * @property r - Red channel (0-1)
 * @property g - Green channel (0-1)
 * @property b - Blue channel (0-1)
 */
export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Gesture recognition result
 *
 * @property name - The recognized gesture type
 * @property confidence - Confidence score (0-1) of the detection
 */
export interface GestureResult {
  name: string;
  confidence: number;
}

/**
 * Finger state for gesture detection
 *
 * @property thumb - Whether thumb is raised
 * @property index - Whether index finger is raised
 * @property middle - Whether middle finger is raised
 * @property ring - Whether ring finger is raised
 * @property pinky - Whether pinky finger is raised
 */
export interface FingerState {
  thumb: boolean;
  index: boolean;
  middle: boolean;
  ring: boolean;
  pinky: boolean;
}

/**
 * Particle system state
 *
 * @property currentShape - The currently active shape
 * @property targetShape - The shape particles are morphing towards
 * @property particleCount - Total number of particles
 */
export interface ParticleSystemState {
  currentShape: ShapeType;
  targetShape: ShapeType;
  particleCount: number;
}

/**
 * Animation configuration
 *
 * @property lerpFactor - Linear interpolation factor for position (0-1)
 * @property colorLerpFactor - Linear interpolation factor for color (0-1)
 */
export interface AnimationConfig {
  lerpFactor: number;
  colorLerpFactor: number;
}

export {};
