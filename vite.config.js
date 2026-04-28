import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
