import { defineConfig } from 'tsdown'
import solid from 'vite-plugin-solid'

export default defineConfig({
  entry: ['src/index.ts', 'src/store.ts'],
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  plugins: [solid()],
  clean: true,
  external: ['solid-js'],
  dts: {
    build: true,
  },
})
