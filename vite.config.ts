import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig({
  root: 'site', base: '/ASCean/',
  resolve: { alias: {
    '/foundation-ocean.ts': resolve('apps/ocean/main.ts'),
    '/foundation-lab.ts': resolve('apps/mechanics-lab/main.ts'),
    '/living-ocean.ts': resolve('apps/ocean/living.ts'),
    '/living-lab.ts': resolve('apps/mechanics-lab/living.ts'),
  } },
  build: { outDir: '../dist', emptyOutDir: true, rollupOptions: { input: {
    home: resolve('site/index.html'), ocean: resolve('site/ocean/index.html'),
    lab: resolve('site/lab/index.html'),
    oceanFoundation: resolve('site/ocean/foundation/index.html'),
    labFoundation: resolve('site/lab/foundation/index.html'),
    oceanLiving: resolve('site/ocean/living/index.html'),
    labLiving: resolve('site/lab/living/index.html'),
    hub: resolve('site/hub/index.html'),
    genetics: resolve('site/references/species-genome-lab.html'),
    anatomy: resolve('site/references/food-gut-anatomy.html'),
    archive: resolve('site/references/aquarium-mechanics-archive.html'),
    science: resolve('site/science/living-v1.html'),
  } } },
});
