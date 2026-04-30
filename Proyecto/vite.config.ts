import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: '.',
  base: '/',
  build: {
    outDir: 'src/main/resources/static',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/app/index.html'),
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
