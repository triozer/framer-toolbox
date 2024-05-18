import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import mkcert from 'vite-plugin-mkcert'
import framer from 'vite-plugin-framer'

// https://vitejs.dev/config/
export default defineConfig({
  server: { strictPort: true },
  plugins: [react(), mkcert(), framer()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
})
