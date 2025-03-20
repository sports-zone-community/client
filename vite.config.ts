import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [react()],
  envDir: './environments',
  resolve: {
    alias: {
      assets: path.resolve(__dirname, 'src/assets'),
    },
  },
}));
