import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import stylelint from 'vite-plugin-stylelint';
import inspect from 'vite-plugin-inspect';
import glsl from 'vite-plugin-glsl';

// https://vitejs.dev/config/
export default defineConfig({
  base: 'three-js',
  plugins: [
    vue(),
    inspect(),
    glsl(),
    stylelint({
      fix: true,
      exclude: ['node_modules'],
    } as Partial<any>),
  ],
});
