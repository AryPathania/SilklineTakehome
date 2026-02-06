import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useStoplightCycle, LIGHT_SEQUENCE } from '../hooks/useStoplightCycle';

describe('useStoplightCycle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts with green', () => {
    const { result } = renderHook(() => useStoplightCycle());
    expect(result.current).toBe('green');
  });

  it('cycles through the sequence with correct timing', () => {
    const { result } = renderHook(() => useStoplightCycle());

    // Start: green
    expect(result.current).toBe('green');

    // After 5000ms: yellow
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current).toBe('yellow');

    // After 1000ms more: red
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toBe('red');

    // After 2000ms more: back to green
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current).toBe('green');
  });

  it('accepts a custom sequence', () => {
    const customSequence = [
      { color: 'red' as const, duration: 100 },
      { color: 'green' as const, duration: 200 },
    ];

    const { result } = renderHook(() => useStoplightCycle(customSequence));

    expect(result.current).toBe('red');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('green');

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('red');
  });

  it('cleans up timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    const { unmount } = renderHook(() => useStoplightCycle());
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});

describe('LIGHT_SEQUENCE', () => {
  it('has correct configuration', () => {
    expect(LIGHT_SEQUENCE).toEqual([
      { color: 'green', duration: 5000 },
      { color: 'yellow', duration: 1000 },
      { color: 'red', duration: 2000 },
    ]);
  });
});
