---
name: repro
description: Create a Playwright repro test to isolate a UI bug
user_invokable: true
---

# /repro - Create Playwright Repro Test

Quickly scaffold a temporary e2e test to isolate a UI bug.

## Actions

1. **Create scaffold file**
   Create `e2e/debug-repro.spec.ts` with boilerplate:

   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('Debug Repro', () => {
     test('repro: [DESCRIBE THE BUG HERE]', async ({ page }) => {
       // Configure trace capture for this specific test
       await page.goto('/');

       // TODO: Add minimal steps to reproduce the bug
       // Example assertions:
       // await expect(page.locator('[data-testid="stoplight"]')).toBeVisible();
       // await expect(page.locator('[data-testid="light-green"]')).toHaveAttribute('data-active', 'true');
     });
   });
   ```

2. **Inform user**
   - File created at `e2e/debug-repro.spec.ts`
   - Edit the test to add specific failure steps
   - Run with: `npx playwright test debug-repro.spec.ts --trace on`
   - View trace with: `npx playwright show-trace .artifacts/playwright/trace.zip`

## Important Notes

- This is a **temporary** test file
- After debugging, either:
  1. Convert to a proper regression test, OR
  2. Delete the file
- The **debug** agent can edit this file
- Other agents cannot
