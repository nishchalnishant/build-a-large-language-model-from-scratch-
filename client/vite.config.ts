import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/build-a-large-language-model-from-scratch-/",
  worker: {
    format: "es"
  }
})
