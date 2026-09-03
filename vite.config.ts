import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Gera src/routeTree.gen.ts a partir dos arquivos de src/routes.
    // As opções vêm de tsr.config.json, para que o plugin e o `tsr generate`
    // do script de build usem exatamente a mesma configuração.
    // Precisa vir antes do plugin do React.
    tanstackRouter(),
    react(),
  ],
})
