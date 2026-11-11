import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const THREE_PACKAGES = /[\\/]node_modules[\\/](three|@react-three)[\\/]/
const REACT_PACKAGES = /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
  build: {
    target: 'es2020',
    // Three.js (~800 kB) va en su propio paquete y solo se descarga cuando una escena 3D entra en
    // pantalla; no forma parte de la carga inicial, así que el aviso de tamaño no aplica a ese archivo.
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // El ayudante de precarga de Vite lo usan todos los chunks: va con React, nunca con Three.
          if (id.includes('vite/preload-helper')) return 'react'
          if (THREE_PACKAGES.test(id)) return 'three'
          if (REACT_PACKAGES.test(id)) return 'react'
          return undefined
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    include: ['src/**/*.test.{js,jsx}'],
  },
})
