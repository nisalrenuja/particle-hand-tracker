/**
 * Application configuration constants
 *
 * Centralizes all magic numbers, configuration values, and settings
 * used throughout the particle hand tracker application.
 */

import * as THREE from 'three';

/**
 * Particle system configuration
 */
export const PARTICLE_CONFIG = {
  /** Total number of particles in the system */
  COUNT: 10000,
  /** Size of each particle in pixels */
  SIZE: 1.2,
  /** Opacity of particles (0-1) */
  OPACITY: 0.9,
} as const;

/**
 * Shape generation configuration
 */
export const SHAPE_CONFIG = {
  /** Radius of the sphere formation */
  SPHERE_RADIUS: 30,
  /** Range of scatter effect in all directions */
  SCATTER_RANGE: 300,
  /** Canvas size for text rendering (pixels) */
  TEXT_CANVAS_SIZE: 2048,
  /** Scale factor for text coordinates in 3D space */
  TEXT_SCALE: 0.12,
  /** Pixel sampling step size for text (controls density) */
  TEXT_STEP: 8,
  /** Default font for text rendering */
  TEXT_FONT: '350px "Noto Sans Sinhala", sans-serif',
} as const;

/**
 * Animation and interpolation configuration
 */
export const ANIMATION_CONFIG = {
  /** Default linear interpolation factor for position (0-1) */
  DEFAULT_LERP_FACTOR: 0.05,
  /** Faster lerp factor for scatter effect */
  SCATTER_LERP_FACTOR: 0.1,
  /** Linear interpolation factor for color transitions */
  COLOR_LERP_FACTOR: 0.05,
  /** Rotation lerp factor for smooth transitions */
  ROTATION_LERP_FACTOR: 0.05,
  /** Rotation increment for scatter effect */
  SCATTER_ROTATION_INCREMENT: 0.02,
  /** Hand position influence multiplier for rotation */
  HAND_ROTATION_MULTIPLIER: 4,
} as const;

/**
 * MediaPipe Hands configuration
 */
export const MEDIAPIPE_CONFIG = {
  /** Maximum number of hands to detect (1-2) */
  MAX_NUM_HANDS: 1,
  /** Model complexity: 0=lite, 1=full, 2=heavy */
  MODEL_COMPLEXITY: 1 as 0 | 1 | 2,
  /** Minimum confidence for hand detection (0-1) */
  MIN_DETECTION_CONFIDENCE: 0.5,
  /** Minimum confidence for hand tracking (0-1) */
  MIN_TRACKING_CONFIDENCE: 0.5,
  /** CDN base URL for MediaPipe files */
  CDN_BASE_URL: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/',
} as const;

/**
 * Camera configuration
 */
export const CAMERA_CONFIG = {
  /** Camera feed width in pixels */
  WIDTH: 1280,
  /** Camera feed height in pixels */
  HEIGHT: 720,
} as const;

/**
 * Three.js scene configuration
 */
export const SCENE_CONFIG = {
  /** Camera field of view in degrees */
  CAMERA_FOV: 75,
  /** Near clipping plane */
  CAMERA_NEAR: 0.1,
  /** Far clipping plane */
  CAMERA_FAR: 1000,
  /** Camera Z position */
  CAMERA_Z_POSITION: 100,
  /** Clear color (transparent black) */
  CLEAR_COLOR: 0x000000,
  /** Clear alpha (0 = transparent) */
  CLEAR_ALPHA: 0,
} as const;

/**
 * Starfield configuration
 */
export const STARFIELD_CONFIG = {
  /** Number of background stars */
  COUNT: 2000,
  /** Size of each star */
  SIZE: 0.5,
  /** Star color */
  COLOR: 0xffffff,
  /** Star opacity */
  OPACITY: 0.4,
  /** Distribution range for stars */
  RANGE: 400,
  /** Rotation speed on Y axis */
  ROTATION_Y_SPEED: 0.0005,
  /** Rotation speed on X axis */
  ROTATION_X_SPEED: 0.0002,
} as const;

/**
 * Color definitions for each shape
 * Uses RGB values in 0-1 range for Three.js Color compatibility
 */
export const SHAPE_COLORS = {
  sphere: new THREE.Color(1.0, 0.6, 0.0),      // Orange/Gold
  hello: new THREE.Color(0.0, 1.0, 1.0),       // Cyan
  gemini: new THREE.Color(1.0, 0.0, 1.0),      // Magenta
  'sinhala-great': new THREE.Color(0.0, 1.0, 0.5),   // Greenish
  'sinhala-hello': new THREE.Color(0.5, 0.0, 1.0),   // Purple
  scatter: new THREE.Color(1.0, 0.2, 0.2),     // Red/Fire
} as const;

/**
 * MediaPipe hand landmark indices
 *
 * Reference: https://google.github.io/mediapipe/solutions/hands.html
 */
export const LANDMARK_INDICES = {
  WRIST: 0,

  // Thumb
  THUMB_CMC: 1,
  THUMB_MCP: 2,
  THUMB_IP: 3,
  THUMB_TIP: 4,

  // Index finger
  INDEX_MCP: 5,
  INDEX_PIP: 6,
  INDEX_DIP: 7,
  INDEX_TIP: 8,

  // Middle finger
  MIDDLE_MCP: 9,
  MIDDLE_PIP: 10,
  MIDDLE_DIP: 11,
  MIDDLE_TIP: 12,

  // Ring finger
  RING_MCP: 13,
  RING_PIP: 14,
  RING_DIP: 15,
  RING_TIP: 16,

  // Pinky finger
  PINKY_MCP: 17,
  PINKY_PIP: 18,
  PINKY_DIP: 19,
  PINKY_TIP: 20,
} as const;

/**
 * Gesture detection thresholds
 */
export const GESTURE_CONFIG = {
  /** Minimum fingers required for open palm gesture */
  OPEN_PALM_FINGER_COUNT: 4,
  /** Pixel threshold for determining if text pixel is considered "on" */
  TEXT_PIXEL_THRESHOLD: 128,
} as const;

/**
 * UI z-index layers
 */
export const Z_INDEX = {
  VIDEO: 10,
  OVERLAY: 20,
  CANVAS: 40,
  UI: 50,
} as const;

/**
 * Initial particle position range
 */
export const INITIAL_PARTICLE_RANGE = {
  MIN: -100,
  MAX: 100,
} as const;

export {};
