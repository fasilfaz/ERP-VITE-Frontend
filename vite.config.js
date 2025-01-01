import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@mui/material/utils',
      '@mui/material',
      '@mui/icons-material',
      '@mui/x-data-grid',
      '@emotion/react',
      '@emotion/styled'
    ],
    force: true
  },
  server: {
    watch: {
      usePolling: true
    },
    hmr: {
      overlay: false
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          mui: ['@mui/material', '@mui/icons-material', '@mui/x-data-grid'],
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})