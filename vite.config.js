import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true,
    exclude: ['**/node_modules/**', 'e2e/**'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://www.reddit.com',
        changeOrigin: true,
        secure: true,
        headers: {
          'User-Agent': 'reddit-mini-client/1.0',
        },
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
