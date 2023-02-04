import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import stylelint from 'vite-plugin-stylelint';
import inspect from 'vite-plugin-inspect';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/<REPO>/',
  plugins: [
    vue(),
    inspect(),
    stylelint({
      fix: true,
      exclude: ['node_modules'],
    } as Partial<any>),
  ],
});
