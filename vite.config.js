import { createReadStream, cpSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';
import { defineConfig } from 'vite';

const publicDirectory = resolve('public');
const distPublicDirectory = resolve('dist/public');
const contentTypes = {
  '.glb': 'model/gltf-binary',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

export default defineConfig({
  base: './',
  publicDir: false,
  plugins: [{
    name: 'serve-public-directory-paths',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        let pathname;
        try {
          pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
        } catch {
          return next();
        }

        if (!pathname.startsWith('/public/')) return next();
        const filePath = resolve(publicDirectory, pathname.slice('/public/'.length));
        if (!filePath.startsWith(`${publicDirectory}${sep}`) || !existsSync(filePath) || !statSync(filePath).isFile()) {
          return next();
        }

        response.setHeader('Content-Type', contentTypes[extname(filePath).toLowerCase()] ?? 'application/octet-stream');
        createReadStream(filePath).pipe(response);
      });
    },
    closeBundle() {
      mkdirSync(distPublicDirectory, { recursive: true });
      cpSync(publicDirectory, distPublicDirectory, { recursive: true });
    },
  }],
});
