// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

const { BACKEND_URL } = loadEnv(process.env.NODE_ENV ?? '', process.cwd(), '');

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: BACKEND_URL || 'https://upper-backend-production.up.railway.app',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api/v1')
        },
        '/uploads': {
          target: BACKEND_URL || 'https://upper-backend-production.up.railway.app',
          changeOrigin: true
        }
      }
    }
  },

  integrations: [react()]
});