/**
 * TypeScript type definitions for MediaPipe Hands library
 *
 * These types provide type safety for the MediaPipe Hands library loaded via CDN.
 * MediaPipe Hands provides real-time hand tracking and gesture recognition.
 *
 * @see https://google.github.io/mediapipe/solutions/hands
 */

/**
 * Represents a single hand landmark point in 3D space
 *
 * @property x - Horizontal position (0 to 1, normalized to image width)
 * @property y - Vertical position (0 to 1, normalized to image height)
 * @property z - Depth position (relative to wrist)
 */
export interface Landmark {
  x: number;
  y: number;
  z: number;
}

/**
 * Array of 21 landmarks representing a single hand
 *
 * Landmark indices:
 * 0: WRIST
 * 1-4: THUMB (CMC, MCP, IP, TIP)
 * 5-8: INDEX (MCP, PIP, DIP, TIP)
 * 9-12: MIDDLE (MCP, PIP, DIP, TIP)
 * 13-16: RING (MCP, PIP, DIP, TIP)
 * 17-20: PINKY (MCP, PIP, DIP, TIP)
 */
export type HandLandmarks = Landmark[];

/**
 * Results returned from MediaPipe Hands detection
 *
 * @property multiHandLandmarks - Array of detected hands, each containing 21 landmarks
 * @property image - The input video element that was processed
 */
export interface HandResults {
  multiHandLandmarks?: HandLandmarks[];
  image: HTMLVideoElement;
}

/**
 * Callback function type for hand detection results
 */
export type OnResultsCallback = (results: HandResults) => void;

/**
 * Configuration for MediaPipe Hands file loading
 *
 * @property locateFile - Function that returns the CDN URL for MediaPipe files
 */
export interface HandsConfig {
  locateFile: (file: string) => string;
}

/**
 * Options for configuring MediaPipe Hands behavior
 *
 * @property maxNumHands - Maximum number of hands to detect (1-2)
 * @property modelComplexity - Model complexity (0=lite, 1=full, 2=heavy). Higher = more accurate but slower
 * @property minDetectionConfidence - Minimum confidence (0-1) for initial hand detection
 * @property minTrackingConfidence - Minimum confidence (0-1) for hand tracking between frames
 */
export interface HandsOptions {
  maxNumHands: number;
  modelComplexity: 0 | 1 | 2;
  minDetectionConfidence: number;
  minTrackingConfidence: number;
}

/**
 * MediaPipe Hands instance interface
 */
export interface HandsInstance {
  /**
   * Sets configuration options for the Hands detector
   */
  setOptions(options: Partial<HandsOptions>): void;

  /**
   * Registers a callback function to receive detection results
   */
  onResults(callback: OnResultsCallback): void;

  /**
   * Sends an image frame for hand detection
   */
  send(input: { image: HTMLVideoElement }): Promise<void>;

  /**
   * Closes the Hands detector and releases resources
   */
  close(): void;
}

/**
 * Configuration for MediaPipe Camera utility
 *
 * @property onFrame - Callback invoked for each camera frame
 * @property width - Camera resolution width in pixels
 * @property height - Camera resolution height in pixels
 */
export interface CameraConfig {
  onFrame: () => void | Promise<void>;
  width: number;
  height: number;
}

/**
 * MediaPipe Camera instance interface
 */
export interface CameraInstance {
  /**
   * Starts the camera feed
   */
  start(): void;

  /**
   * Stops the camera feed
   */
  stop(): void;
}

/**
 * MediaPipe Hands constructor
 */
export interface HandsConstructor {
  new (config: HandsConfig): HandsInstance;
}

/**
 * MediaPipe Camera constructor
 */
export interface CameraConstructor {
  new (videoElement: HTMLVideoElement, config: CameraConfig): CameraInstance;
}

/**
 * Global window interface extension for MediaPipe
 *
 * MediaPipe libraries are loaded via CDN and attach to the window object.
 * This interface provides type safety for accessing these global objects.
 */
declare global {
  interface Window {
    /**
     * MediaPipe Hands constructor
     * Available after loading https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js
     */
    Hands: HandsConstructor;

    /**
     * MediaPipe Camera utility constructor
     * Available after loading https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js
     */
    Camera: CameraConstructor;
  }
}

export {};
