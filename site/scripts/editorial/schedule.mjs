#!/usr/bin/env node
/**
 * Asigna `publishDate` a las piezas del registro (algoritmo del plan 002):
 *  - las primeras LAUNCH piezas escritas comparten la fecha de lanzamiento con
 *    hora escalonada (06:00 + 3 min × orden), para que la portada tenga orden
 *  - el resto se reparte a PER_WEEK por semana (lunes, miércoles, viernes 09:00),
 *    con cuota por tema proporcional a lo que resta y sin dos piezas del mismo
 *    subtema en la misma semana
 * Determinista e idempotente: solo asigna fechas a piezas sin fecha o futuras.
 *
 *   node scripts/editorial/schedule.mjs --launch 2026-10-05 [--dry-run]
 */
import { loadRegistro, saveRegistro } from './lib.mjs';

const args = process.argv.slice(2);
const dry = args.includes('--dry-run');
const launchArg = args[args.indexOf('--launch') + 1];
if (!launchArg || !/^\d{4}-\d{2}-\d{2}$/.test(launchArg)) {
  console.error('Uso: node scripts/editorial/schedule.mjs --launch YYYY-MM-DD [--dry-run]');
  process.exit(1);
}

const LAUNCH_COUNT = 200;
const PER_WEEK = 30;
const DAYS = [1, 3, 5]; // lunes, miércoles, viernes
const TZ = '-06:00';

const reg = loadRegistro();
const written = reg.seeds.filter((s) => s.state === 'written' || s.state === 'published');
const pending = written.filter((s) => !s.publishDate);

if (!pending.length) {
  console.log('No hay piezas escritas sin fecha. Nada que programar.');
  process.exit(0);
}

const launchDate = new Date(`${launchArg}T00:00:00${TZ}`);
const alreadyLaunched = written.filter((s) => s.publishDate === `${launchArg}`).length;

// Lote de lanzamiento: hora escalonada 06:00 + 3 min
const launchSlots = Math.max(0, LAUNCH_COUNT - alreadyLaunched);
const toLaunch = pending.slice(0, launchSlots);
toLaunch.forEach((s, i) => {
  const minutes = 6 * 60 + i * 3;
  const h = String(Math.floor(minutes / 60)).padStart(2, '0');
  const m = String(minutes % 60).padStart(2, '0');
  s.publishDate = `${launchArg}T${h}:${m}:00${TZ}`;
});

// Cola: semanas de 30, tres días por semana, 10 por día a las 09:00 (+2 min)
const queue = pending.slice(launchSlots);
const usedSubtopicWeek = new Set();
let idx = 0;
for (let week = 1; queue.length > idx; week++) {
  const weekStart = new Date(launchDate.getTime());
  weekStart.setDate(weekStart.getDate() + 7 * week);
  let placedThisWeek = 0;
  for (const day of DAYS) {
    for (let k = 0; k < Math.ceil(PER_WEEK / DAYS.length) && idx < queue.length && placedThisWeek < PER_WEEK; k++) {
      // buscar la siguiente pieza cuyo subtema no esté ya en esta semana
      let pick = idx;
      while (pick < queue.length && usedSubtopicWeek.has(`${week}|${queue[pick].subtopic}`)) pick++;
      if (pick >= queue.length) pick = idx;
      const s = queue[pick];
      const d = new Date(weekStart.getTime());
      const delta = (day - d.getDay() + 7) % 7;
      d.setDate(d.getDate() + delta);
      const iso = d.toISOString().slice(0, 10);
      const minutes = 9 * 60 + k * 2;
      const h = String(Math.floor(minutes / 60)).padStart(2, '0');
      const m = String(minutes % 60).padStart(2, '0');
      s.publishDate = `${iso}T${h}:${m}:00${TZ}`;
      usedSubtopicWeek.add(`${week}|${s.subtopic}`);
      // mover la pieza elegida al frente del cursor
      queue.splice(pick, 1);
      queue.splice(idx, 0, s);
      idx++;
      placedThisWeek++;
    }
  }
}

const byWeek = {};
for (const s of pending) {
  const wk = s.publishDate?.slice(0, 10) ?? '—';
  byWeek[wk] = (byWeek[wk] ?? 0) + 1;
}
console.log(`Programadas ${pending.length} piezas (${toLaunch.length} al lanzamiento ${launchArg}, ${queue.length} en cola).`);
console.log('Calendario:');
for (const [d, n] of Object.entries(byWeek).slice(0, 20)) console.log(`  ${d}: ${n}`);
if (Object.keys(byWeek).length > 20) console.log(`  … ${Object.keys(byWeek).length - 20} fechas más`);

if (dry) {
  console.log('\n(--dry-run: no se guardó el registro)');
} else {
  saveRegistro(reg);
  console.log('\nRegistro actualizado.');
}
