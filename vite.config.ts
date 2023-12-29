/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'lcov']
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setup.ts',
    css: true
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  optimizeDeps: {
    exclude: ['js-big-decimal']
  }
});
