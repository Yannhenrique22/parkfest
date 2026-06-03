import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Se for publicar em GitHub Pages num "project site" (https://user.github.io/panzor/),
  // descomente a linha abaixo com o nome do repositório:
  // base: '/panzor/',
})
