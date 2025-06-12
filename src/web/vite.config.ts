import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cesium from 'vite-plugin-cesium'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cesium()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    watch: {
      usePolling: true
    }
  },
  define: {
    CESIUM_BASE_URL: JSON.stringify('/')
  }
})
