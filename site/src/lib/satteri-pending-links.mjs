/**
 * Degrada los enlaces internos a piezas que aún no están publicadas.
 *
 * Con miles de piezas que se enlazan entre sí y se publican de forma escalonada
 * durante meses, un enlace a una pieza todavía en cola sería un 404. Este plugin
 * conserva el texto del término y quita el enlace hasta que la pieza exista, para
 * que el orden de publicación no rompa nunca la navegación (constitución II).
 *
 * Plugin nativo de Sätteri (el procesador de Markdown de Astro 7).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { defineHastPlugin } from 'satteri';

const ARTICLES = new URL('../content/articles/', import.meta.url).pathname;
const ARTICLE_HREF = /^\/(?:(?:en|nah|yua)\/)?articulos\/([a-z0-9-]+)\/$/;

/** Slugs con al menos una versión publicada a la fecha de corte. Se calcula una vez. */
let cache = null;
function publishedSlugs() {
  if (cache) return cache;
  const env = process.env.PUBLISH_AS_OF;
  const asOf = env ? new Date(env) : new Date();
  const out = new Set();
  let dirs = [];
  try {
    dirs = readdirSync(ARTICLES);
  } catch {
    cache = out;
    return out;
  }
  for (const slug of dirs) {
    const dir = join(ARTICLES, slug);
    try {
      if (!statSync(dir).isDirectory()) continue;
    } catch {
      continue;
    }
    for (const file of readdirSync(dir)) {
      if (!file.endsWith('.md')) continue;
      const raw = readFileSync(join(dir, file), 'utf8');
      const status = raw.match(/^status:\s*(\S+)/m)?.[1];
      const date = raw.match(/^publishDate:\s*"?([0-9]{4}-[0-9]{2}-[0-9]{2})/m)?.[1];
      if (status === 'borrador' || !date) continue;
      if (new Date(date) <= asOf) {
        out.add(slug);
        break;
      }
    }
  }
  cache = out;
  return out;
}

export const pendingLinks = defineHastPlugin({
  name: 'ciudadania-pending-links',
  element: {
    filter: ['a'],
    visit(node) {
      const href = String(node.properties?.href ?? '');
      const m = href.match(ARTICLE_HREF);
      if (!m) return;
      if (publishedSlugs().has(m[1])) return;
      return {
        type: 'element',
        tagName: 'span',
        properties: { class: 'pending-term', title: 'Esta entrada aún no se publica' },
        children: node.children,
      };
    },
  },
});
