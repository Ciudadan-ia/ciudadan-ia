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
    if (slug.startsWith('lite/')) {
      assert(!/<script\b/i.test(text), `${slug}: la lectura ligera no necesita scripts`);
      assert(!/\.woff2|rel="stylesheet"/.test(text), `${slug}: recurso de estilo externo en lectura ligera`);
    }
  }
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)]);
}
const files = walk(dist);
// Las traducciones anteriores pendientes tampoco son contenido publicable.
const articlesDirectory = new URL('../src/content/articles/', import.meta.url).pathname;
let pendingTranslations = 0;
for (const file of walk(articlesDirectory).filter((name) => name.endsWith('.md'))) {
  const source = readFileSync(file, 'utf8');
  if (!/^status:\s*traducido-ia\s*$/m.test(source)) continue;
  pendingTranslations++;
  const [slug, localeFile] = file.slice(articlesDirectory.length).split('/');
  const lang = localeFile.replace(/\.md$/, '');
  const route = `${lang === 'es' ? '' : `${lang}/`}articulos/${slug}`;
  for (const prefix of ['', 'lite/']) {
    const compiled = existsSync(join(dist, prefix + route, 'index.html'));
    if (!preview) assert(!compiled, `Traducción pendiente publicada: ${prefix + route}`);
  }
}
if (!preview) {
  assert(!files.some((file) => file.includes('milton-noaa-2024')), 'Medio pendiente incluido en producción');
}
for (const file of files.filter((name) => /sitemap.*\.xml$/.test(name))) {
  for (const [, url] of readFileSync(file, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const slug = new URL(url).pathname.replace(/^\/|\/$/g, '');
    assert(!DRAFT_ROUTES.includes(slug), `${slug}: borrador incluido en sitemap`);
  }
}
if (!preview) {
  const data = JSON.parse(readFileSync(new URL('../src/data/ejecucion-v1.json', import.meta.url), 'utf8'));
  const portada = JSON.parse(readFileSync(new URL('../src/data/portada-propuesta.json', import.meta.url), 'utf8'));
  assert.equal(portada.status, 'draft');
  assert.equal(portada.publicationApproved, false);
  const pendingText = [...[...data.lessons, ...data.faqs, ...data.news].map((item) => item.body),
    ...portada.stories.flatMap((story) => [story.title, story.summary, story.evidence,
      story.limit, story.question, story.activity])];
  for (const file of files.filter((name) => /\.(html|js|json)$/.test(name))) {
    const text = readFileSync(file, 'utf8');
    assert(!pendingText.some((body) => text.includes(body)), `Contenido pendiente en ${file}`);
    if (file.endsWith('.html') && process.env.PUBLIC_FORMS_ENABLED !== 'true') {
      assert(!/action="\/api\/(suscribir|contribuir)"/.test(text), `Formulario no habilitado en ${file}`);
    }
  }
}
console.log(preview
  ? `✓ ${DRAFT_ROUTES.length} rutas de revisión presentes, no indexables y fuera del sitemap/búsqueda.`
  : `✓ Producción excluye las ${DRAFT_ROUTES.length} rutas y el contenido pendiente.`);
console.log(`✓ ${pendingTranslations} traducciones IA pendientes identificadas; solo se permiten en revisión.`);
