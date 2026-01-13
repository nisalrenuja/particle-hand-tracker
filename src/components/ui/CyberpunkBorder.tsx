/**
 * Cyberpunk Border Component
 *
 * Decorative cyberpunk-themed border elements and overlay graphics.
 */

import React from 'react';

/**
 * CyberpunkBorder component
 *
 * Renders decorative border elements and a center reticle overlay
 * to enhance the cyberpunk aesthetic.
 *
 * @example
 * ```tsx
 * <CyberpunkBorder />
 * ```
 */
export function CyberpunkBorder() {
  return (
    <>
      {/* Center reticle / graphical overlay */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] pointer-events-none opacity-20 border border-cyan-500/30 rounded-full blur-sm"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none opacity-10 border-x border-cyan-500/20 skew-x-12"></div>
    </>
  );
}

export default CyberpunkBorder;
