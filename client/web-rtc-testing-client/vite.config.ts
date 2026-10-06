import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, './cert/localhost+3-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, './cert/localhost+3.pem')),
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})