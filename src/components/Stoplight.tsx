import { LIGHT_SEQUENCE, useStoplightCycle, type LightColor } from '../hooks/useStoplightCycle';
import { Light } from './Light';
import './Stoplight.css';

// Display order: red (top), yellow (middle), green (bottom)
const DISPLAY_ORDER: readonly LightColor[] = ['red', 'yellow', 'green', "purple"] as const;

/**
 * Stoplight component that cycles through green -> yellow -> red continuously.
 * Green: 5s, Yellow: 1s, Red: 2s
 */
export function Stoplight({displayOrder = DISPLAY_ORDER, sequenceOrder= LIGHT_SEQUENCE}) {
  const [activeColor, order] = useStoplightCycle(sequenceOrder);

  return (
    <div data-testid="stoplight" data-active-color={activeColor} className="stoplight">
      {displayOrder.map((color, idx) => (
        <Light key={color} color={color} isActive={order === idx} />
      ))}
    </div>
  );
}
