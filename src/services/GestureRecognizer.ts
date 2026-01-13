/**
 * Gesture Recognition Service
 *
 * Analyzes MediaPipe hand landmarks to recognize specific gestures.
 * Supports detection of various finger configurations including:
 * - Thumbs up
 * - Index finger (pointing)
 * - Peace sign (V)
 * - Three fingers
 * - Open palm
 * - Closed fist
 */

import type { HandLandmarks } from '@/types/mediapipe';
import type { GestureResult, FingerState } from '@/types/shapes';
import { LANDMARK_INDICES, GESTURE_CONFIG } from '@/config/constants';

/**
 * GestureRecognizer class
 *
 * Encapsulates gesture recognition logic for hand tracking.
 * Analyzes 21 hand landmarks to determine finger positions and gestures.
 */
export class GestureRecognizer {
  private landmarks: HandLandmarks;

  /**
   * Creates a GestureRecognizer instance
   *
   * @param landmarks - Array of 21 hand landmark points from MediaPipe
   */
  constructor(landmarks: HandLandmarks) {
    this.landmarks = landmarks;
  }

  /**
   * Checks if a finger is raised by comparing tip and PIP joint positions
   *
   * A finger is considered "up" if its tip is higher (lower Y value in normalized coordinates)
   * than its PIP (Proximal Interphalangeal) joint.
   *
   * @param tipIdx - Landmark index of the finger tip
   * @param pipIdx - Landmark index of the PIP joint
   * @returns True if finger is raised, false otherwise
   * @private
   */
  private isFingerUp(tipIdx: number, pipIdx: number): boolean {
    return this.landmarks[tipIdx].y < this.landmarks[pipIdx].y;
  }

  /**
   * Detects if thumb is raised
   *
   * Thumb detection is more complex due to its different orientation.
   * Compares thumb tip position against index finger MCP (base) joint.
   *
   * @returns True if thumb is up, false otherwise
   * @private
   */
  private isThumbUp(): boolean {
    const thumbTipY = this.landmarks[LANDMARK_INDICES.THUMB_TIP].y;
    const indexMcpY = this.landmarks[LANDMARK_INDICES.INDEX_MCP].y;
    return thumbTipY < indexMcpY;
  }

  /**
   * Gets the state of all fingers (raised or not)
   *
   * @returns Object containing boolean state for each finger
   */
  public getFingerState(): FingerState {
    return {
      thumb: this.isThumbUp(),
      index: this.isFingerUp(LANDMARK_INDICES.INDEX_TIP, LANDMARK_INDICES.INDEX_PIP),
      middle: this.isFingerUp(LANDMARK_INDICES.MIDDLE_TIP, LANDMARK_INDICES.MIDDLE_PIP),
      ring: this.isFingerUp(LANDMARK_INDICES.RING_TIP, LANDMARK_INDICES.RING_PIP),
      pinky: this.isFingerUp(LANDMARK_INDICES.PINKY_TIP, LANDMARK_INDICES.PINKY_PIP),
    };
  }

  /**
   * Counts how many fingers (excluding thumb) are raised
   *
   * @returns Number of raised fingers (0-4)
   * @private
   */
  private countRaisedFingers(): number {
    const state = this.getFingerState();
    let count = 0;

    if (state.index) count++;
    if (state.middle) count++;
    if (state.ring) count++;
    if (state.pinky) count++;

    return count;
  }

  /**
   * Recognizes the current hand gesture with confidence scoring
   *
   * Detection priority (checked in order):
   * 1. Thumbs Up - Thumb raised, all fingers down
   * 2. Index - Only index finger raised
   * 3. Peace/Victory - Index and middle fingers raised
   * 4. Three Fingers - Index, middle, and ring fingers raised
   * 5. Open Palm - Four or more fingers raised
   * 6. Closed Fist - No fingers raised
   *
   * @returns Gesture result with name and confidence score
   *
   * @example
   * ```ts
   * const recognizer = new GestureRecognizer(landmarks);
   * const result = recognizer.recognizeGesture();
   * console.log(result); // { name: 'thumbs-up', confidence: 1.0 }
   * ```
   */
  public recognizeGesture(): GestureResult {
    const state = this.getFingerState();
    const fingersUpCount = this.countRaisedFingers();

    // 1. Thumbs Up - Strict detection: thumb up, all others down
    if (state.thumb && fingersUpCount === 0) {
      return {
        name: 'thumbs-up',
        confidence: 1.0,
      };
    }

    // 2. Index finger (pointing)
    if (state.index && !state.middle && !state.ring && !state.pinky) {
      return {
        name: 'index',
        confidence: 1.0,
      };
    }

    // 3. Peace sign / V sign (index + middle)
    if (state.index && state.middle && !state.ring && !state.pinky) {
      return {
        name: 'peace',
        confidence: 1.0,
      };
    }

    // 4. Three fingers (index + middle + ring)
    if (state.index && state.middle && state.ring && !state.pinky) {
      return {
        name: 'three-fingers',
        confidence: 1.0,
      };
    }

    // 5. Open palm (four or more fingers)
    if (fingersUpCount >= GESTURE_CONFIG.OPEN_PALM_FINGER_COUNT) {
      return {
        name: 'open-palm',
        confidence: 1.0,
      };
    }

    // 6. Closed fist (no fingers raised)
    if (fingersUpCount === 0) {
      return {
        name: 'fist',
        confidence: 1.0,
      };
    }

    // Default: no recognized gesture
    return {
      name: 'none',
      confidence: 0.0,
    };
  }

  /**
   * Gets the position of a specific landmark
   *
   * Useful for tracking hand movement for camera control.
   *
   * @param index - Landmark index (use LANDMARK_INDICES constants)
   * @returns The landmark point
   *
   * @example
   * ```ts
   * const wrist = recognizer.getLandmark(LANDMARK_INDICES.WRIST);
   * console.log(`Wrist at: ${wrist.x}, ${wrist.y}`);
   * ```
   */
  public getLandmark(index: number) {
    return this.landmarks[index];
  }

  /**
   * Gets the middle finger MCP position (useful for tracking hand center)
   *
   * @returns Middle finger MCP landmark
   */
  public getHandCenter() {
    return this.landmarks[LANDMARK_INDICES.MIDDLE_MCP];
  }
}

/**
 * Maps gesture names to shape names for the particle system
 *
 * @param gestureName - The recognized gesture name
 * @returns The corresponding particle shape name
 *
 * @example
 * ```ts
 * const shape = mapGestureToShape('thumbs-up'); // Returns 'scatter'
 * ```
 */
export function mapGestureToShape(gestureName: string): string {
  const gestureToShapeMap: Record<string, string> = {
    'thumbs-up': 'scatter',
    'index': 'hello',
    'peace': 'gemini',
    'three-fingers': 'sinhala-great',
    'open-palm': 'sphere',
    'fist': 'sinhala-hello',
    'none': 'sphere',
  };

  return gestureToShapeMap[gestureName] || 'sphere';
}

export {};
