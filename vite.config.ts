import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths'
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), basicSsl()],
  server: {
    https: true,
    proxy: {
      '/api': {
        target: 'https://172.19.0.3:888',
        changeOrigin: true,
        secure: false,
      },
      '/wss': {
        target: 'wss://172.19.0.4:889',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: './dist',
    emptyOutDir: true
  }
})
