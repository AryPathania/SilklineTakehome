import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { Light } from '../components/Light';

describe('Light', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders with correct data attributes when active', () => {
    render(<Light color="green" isActive={true} />);

    const light = screen.getByTestId('light-green');
    expect(light).toHaveAttribute('data-color', 'green');
    expect(light).toHaveAttribute('data-active', 'true');
  });

  it('renders with correct data attributes when inactive', () => {
    render(<Light color="red" isActive={false} />);

    const light = screen.getByTestId('light-red');
    expect(light).toHaveAttribute('data-color', 'red');
    expect(light).toHaveAttribute('data-active', 'false');
  });

  it('applies active class when active', () => {
    render(<Light color="yellow" isActive={true} />);

    const light = screen.getByTestId('light-yellow');
    expect(light).toHaveClass('light', 'light-yellow', 'light-active');
  });

  it('does not apply active class when inactive', () => {
    render(<Light color="yellow" isActive={false} />);

    const light = screen.getByTestId('light-yellow');
    expect(light).toHaveClass('light', 'light-yellow');
    expect(light).not.toHaveClass('light-active');
  });
});
