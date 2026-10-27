import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

// Dev only: serve not-yet-published browser models from VAAYU_MODELS_DIR at /models/<owner>/<repo>/...
// Missing files must 404 (not fall back to index.html) so transformers.js handles optional files correctly.
const devModels = {
  name: 'dev-models',
  configureServer(server: any) {
    const root = process.env.VAAYU_MODELS_DIR || path.join(os.homedir(), 'vaayuedge-browser-models');
    server.middlewares.use('/models', (req: any, res: any) => {
      const rel = decodeURIComponent((req.url || '').split('?')[0]).replace(/^\/[^/]+\/vaayuedge-/, '/');
      const file = root ? path.join(root, path.normalize(rel)) : '';
      if (!file || !file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        res.statusCode = 404;
        return res.end('Not found');
      }
      fs.createReadStream(file).pipe(res);
    });
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), devModels],
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
