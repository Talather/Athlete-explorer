import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import version from 'vite-plugin-package-version';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), version()],
  define: {
    'process.env': {}
  }
})
