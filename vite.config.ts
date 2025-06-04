// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  root: 'client',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client', 'src'),
    },
  },
  server: {
    fs: {
      allow: [
        path.resolve(__dirname, '.'),                       // جذر المشروع
        path.resolve(__dirname, 'client'),                  // client
        path.resolve(__dirname, 'node_modules'),            // node_modules النسبي
        '/data/data/com.termux/files/home/projects/FamilyFinanceTracker/node_modules' // node_modules الكامل
      ],
    },
  },
})

