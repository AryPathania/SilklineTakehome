import { useState, useEffect } from 'react';

export type LightColor = 'green' | 'yellow' | 'red';

export interface LightStep {
  readonly color: LightColor;
  readonly duration: number;
}

export const LIGHT_SEQUENCE: readonly LightStep[] = [
  { color: 'green', duration: 5000 },
  { color: 'yellow', duration: 1000 },
  { color: 'red', duration: 2000 },
] as const;

/**
 * Hook that manages the stoplight cycle.
 * Uses chained setTimeout for testability with fake timers.
 * Returns the currently active color.
 */
export function useStoplightCycle(sequence: readonly LightStep[] = LIGHT_SEQUENCE): LightColor {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const duration = sequence[activeIndex].duration;
    const timeoutId = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % sequence.length);
    }, duration);

    return () => clearTimeout(timeoutId);
  }, [activeIndex, sequence]);

  return sequence[activeIndex].color;
}
