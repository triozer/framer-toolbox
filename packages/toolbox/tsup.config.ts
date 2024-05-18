import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/*.ts', 'src/*.tsx', '!src/*.d.ts'],
    outDir: 'dist',
    format: ['esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    loader: {
      '.css': 'local-css',
    },
  },
])
