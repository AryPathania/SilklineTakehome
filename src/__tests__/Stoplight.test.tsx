import { render, screen, cleanup, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Stoplight } from '../components/Stoplight';

describe('Stoplight', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it('cycles through green -> yellow -> red -> green with correct timing', () => {
    render(<Stoplight />);

    const stoplight = screen.getByTestId('stoplight');
    const redLight = screen.getByTestId('light-red');
    const yellowLight = screen.getByTestId('light-yellow');
    const greenLight = screen.getByTestId('light-green');

    // Initial state: green is active
    expect(stoplight).toHaveAttribute('data-active-color', 'green');
    expect(greenLight).toHaveAttribute('data-active', 'true');
    expect(yellowLight).toHaveAttribute('data-active', 'false');
    expect(redLight).toHaveAttribute('data-active', 'false');

    // After 5000ms: yellow becomes active
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(stoplight).toHaveAttribute('data-active-color', 'yellow');
    expect(greenLight).toHaveAttribute('data-active', 'false');
    expect(yellowLight).toHaveAttribute('data-active', 'true');
    expect(redLight).toHaveAttribute('data-active', 'false');

    // After 1000ms more (6000ms total): red becomes active
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(stoplight).toHaveAttribute('data-active-color', 'red');
    expect(greenLight).toHaveAttribute('data-active', 'false');
    expect(yellowLight).toHaveAttribute('data-active', 'false');
    expect(redLight).toHaveAttribute('data-active', 'true');

    // After 2000ms more (8000ms total): back to green
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(stoplight).toHaveAttribute('data-active-color', 'green');
    expect(greenLight).toHaveAttribute('data-active', 'true');
    expect(yellowLight).toHaveAttribute('data-active', 'false');
    expect(redLight).toHaveAttribute('data-active', 'false');
  });

  it('has exactly one light active at any time', () => {
    render(<Stoplight />);

    const getActiveLightCount = () => {
      const lights = screen.getAllByTestId(/^light-/);
      return lights.filter((light) => light.getAttribute('data-active') === 'true').length;
    };

    // Check initial state
    expect(getActiveLightCount()).toBe(1);

    // Check after each transition through a full cycle
    act(() => {
      vi.advanceTimersByTime(5000); // green -> yellow
    });
    expect(getActiveLightCount()).toBe(1);

    act(() => {
      vi.advanceTimersByTime(1000); // yellow -> red
    });
    expect(getActiveLightCount()).toBe(1);

    act(() => {
      vi.advanceTimersByTime(2000); // red -> green
    });
    expect(getActiveLightCount()).toBe(1);
  });

  it('cleans up timer on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    const { unmount } = render(<Stoplight />);

    // Unmount should trigger cleanup
    unmount();

    // Verify clearTimeout was called
    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });
});
