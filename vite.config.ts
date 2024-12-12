import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    include: [
      "markdown-it",
      "markdown-it-task-lists",
      "markdown-it-footnote",
      "markdown-it-container",
    ],
  },
})
