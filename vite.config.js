// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // <--- AGREGA ESTO: Forzamos el puerto 5174
    strictPort: true, // (Opcional) Si está ocupado, fallará en lugar de cambiar
  }
})