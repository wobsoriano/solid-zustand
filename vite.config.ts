import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'createStore'
    },
    rollupOptions: {
      external: ['solid-js', 'zustand'],
      output: {
        globals: {
          'solid-js': 'SolidClient',
          zustand: 'Zustand'
        }
      }
    }
  },
  plugins: [
    dts({
      beforeWriteFile: () => ({
        filePath: 'dist/index.d.ts'
      })
    })
  ]
})