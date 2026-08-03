import { defineConfig } from 'vitest/config';
import path from 'node:path';

// Extensão .mts para o Vite carregar como ESM. Como .ts, ele é lido como CommonJS
// e a sintaxe de import dispara aviso de descontinuação.
export default defineConfig({
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
});
