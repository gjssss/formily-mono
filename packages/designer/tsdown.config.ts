import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'
import { buildCSS } from './scripts/build-css'

export default defineConfig({
  hooks: {
    'build:prepare': async () => {
      await buildCSS()
    },
  },
  entry: [
    'src/index.ts',
  ],
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url)),
  },
  ignoreWatch: ['src/.generated'],
  fixedExtension: true,
  plugins: [
    Vue(),
  ],
  treeshake: true,
  minify: process.env.NODE_ENV === 'production',
  clean: process.env.NODE_ENV === 'production',
})
