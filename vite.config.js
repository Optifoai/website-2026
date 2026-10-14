import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const OLLAMA_API_KEY = 'c57c6f64f6069d60cd06be2f87594ca12174771073757078f319715f2323cf19'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    assetsDir: 'assets', // default
  },
  server: {
    proxy: {
      '/ollama': {
        target: 'https://fastapi.optifo.in',
        changeOrigin: true,
        secure: true,
        timeout: 120000,
        proxyTimeout: 120000,
        headers: {
          'X-API-Key': OLLAMA_API_KEY,
        },
      },
    },
  },
})
