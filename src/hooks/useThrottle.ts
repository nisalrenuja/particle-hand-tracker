/**
 * Throttle Hook
 *
 * React hook that throttles a value, preventing it from updating
 * more frequently than a specified interval.
 */

import { useEffect, useRef, useState } from 'react';

/**
 * Throttles a value to prevent excessive updates
 *
 * Useful for limiting the frequency of expensive operations like
 * gesture detection or state updates.
 *
 * @param value - The value to throttle
 * @param delay - Minimum delay between updates in milliseconds
 * @returns The throttled value
 *
 * @example
 * ```tsx
 * const throttledGesture = useThrottle(currentGesture, 100);
 * // Gesture updates at most once per 100ms
 * ```
 */
export function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRun = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRun.current;

      if (timeSinceLastRun >= delay) {
        setThrottledValue(value);
        lastRun.current = now;
      }
    }, delay - (Date.now() - lastRun.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return throttledValue;
}

export {};
