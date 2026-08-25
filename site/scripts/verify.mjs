#!/usr/bin/env node
/**
 * Gate de verificación pre-deploy (quickstart.md):
 *  1. pa11y (WCAG 2.2 AA) sobre las páginas representativas del build
 *  2. presupuesto de peso (check-budget.mjs)
 * Requiere `npm run build` previo. Exit 1 si algo falla.
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { spawnSync } from 'node:child_process';
import pa11y from 'pa11y';

const DIST = new URL('../dist/', import.meta.url).pathname;
const PORT = 4177;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
  '.ogg': 'audio/ogg',
};

const server = createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (path.endsWith('/')) path += 'index.html';
  try {
    const data = await readFile(join(DIST, path));
    res.writeHead(200, { 'content-type': MIME[extname(path)] ?? 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
});

const PAGES = [
  '/',
  '/nah/',
  '/yua/',
  '/en/',
  '/articulos/que-es-un-llm/',
  '/nah/articulos/que-es-un-llm/',
  '/lite/',
  '/lite/articulos/que-es-un-llm/',
  '/gobernanza-de-datos/',
  '/manifiesto/',
  '/contribuye/',
  '/ediciones/',
  '/docentes/',
];

await new Promise((r) => server.listen(PORT, r));
let failed = false;

console.log('— pa11y (WCAG2AA) —');
for (const page of PAGES) {
  try {
    const result = await pa11y(`http://localhost:${PORT}${page}`, {
      standard: 'WCAG2AA',
      timeout: 60000,
      chromeLaunchConfig: { args: ['--no-sandbox'] },
    });
    if (result.issues.length === 0) {
      console.log(`✓ ${page}`);
    } else {
      failed = true;
      console.log(`✗ ${page} — ${result.issues.length} problema(s):`);
      for (const issue of result.issues) {
        console.log(`   [${issue.code}] ${issue.message}\n   ${issue.selector}`);
      }
    }
  } catch (err) {
    failed = true;
    console.log(`✗ ${page} — error: ${err.message}`);
  }
}

server.close();

console.log('\n— presupuesto de peso —');
const budget = spawnSync('node', [new URL('./check-budget.mjs', import.meta.url).pathname], {
  stdio: 'inherit',
});
if (budget.status !== 0) failed = true;

process.exit(failed ? 1 : 0);
