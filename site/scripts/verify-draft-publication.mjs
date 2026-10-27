import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { DRAFT_ROUTES, draftPreviewEnabled } from '../draft-routes.mjs';

const dist = resolve(new URL('../', import.meta.url).pathname,
  process.env.CIUDADANIA_BUILD_DIRECTORY || 'dist');
assert(existsSync(join(dist, 'index.html')), 'Falta la compilación del sitio');
const preview = draftPreviewEnabled();
for (const slug of DRAFT_ROUTES) {
  const html = join(dist, slug, 'index.html');
  assert.equal(existsSync(html), preview, `${slug}: salida inesperada para este modo`);
  assert(!existsSync(join(dist, `${slug}.html`)), `${slug}: salida alternativa inesperada`);
  if (preview) {
    const text = readFileSync(html, 'utf8');
    assert(/name="robots" content="noindex,nofollow"/.test(text), `${slug}: falta noindex`);
    assert(text.includes('pendiente') || text.includes('Pendientes'), `${slug}: falta aviso de revisión`);
    assert(!text.includes('data-pagefind-body'), `${slug}: borrador incluido en búsqueda`);
  }
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)]);
}
const files = walk(dist);
for (const file of files.filter((name) => /sitemap.*\.xml$/.test(name))) {
  for (const [, url] of readFileSync(file, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const slug = new URL(url).pathname.replace(/^\/|\/$/g, '');
    assert(!DRAFT_ROUTES.includes(slug), `${slug}: borrador incluido en sitemap`);
  }
}
if (!preview) {
  const data = JSON.parse(readFileSync(new URL('../src/data/ejecucion-v1.json', import.meta.url), 'utf8'));
  const pendingText = data.lessons.map((lesson) => lesson.body);
  for (const file of files.filter((name) => /\.(html|js|json)$/.test(name))) {
    const text = readFileSync(file, 'utf8');
    assert(!pendingText.some((body) => text.includes(body)), `Contenido pendiente en ${file}`);
  }
}
console.log(preview
  ? '✓ Seis rutas de revisión presentes, no indexables y fuera del sitemap/búsqueda.'
  : '✓ Producción excluye las seis rutas y el contenido pendiente.');
