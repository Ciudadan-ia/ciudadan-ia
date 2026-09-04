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
  '/politica-de-ia/',
  '/transparencia/',
  '/contribuye/',
  '/ediciones/',
  '/docentes/',
  // Índices a escala (feature 002)
  '/temas/',
  '/temas/tecnologia/',
  '/articulos/',
  '/glosario/',
  '/buscar/',
  '/nah/temas/',
  '/en/articulos/',
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

// --- Enlaces internos: toda ruta enlazada debe existir (constitución II a escala) ---
console.log('\n— enlaces internos —');
{
  const { readdirSync, statSync } = await import('node:fs');
  const { readFileSync } = await import('node:fs');
  const htmlFiles = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (name.endsWith('.html')) htmlFiles.push(full);
    }
  };
  walk(DIST);
  const exists = (p) => {
    const candidates = p.endsWith('/') ? [join(DIST, p, 'index.html')] : [join(DIST, p), join(DIST, p, 'index.html')];
    return candidates.some((c) => {
      try {
        return statSync(c).isFile();
      } catch {
        return false;
      }
    });
  };
  const broken = new Map();
  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
      const href = m[1];
      if (href.startsWith('/pagefind/') || href.startsWith('/api/')) continue;
      if (/\.(woff2|css|js|svg|png|ogg|webmanifest|xml|json|txt)$/.test(href)) continue;
      if (!exists(href)) {
        if (!broken.has(href)) broken.set(href, []);
        broken.get(href).push(file.replace(DIST, ''));
      }
    }
  }
  if (broken.size === 0) {
    console.log(`✓ ${htmlFiles.length} páginas revisadas, 0 enlaces internos rotos`);
  } else {
    failed = true;
    console.log(`✗ ${broken.size} enlace(s) roto(s):`);
    for (const [href, from] of [...broken].slice(0, 15)) {
      console.log(`   ${href}  ←  ${from.slice(0, 3).join(', ')}${from.length > 3 ? ` (+${from.length - 3})` : ''}`);
    }
  }
}

console.log('\n— presupuesto de peso —');
const budget = spawnSync('node', [new URL('./check-budget.mjs', import.meta.url).pathname], {
  stdio: 'inherit',
});
if (budget.status !== 0) failed = true;

process.exit(failed ? 1 : 0);
