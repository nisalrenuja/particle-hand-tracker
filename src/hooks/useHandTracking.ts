/**
 * Hand Tracking Hook
 *
 * Manages MediaPipe Hands initialization, camera setup, and hand detection.
 * Provides hand landmarks and status updates.
 */

import { useEffect, useRef, useState } from 'react';
import type { HandLandmarks, HandResults, HandsInstance, CameraInstance } from '@/types/mediapipe';
import { MEDIAPIPE_CONFIG, CAMERA_CONFIG } from '@/config/constants';

/**
 * Hook return value
 */
interface UseHandTrackingResult {
  /** Hand landmarks (21 points) or null if no hand detected */
  landmarks: HandLandmarks | null;
  /** Current status message */
  status: string;
  /** Error message if initialization failed */
  error: string | null;
}

/**
 * Manages hand tracking using MediaPipe Hands
 *
 * Initializes MediaPipe Hands and Camera utilities, processes video frames,
 * and provides hand landmark data for gesture recognition.
 *
 * @param videoRef - React ref to the video element
 * @param handsReady - Whether MediaPipe Hands script is loaded
 * @param cameraReady - Whether MediaPipe Camera script is loaded
 * @returns Hand tracking state and landmarks
 *
 * @example
 * ```tsx
 * const videoRef = useRef<HTMLVideoElement>(null);
 * const { landmarks, status } = useHandTracking(videoRef, handsReady, cameraReady);
 * ```
 */
export function useHandTracking(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  handsReady: boolean,
  cameraReady: boolean
): UseHandTrackingResult {
  const [landmarks, setLandmarks] = useState<HandLandmarks | null>(null);
  const [status, setStatus] = useState<string>('Initializing...');
  const [error, setError] = useState<string | null>(null);

  const handsRef = useRef<HandsInstance | null>(null);
  const cameraRef = useRef<CameraInstance | null>(null);

  useEffect(() => {
    // Wait for scripts to load
    if (!handsReady || !cameraReady) {
      setStatus('Loading MediaPipe libraries...');
      return;
    }

    // Check if MediaPipe globals are available
    if (!window.Hands || !window.Camera) {
      setStatus('Waiting for MediaPipe...');
      return;
    }

    // Check if video element is ready
    if (!videoRef.current) {
      setStatus('Waiting for video element...');
      return;
    }

    // Initialize MediaPipe Hands
    try {
      setStatus('Initializing hand tracking...');

      const hands = new window.Hands({
        locateFile: (file: string) => {
          return `${MEDIAPIPE_CONFIG.CDN_BASE_URL}${file}`;
        },
      });

      hands.setOptions({
        maxNumHands: MEDIAPIPE_CONFIG.MAX_NUM_HANDS,
        modelComplexity: MEDIAPIPE_CONFIG.MODEL_COMPLEXITY,
        minDetectionConfidence: MEDIAPIPE_CONFIG.MIN_DETECTION_CONFIDENCE,
        minTrackingConfidence: MEDIAPIPE_CONFIG.MIN_TRACKING_CONFIDENCE,
      });

      // Set up results callback
      hands.onResults((results: HandResults) => {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          setLandmarks(results.multiHandLandmarks[0]);
        } else {
          setLandmarks(null);
        }
      });

      handsRef.current = hands;
    } catch (err) {
      console.error('Failed to initialize MediaPipe Hands:', err);
      setError('Failed to initialize hand tracking');
      setStatus('Error: Hand tracking initialization failed');
      return;
    }

    // Initialize camera
    if (videoRef.current) {
      try {
        const camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && handsRef.current) {
              await handsRef.current.send({ image: videoRef.current });
            }
          },
          width: CAMERA_CONFIG.WIDTH,
          height: CAMERA_CONFIG.HEIGHT,
        });

        camera.start();
        cameraRef.current = camera;
        setStatus('Camera active. Detecting hands...');
      } catch (err) {
        console.error('Failed to initialize camera:', err);
        setError('Failed to start camera');
        setStatus('Error: Camera initialization failed');
        return;
      }
    }

    // Cleanup
    return () => {
      try {
        if (handsRef.current) {
          handsRef.current.close();
        }
        if (cameraRef.current) {
          cameraRef.current.stop();
        }
      } catch (err) {
        console.error('Error during cleanup:', err);
      }
    };
  }, [videoRef, handsReady, cameraReady]);

  return {
    landmarks,
    status,
    error,
  };
}

export {};
