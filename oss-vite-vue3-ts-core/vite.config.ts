import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from "@vitejs/plugin-vue-jsx";
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { resolve } from "path";
// import { __dirname } from "@type/node";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    Components({
      resolvers: [AntDesignVueResolver()],
    }),
  ],
  resolve: {
    alias: {
      // @ts-ignore
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    host: '0.0.0.0',
    port:"3101",
    proxy: {
      '/api': {
        target: 'http://192.168.31.180:8080',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ""),

      }
    }
  }
})
