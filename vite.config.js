import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  preview: {
    proxy: {
      '/api': {
        target: 'https://rickandmortyapi.com/',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://rickandmortyapi.com/',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})