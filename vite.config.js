import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Lokalt: proxy PHP-kald til live-siden
    proxy: {
      '^/.*\\.php': { target: 'https://majkjaer.dk', changeOrigin: true },
    },
  },
})
