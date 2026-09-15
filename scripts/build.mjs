import { build } from 'esbuild';
import { cp, mkdir, rm } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await build({ entryPoints: ['src/app/app.js'], bundle: true, format: 'esm', outfile: 'dist/app.bundle.js', minify: true });
for (const file of ['index.html', '404.html', 'offline.html', 'manifest.json', 'service-worker.js']) await cp(file, `dist/${file}`);
await cp('icons', 'dist/icons', { recursive: true });
await mkdir('dist/src/shared/styles', { recursive: true });
await cp('src/shared/styles/tokens.css', 'dist/src/shared/styles/tokens.css');
await cp('src/shared/styles/app.css', 'dist/src/shared/styles/app.css');
