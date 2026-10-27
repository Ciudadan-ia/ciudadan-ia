import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve('prototypes/ejecucion-90d/public');
const data=JSON.parse(fs.readFileSync(path.join(root,'content.json'),'utf8'));
assert.equal(data.lessons.length,10);assert.equal(data.faqs.length,20);assert.equal(data.news.length,10);
assert.deepEqual(data.locales,['es','nah','yua']);
const ids=new Set();for(const item of [...data.lessons,...data.faqs,...data.news]){assert(!ids.has(item.id));ids.add(item.id);assert.equal(item.status,'draft');assert(item.title.length>5);assert(item.body.length>30);}
for(const item of data.lessons){assert(item.activity.length>20);assert(item.answers[item.correct]);assert(item.sources.every(id=>data.sources.some(s=>s.id===id)));}
for(const item of data.news){assert.equal(item.eventDate,null);assert.equal(item.sources.length,0);}
for(const edition of ['index.html','nah/index.html','yua/index.html']){const text=fs.readFileSync(path.join(root,edition),'utf8');assert(text.includes('Saltar al contenido'));assert(text.includes('pendiente'));assert.equal((text.match(/data-quiz/g)||[]).length,10);assert(!text.includes('portugués'));for(const link of text.matchAll(/(?:href|src)="([^"]+)"/g)){if(link[1].startsWith('http')||link[1].startsWith('#'))continue;assert(fs.existsSync(path.resolve(path.dirname(path.join(root,edition)),link[1])),'Enlace local roto: '+link[1]);}}
const script=fs.readFileSync(path.join(root,'editor.mjs'),'utf8');assert(!/innerHTML|outerHTML|insertAdjacentHTML|eval\(/.test(script),'Contenido editable debe renderizarse como texto');
const workflow=script.match(/export const nextStatus=current=>([^;]+);/)[1];
// Comprueba la máquina de estados de la simulación sin cargar el DOM del navegador.
const nextStatus=(await import('data:text/javascript,export const nextStatus=current=>'+encodeURIComponent(workflow))).nextStatus;
assert.equal(nextStatus('draft'),'review');assert.equal(nextStatus('review'),'approved');assert.equal(nextStatus('approved'),'draft');assert.equal(nextStatus('unexpected'),'draft');
assert(script.includes("active.status='draft'"),'Editar debe invalidar la aprobación simulada');assert(script.includes('simulation:true'));assert(!script.includes('fetch('),'La demo no debe enviar datos');
const astro=path.resolve('site/src/pages');assert(fs.existsSync(astro),'Falta la base de páginas Astro');{for(const route of ['v1','aprender','faq','noticias','biblioteca','editorial-demo'])assert(fs.existsSync(path.join(astro,route+'.astro')));}
console.log('Verificación web correcta: 10 lecciones, 20 FAQ, 10 fichas borrador; 3 muestras navegables; enlaces locales; renderizado seguro de texto; transiciones editoriales.');
