/**
 * Gesture Detection Hook
 *
 * Processes hand landmarks to detect gestures using the GestureRecognizer service.
 * Includes throttling to prevent excessive updates.
 */

import { useMemo } from 'react';
import type { HandLandmarks } from '@/types/mediapipe';
import type { GestureResult } from '@/types/shapes';
import { GestureRecognizer, mapGestureToShape } from '@/services/GestureRecognizer';
import { useThrottle } from './useThrottle';

/**
 * Hook return value
 */
interface UseGestureDetectionResult {
  /** The recognized gesture name */
  gesture: string;
  /** Confidence score (0-1) */
  confidence: number;
  /** The particle shape corresponding to this gesture */
  shape: string;
  /** Display name for the gesture */
  displayName: string;
}

/**
 * Detects hand gestures from MediaPipe landmarks
 *
 * Uses the GestureRecognizer service to analyze hand positions and
 * determine the current gesture. Results are throttled to prevent
 * excessive re-renders.
 *
 * @param landmarks - Hand landmarks from MediaPipe (null if no hand detected)
 * @param throttleMs - Throttle delay in milliseconds (default: 100ms)
 * @returns Gesture detection results
 *
 * @example
 * ```tsx
 * const { gesture, shape, displayName } = useGestureDetection(landmarks);
 * console.log(`Detected: ${displayName}, Shape: ${shape}`);
 * ```
 */
export function useGestureDetection(
  landmarks: HandLandmarks | null,
  throttleMs: number = 100
): UseGestureDetectionResult {
  // Detect gesture from landmarks
  const gestureResult: GestureResult = useMemo(() => {
    if (!landmarks || landmarks.length === 0) {
      return { name: 'none', confidence: 0 };
    }

    const recognizer = new GestureRecognizer(landmarks);
    return recognizer.recognizeGesture();
  }, [landmarks]);

  // Throttle gesture updates to prevent excessive re-renders
  const throttledGesture = useThrottle(gestureResult, throttleMs);

  // Map gesture to shape and display name
  const shape = mapGestureToShape(throttledGesture.name);
  const displayName = getGestureDisplayName(throttledGesture.name);

  return {
    gesture: throttledGesture.name,
    confidence: throttledGesture.confidence,
    shape,
    displayName,
  };
}

/**
 * Maps gesture names to user-friendly display names
 *
 * @param gestureName - Internal gesture name
 * @returns User-friendly display name
 */
function getGestureDisplayName(gestureName: string): string {
  const displayNames: Record<string, string> = {
    'thumbs-up': 'BLAST!',
    'index': 'Hello',
    'peace': 'Gemini',
    'three-fingers': 'නියමයි (Great)',
    'open-palm': 'Open Palm',
    'fist': 'ආයුබෝවන් (Ayubowan)',
    'none': 'STANDBY',
  };

  return displayNames[gestureName] || 'STANDBY';
}

export {};
