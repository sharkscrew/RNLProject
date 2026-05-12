import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Same-origin /api in dev avoids browser CORS when the SPA runs on localhost:5173
      "/api": {
        target: "http://localhost/RNLPROJECT/server/public",
        changeOrigin: true,
      },
    },
  },
})
