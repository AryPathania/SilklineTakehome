import type { LightColor } from '../hooks/useStoplightCycle';

interface LightProps {
  color: LightColor;
  isActive: boolean;
}

/**
 * Individual light component for the stoplight.
 * Renders a circular light that can be active (bright) or inactive (dimmed).
 */
export function Light({ color, isActive }: LightProps) {
  return (
    <div
      data-testid={`light-${color}`}
      data-color={color}
      data-active={isActive}
      className={`light light-${color} ${isActive ? 'light-active' : ''}`}
    />
  );
}
