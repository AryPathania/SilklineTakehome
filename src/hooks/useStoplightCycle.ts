import { useState, useEffect } from 'react';

export type LightColor = 'green' | 'yellow' | 'red' | 'purple' | 'off';

export interface LightStep {
  readonly color: LightColor;
  readonly duration: number;
  readonly order?: number;
}

export const LIGHT_SEQUENCE: readonly LightStep[] = [
  { color: 'green', duration: 1000, order: 2 },
  { color: 'yellow', duration: 1000, order: 1 },
  { color: 'red', duration: 1000, order: 0 },
  { color: 'purple', duration: 1000, order: 3 }
] as const;

// purple, yellow, green, red
export const LIGHT_SEQUENCE2: readonly LightStep[] = [
  { color: 'purple', duration: 1000, order: 0 },
  { color: 'yellow', duration: 1000, order: 1 },
  { color: 'green', duration: 1000, order: 2 }, 
  { color: 'red', duration: 1000, order: 3 }
] as const;

export const LIGHT_SEQUENCE3: readonly LightStep[] = [
  { color: 'red', duration: 1000, order: 0 },
  { color: 'off', duration: 1000}
] as const;

export const LIGHT_SEQUENCE4: readonly LightStep[] = [
  { color: 'red', duration: 1000, order: 0 },
  { color: 'red', duration: 1000, order: 1 },
  { color: 'red', duration: 1000, order: 2 },
  { color: 'red', duration: 1000, order: 3 },

] as const;

/**
 * Hook that manages the stoplight cycle.
 * Uses chained setTimeout for testability with fake timers.
 * Returns the currently active color.
 */
export function useStoplightCycle(sequence: readonly LightStep[]): [LightColor, number] {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const duration = sequence[activeIndex].duration;
    const timeoutId = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % sequence.length);
    }, duration);

    return () => clearTimeout(timeoutId);
  }, [activeIndex, sequence]);

  return [sequence[activeIndex].color, sequence[activeIndex].order];
}
