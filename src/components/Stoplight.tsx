import { useStoplightCycle, type LightColor } from '../hooks/useStoplightCycle';
import { Light } from './Light';
import './Stoplight.css';

// Display order: red (top), yellow (middle), green (bottom)
const DISPLAY_ORDER: readonly LightColor[] = ['red', 'yellow', 'green'] as const;

/**
 * Stoplight component that cycles through green -> yellow -> red continuously.
 * Green: 5s, Yellow: 1s, Red: 2s
 */
export function Stoplight() {
  const activeColor = useStoplightCycle();

  return (
    <div data-testid="stoplight" data-active-color={activeColor} className="stoplight">
      {DISPLAY_ORDER.map((color) => (
        <Light key={color} color={color} isActive={activeColor === color} />
      ))}
    </div>
  );
}
