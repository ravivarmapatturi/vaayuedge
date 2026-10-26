import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

// Dev only: missing files under /models must 404 (not fall back to index.html),
// so transformers.js can tell an absent optional file from a real one.
const strictModels = {
  name: 'strict-models-404',
  configureServer(server: any) {
    server.middlewares.use('/models', (req: any, res: any, next: any) => {
      const file = path.join(__dirname, 'public/models', decodeURIComponent((req.url || '').split('?')[0]));
      if (fs.existsSync(file)) return next();
      res.statusCode = 404;
      res.end('Not found');
    });
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), strictModels],
  server: {
    port: 5173,
    proxy: {
      '/v1': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
  },
});
