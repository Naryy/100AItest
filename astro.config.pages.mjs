// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
// GitHub Pages専用の設定
export default defineConfig({
  site: 'https://naryy.github.io',
  base: '/100AItest',
  outDir: './docs',
});
