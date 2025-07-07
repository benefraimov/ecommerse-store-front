import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5110,
    proxy: {
      // api כל בקשה שמתחילה ב
      '/api': {
        // תועבר לשרת שלנו
        target: "https://ecommerse-api.zoomtech.co.il",
        // נחוץ כדי שהשרת המארח יתחלף כראוי
        changeOrigin: true,
      }
    }
  }
})
