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
check('Temas (hub)', 'temas/index.html', 300);
check('Tema tecnologia', 'temas/tecnologia/index.html', 300);
check('Todos los artículos', 'articulos/index.html', 300);
check('Glosario', 'glosario/index.html', 300);
check('Buscar', 'buscar/index.html', 300);

// --- Gate global: ninguna página puede crecer sin control (constitución III) ---
console.log('\n— gate global de HTML —');
{
  const { readdirSync, statSync } = await import('node:fs');
  const LIMIT_HTML = 120 * KB;
  const LIMIT_LITE = 45 * KB;
  const offenders = [];
  const warnings = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      const st = statSync(full);
      if (st.isDirectory()) walk(full);
      else if (name.endsWith('.html')) {
        const rel = full.replace(DIST, '');
        const isLite = rel.startsWith('/lite/') || rel.startsWith('lite/');
        const limit = isLite ? LIMIT_LITE : LIMIT_HTML;
        if (st.size > limit) offenders.push([rel, st.size, limit]);
        else if (st.size > limit * 0.9) warnings.push([rel, st.size, limit]);
      }
    }
  };
  walk(DIST);
  for (const [rel, size, limit] of warnings) {
    console.log(`  (aviso) ${rel}: ${(size / KB).toFixed(1)} KB — 90 % del límite de ${limit / KB} KB`);
  }
  if (offenders.length === 0) {
    console.log(`✓ todas las páginas HTML bajo el límite (120 KB · lite 45 KB)`);
  } else {
    failed = true;
    console.log(`✗ ${offenders.length} página(s) sobre el límite:`);
    for (const [rel, size, limit] of offenders.slice(0, 10)) {
      console.log(`   ${rel}: ${(size / KB).toFixed(1)} KB / ${limit / KB} KB`);
    }
  }
}

process.exit(failed ? 1 : 0);
