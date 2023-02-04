import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // @ts-ignore
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    host: '0.0.0.0',
    port:"3103",
    proxy: {

      '/api': {
        target: 'http://192.168.31.180:8080',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ""),
      }
    }
  }
})
