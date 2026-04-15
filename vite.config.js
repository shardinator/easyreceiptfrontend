import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const apiProxy = {
  '/api': {
    target: 'http://127.0.0.1:3000',
    changeOrigin: true,
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: apiProxy,
  },
  preview: {
    proxy: apiProxy,
  },
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
})
