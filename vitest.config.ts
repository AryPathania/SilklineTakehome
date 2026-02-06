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
        'e2e/**',
        '.artifacts/**',
        'vite.config.ts',
        'vitest.config.ts',
        'playwright.config.ts',
        'eslint.config.js',
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
    },
  },
});
