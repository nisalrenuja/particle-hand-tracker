/**
 * Video Feed Component
 *
 * Displays the webcam video feed with mirroring and overlay effects.
 */

import React from 'react';

/**
 * Component props
 */
interface VideoFeedProps {
  /** React ref to the video element */
  videoRef: React.RefObject<HTMLVideoElement | null>;
  /** Whether the camera is active */
  isActive: boolean;
}

/**
 * VideoFeed component
 *
 * Renders the video element for webcam feed with mirror effect and dark overlay.
 *
 * @example
 * ```tsx
 * const videoRef = useRef<HTMLVideoElement>(null);
 * <VideoFeed videoRef={videoRef} isActive={cameraReady} />
 * ```
 */
export function VideoFeed({ videoRef, isActive }: VideoFeedProps) {
  return (
    <>
      {/* Webcam video feed */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover transform scale-x-[-1] z-10"
        playsInline
        muted
        aria-label="Webcam feed for hand tracking"
      />

      {/* Dark overlay for particle contrast */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 pointer-events-none z-20" />
    </>
  );
}

export default VideoFeed;
