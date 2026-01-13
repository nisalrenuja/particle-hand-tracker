/**
 * Three.js Canvas Container Component
 *
 * Container element for the Three.js renderer canvas.
 */

import React from 'react';

/**
 * Component props
 */
interface ThreeCanvasProps {
  /** React ref to the container div */
  containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * ThreeCanvas component
 *
 * Provides a container div for the Three.js WebGL renderer.
 * The renderer canvas is appended to this container by the useThreeScene hook.
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * <ThreeCanvas containerRef={containerRef} />
 * ```
 */
export function ThreeCanvas({ containerRef }: ThreeCanvasProps) {
  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      aria-label="3D particle visualization canvas"
    />
  );
}

export default ThreeCanvas;
