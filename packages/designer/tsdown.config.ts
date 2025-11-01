import process from 'node:process'
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
  fixedExtension: true,
  plugins: [
    Vue(),
  ],
  treeshake: true,
  minify: process.env.NODE_ENV === 'production',
  clean: process.env.NODE_ENV === 'production',
})
