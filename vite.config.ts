import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';

function editorSavePlugin() {
  const registerMiddlewares = (server: any) => {
    // Endpoint to upload media directly to public/uploads
    server.middlewares.use('/api/upload-media', (req: any, res: any) => {
      if (req.method === 'POST') {
        const urlObj = new URL(req.url, 'http://localhost');
        const rawName = urlObj.searchParams.get('filename') || req.headers['x-filename'] || `media-${Date.now()}`;
        const safeName = path.basename(decodeURIComponent(rawName)).replace(/[^a-zA-Z0-9._-]/g, '_');
        const uploadDir = path.resolve(__dirname, 'public/uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const targetPath = path.join(uploadDir, safeName);
        const writeStream = fs.createWriteStream(targetPath);

        req.pipe(writeStream);

        writeStream.on('finish', () => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, url: `/uploads/${safeName}`, filename: safeName }));
        });

        writeStream.on('error', (err: any) => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: err.message }));
        });
        return;
      }
      res.writeHead(405);
      res.end();
    });

    // Endpoint to save config to local project files
    server.middlewares.use('/api/save-config', (req: any, res: any) => {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk: any) => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            const targetPath = path.resolve(__dirname, 'src/data/savedConfig.json');
            fs.writeFileSync(targetPath, JSON.stringify(data, null, 2), 'utf-8');
            
            const tsPath = path.resolve(__dirname, 'src/data/wedding-data.ts');
            const tsContent = `import type { WeddingConfig } from './weddingConfig';\n\nexport const weddingData: WeddingConfig = ${JSON.stringify(data, null, 2)};\n\nexport default weddingData;\n`;
            fs.writeFileSync(tsPath, tsContent, 'utf-8');

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'Saved successfully to src/data/wedding-data.ts and savedConfig.json' }));
          } catch (err: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
        return;
      }
      res.writeHead(405);
      res.end();
    });

    // Endpoint to trigger production build
    server.middlewares.use('/api/build-site', (req: any, res: any) => {
      if (req.method === 'POST') {
        exec('npx vite build', { cwd: __dirname }, (error, stdout, stderr) => {
          if (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: stderr || error.message }));
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'Production site built into dist/ directory!' }));
          }
        });
        return;
      }
      res.writeHead(405);
      res.end();
    });
  };

  return {
    name: 'editor-save-plugin',
    configureServer(server: any) {
      registerMiddlewares(server);
    },
    configurePreviewServer(server: any) {
      registerMiddlewares(server);
    },
  };
}

export default defineConfig({
  base: process.env.NETLIFY ? '/' : (process.env.BASE_PATH || '/shaadi/'),
  plugins: [react(), editorSavePlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 4000,
    rollupOptions: {
      output: {
        manualChunks: {
          'framer-motion': ['framer-motion'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
