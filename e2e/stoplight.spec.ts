import { test, expect } from '@playwright/test';

test.describe('Stoplight', () => {
  test('renders with green light active initially', async ({ page }) => {
    await page.goto('/');

    const stoplight = page.getByTestId('stoplight');
    await expect(stoplight).toBeVisible();
    await expect(stoplight).toHaveAttribute('data-active-color', 'green');

    const greenLight = page.getByTestId('light-green');
    await expect(greenLight).toHaveAttribute('data-active', 'true');

    const yellowLight = page.getByTestId('light-yellow');
    await expect(yellowLight).toHaveAttribute('data-active', 'false');

    const redLight = page.getByTestId('light-red');
    await expect(redLight).toHaveAttribute('data-active', 'false');
  });

  test('cycles from green to yellow after 5 seconds', async ({ page }) => {
    await page.goto('/');

    // Starts green
    const stoplight = page.getByTestId('stoplight');
    await expect(stoplight).toHaveAttribute('data-active-color', 'green');

    // Wait for yellow (5s timeout + buffer)
    await expect(stoplight).toHaveAttribute('data-active-color', 'yellow', {
      timeout: 6000,
    });

    await expect(page.getByTestId('light-yellow')).toHaveAttribute('data-active', 'true');
    await expect(page.getByTestId('light-green')).toHaveAttribute('data-active', 'false');
  });

  test('completes full cycle back to green', async ({ page }) => {
    await page.goto('/');

    const stoplight = page.getByTestId('stoplight');

    // Wait through: green(5s) + yellow(1s) + red(2s) = 8s, then back to green
    // Start from green, wait for it to cycle back
    await expect(stoplight).toHaveAttribute('data-active-color', 'green');

    // Wait for yellow
    await expect(stoplight).toHaveAttribute('data-active-color', 'yellow', { timeout: 6000 });

    // Wait for red
    await expect(stoplight).toHaveAttribute('data-active-color', 'red', { timeout: 2000 });

    // Wait for green again (completes the cycle)
    await expect(stoplight).toHaveAttribute('data-active-color', 'green', { timeout: 3000 });
  });
});
