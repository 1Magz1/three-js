/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import stylelint from 'vite-plugin-stylelint';
import inspect from 'vite-plugin-inspect';
/* eslint-enabled import/no-extraneous-dependencies */

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    inspect(),
    stylelint({
      fix: true,
      exclude: ['node_modules'],
    } as Partial<any>),
  ],
});
