import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig({
  root: 'site', base: '/ASCean/',
  resolve: { alias: {
    '/foundation-ocean.ts': resolve('apps/ocean/main.ts'),
    '/foundation-lab.ts': resolve('apps/mechanics-lab/main.ts'),
  } },
  build: { outDir: '../dist', emptyOutDir: true, rollupOptions: { input: {
    home: resolve('site/index.html'), ocean: resolve('site/ocean/index.html'),
    lab: resolve('site/lab/index.html'),
    oceanFoundation: resolve('site/ocean/foundation/index.html'),
    labFoundation: resolve('site/lab/foundation/index.html'),
  } } },
});
