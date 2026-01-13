/**
 * MediaPipe Script Loading Hook
 *
 * Manages loading of MediaPipe external scripts from CDN.
 * Tracks loading state and provides ready indicators.
 */

import { useState } from 'react';

/**
 * Script loading state
 */
interface ScriptLoadingState {
  hands: boolean;
  camera: boolean;
}

/**
 * Hook return value
 */
interface UseMediaPipeScriptsResult {
  /** Whether MediaPipe Hands script is loaded */
  handsReady: boolean;
  /** Whether MediaPipe Camera script is loaded */
  cameraReady: boolean;
  /** Whether all scripts are loaded */
  allReady: boolean;
  /** Function to call when Hands script loads */
  onHandsLoad: () => void;
  /** Function to call when Camera script loads */
  onCameraLoad: () => void;
}

/**
 * Manages MediaPipe script loading state
 *
 * Provides callback functions for Next.js Script component's onLoad events
 * and tracks when scripts are ready for use.
 *
 * @returns Script loading state and callbacks
 *
 * @example
 * ```tsx
 * const { handsReady, cameraReady, onHandsLoad, onCameraLoad } = useMediaPipeScripts();
 *
 * return (
 *   <>
 *     <Script src="..." onLoad={onHandsLoad} />
 *     <Script src="..." onLoad={onCameraLoad} />
 *     {handsReady && cameraReady && <HandTracker />}
 *   </>
 * );
 * ```
 */
export function useMediaPipeScripts(): UseMediaPipeScriptsResult {
  const [scriptsLoaded, setScriptsLoaded] = useState<ScriptLoadingState>({
    hands: false,
    camera: false,
  });

  const onHandsLoad = (): void => {
    setScriptsLoaded((prev) => ({ ...prev, hands: true }));
  };

  const onCameraLoad = (): void => {
    setScriptsLoaded((prev) => ({ ...prev, camera: true }));
  };

  return {
    handsReady: scriptsLoaded.hands,
    cameraReady: scriptsLoaded.camera,
    allReady: scriptsLoaded.hands && scriptsLoaded.camera,
    onHandsLoad,
    onCameraLoad,
  };
}

export {};
