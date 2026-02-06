---
name: setup-tooling
description: Install all testing dependencies and create configuration files
user_invokable: true
---

# /setup-tooling - Install All Testing Dependencies

One-time setup of all testing infrastructure for the stoplight project.

## Actions

### 1. Install Dependencies

```bash
# Testing framework
npm install -D vitest @vitest/coverage-v8

# React Testing Library
npm install -D @testing-library/react @testing-library/jest-dom jsdom

# Code duplication
npm install -D jscpd

# E2E testing
npm install -D @playwright/test
npx playwright install chromium
```

### 2. Create Configuration Files

**vitest.config.ts:**
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'src/test-setup.ts',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
      ],
    },
  },
});
```

**src/test-setup.ts:**
```typescript
import '@testing-library/jest-dom/vitest';
```

**.jscpd.json:**
```json
{
  "threshold": 1,
  "reporters": ["html", "console"],
  "output": ".artifacts/jscpd",
  "ignore": [
    "node_modules",
    "dist",
    "coverage",
    ".artifacts",
    "**/*.test.tsx",
    "**/*.spec.ts"
  ],
  "absolute": true
}
```

**playwright.config.ts:**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  outputDir: '.artifacts/playwright',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 3. Add npm Scripts

Add to `package.json`:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "dup": "jscpd src/",
    "validate": "npm run test:coverage && npm run dup",
    "test:e2e": "playwright test"
  }
}
```

### 4. Create Directories

```bash
mkdir -p .artifacts/playwright .artifacts/jscpd e2e src/__tests__
```

### 5. Update .gitignore

Add to `.gitignore`:
```
# Artifacts
.artifacts/
coverage/

# Playwright
/playwright-report/
/playwright/.cache/
```

## Verification

After setup, verify with:
```bash
npm run test          # Should run (may have no tests yet)
npm run dup           # Should show 0% duplication
npm run validate      # Should run both checks
```
