/**
 * Status Display Component
 *
 * Displays system status information in a cyberpunk-themed panel.
 */

import React from 'react';

/**
 * Component props
 */
interface StatusDisplayProps {
  /** Label for the status section */
  label: string;
  /** Primary value to display */
  value: string | number;
  /** Secondary information (optional) */
  subtitle?: string;
  /** Color theme (default: cyan) */
  color?: 'cyan' | 'pink';
}

/**
 * StatusDisplay component
 *
 * Renders a styled status panel with label, value, and optional subtitle.
 * Used for displaying system information like particle count, FPS, etc.
 *
 * @example
 * ```tsx
 * <StatusDisplay
 *   label="SYSTEM STATUS"
 *   value="ONLINE"
 *   subtitle="All systems operational"
 *   color="cyan"
 * />
 * ```
 */
export function StatusDisplay({
  label,
  value,
  subtitle,
  color = 'cyan',
}: StatusDisplayProps) {
  const colorClasses = {
    cyan: {
      border: 'border-cyan-400',
      text: 'text-cyan-400',
      textDim: 'text-cyan-400/70',
      textFaded: 'text-cyan-400/50',
    },
    pink: {
      border: 'border-pink-500',
      text: 'text-pink-500',
      textDim: 'text-pink-500/70',
      textFaded: 'text-pink-500/50',
    },
  };

  const colors = colorClasses[color];

  return (
    <div className={`border-l-2 ${colors.border} pl-2`}>
      <div className={`text-xs ${colors.textDim}`}>{label}</div>
      <div className={`text-2xl font-bold tracking-wider ${colors.text}`}>
        {typeof value === 'string' ? value.toUpperCase() : value}
      </div>
      {subtitle && (
        <div className={`text-xs ${colors.textFaded} mt-1`}>{subtitle}</div>
      )}
    </div>
  );
}

export default StatusDisplay;
