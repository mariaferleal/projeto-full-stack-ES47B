import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/projeto-full-stack-ES47B/',
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