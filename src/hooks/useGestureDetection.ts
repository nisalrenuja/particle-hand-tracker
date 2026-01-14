import { useMemo } from 'react';
import type { HandLandmarks } from '@/types/mediapipe';
import type { GestureResult } from '@/types/shapes';
import { GestureRecognizer, mapGestureToShape } from '@/services/GestureRecognizer';
import { useThrottle } from './useThrottle';

interface UseGestureDetectionResult {
  gesture: string;
  confidence: number;
  shape: string;
  displayName: string;
}

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
