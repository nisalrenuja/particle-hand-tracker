/**
 * Physics Display Component
 *
 * Displays the current particle physics mode in a cyberpunk-themed panel.
 */

import React from 'react';

/**
 * Component props
 */
interface PhysicsDisplayProps {
  /** The current particle mode/shape */
  mode: string;
}

/**
 * PhysicsDisplay component
 *
 * Shows the current particle physics mode (scatter vs morph) in a styled panel.
 *
 * @example
 * ```tsx
 * <PhysicsDisplay mode="scatter" />
 * ```
 */
export function PhysicsDisplay({ mode }: PhysicsDisplayProps) {
  const displayMode = mode === 'scatter' ? 'SCATTER' : 'MORPH';

  return (
    <div className="border-r-2 border-pink-500 pr-2 text-right">
      <div className="text-xs text-pink-500/70">RIGHT HAND [PHYSICS]</div>
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold">MODE:</span>
          <span className="text-xl text-white font-bold tracking-widest uppercase">
            {displayMode}
          </span>
        </div>
        <div className="text-xs text-pink-500/50">MIRROR FIELD</div>
      </div>
    </div>
  );
}

export default PhysicsDisplay;
