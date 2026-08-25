#!/usr/bin/env node
/**
 * Presupuesto de peso (constitución III / SC-004):
 *  - portada (/) < 300 KB primera carga: HTML (CSS va inline) + fuentes + JS + favicon
 *  - /lite/ < 50 KB
 * Falla con exit 1 si se excede.
 */
import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const KB = 1024;
let failed = false;

function pageWeight(htmlPath) {
  const html = readFileSync(join(DIST, htmlPath), 'utf8');
  let total = statSync(join(DIST, htmlPath)).size;
  const assets = new Set();
  // woff2 en CSS inline + scripts + favicon + manifest
  for (const m of html.matchAll(/url\((\/[^)'"]+\.woff2)\)/g)) assets.add(m[1]);
  for (const m of html.matchAll(/<script[^>]+src="(\/[^"]+)"/g)) assets.add(m[1]);
  for (const m of html.matchAll(/<link[^>]+rel="icon"[^>]+href="(\/[^"]+)"/g)) assets.add(m[1]);
  for (const asset of assets) {
    try {
      total += statSync(join(DIST, asset)).size;
    } catch {
      console.warn(`  (aviso) asset no encontrado: ${asset}`);
    }
  }
  return { total, assets: [...assets] };
}

function check(label, htmlPath, budgetKB) {
  const { total, assets } = pageWeight(htmlPath);
  const kb = (total / KB).toFixed(1);
  const ok = total <= budgetKB * KB;
  console.log(`${ok ? '✓' : '✗'} ${label}: ${kb} KB / ${budgetKB} KB (${assets.length} assets)`);
  if (!ok) failed = true;
}

check('Portada /', 'index.html', 300);
check('Portada /nah/', 'nah/index.html', 300);
check('Artículo es', 'articulos/que-es-un-llm/index.html', 300);
check('Artículo bilingüe nah', 'nah/articulos/que-es-un-llm/index.html', 300);
check('Lite portada', 'lite/index.html', 50);
check('Lite artículo', 'lite/articulos/que-es-un-llm/index.html', 50);

process.exit(failed ? 1 : 0);
