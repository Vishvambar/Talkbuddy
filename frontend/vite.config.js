import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux']
        }
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      // Proxy API calls to backend during development
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
