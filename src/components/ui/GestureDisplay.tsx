/**
 * Gesture Display Component
 *
 * Displays the currently recognized hand gesture in a cyberpunk-themed panel.
 */

import React from 'react';

/**
 * Component props
 */
interface GestureDisplayProps {
  /** The current gesture name to display */
  gesture: string;
}

/**
 * GestureDisplay component
 *
 * Shows the current hand gesture command in a styled panel.
 *
 * @example
 * ```tsx
 * <GestureDisplay gesture="BLAST!" />
 * ```
 */
export function GestureDisplay({ gesture }: GestureDisplayProps) {
  return (
    <div className="border-l-2 border-cyan-400 pl-2">
      <div className="text-xs text-cyan-400/70">LEFT HAND [COMMAND]</div>
      <div className="flex items-center gap-2">
        <span className="text-pink-500 font-bold">CMD:</span>
        <span className="text-xl text-white font-bold tracking-widest uppercase">
          {gesture || 'STANDBY'}
        </span>
      </div>
      <div className="text-xs text-cyan-400/50">GESTURE CONTROL</div>
    </div>
  );
}

export default GestureDisplay;
