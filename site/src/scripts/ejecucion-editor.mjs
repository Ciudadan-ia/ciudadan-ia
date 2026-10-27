export const nextStatus=current=>({draft:'review',review:'approved',approved:'draft'})[current]??'draft';
const labels={draft:'Borrador',review:'En revisión simulada',approved:'Aprobado en simulación'};
const editor=document.querySelector('[data-editor]');
if(editor){
const key='ciudadania-editor-demo-v01';
let entries=[];let storageOK=true;
try{const stored=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(stored))entries=stored.filter(x=>x&&typeof x.id==='string'&&typeof x.title==='string'&&typeof x.body==='string'&&['draft','review','approved'].includes(x.status)).slice(0,100);}catch{storageOK=false;}
const select=editor.querySelector('select'), title=editor.querySelector('input'),body=editor.querySelector('textarea'),status=editor.querySelector('[data-state]'),message=editor.querySelector('[role=status]');
let active=null;
const tell=text=>message.textContent=text;
const save=()=>{try{localStorage.setItem(key,JSON.stringify(entries));tell('Borrador guardado solo en este navegador. No se ha publicado ni enviado.');}catch{storageOK=false;tell('No se pudo guardar en el navegador. Exporta el archivo antes de salir.');}};
const fill=()=>{select.replaceChildren();entries.forEach(e=>{const option=document.createElement('option');option.value=e.id;option.textContent=e.title||'Sin título';select.append(option)});select.value=active?.id||'';title.value=active?.title||'';body.value=active?.body||'';status.textContent=labels[active?.status||'draft'];};
const fresh=()=>{active={id:crypto.randomUUID?crypto.randomUUID():`draft-${Date.now()}`,title:'Nuevo borrador de prueba',body:'Ejemplo ficticio. No introducir datos personales.',status:'draft'};entries.push(active);fill();save();};
if(!entries.length)fresh();else{active=entries[0];fill();}
select.addEventListener('change',()=>{active=entries.find(e=>e.id===select.value);fill();tell('Borrador cargado.');});
editor.querySelector('[data-save]').addEventListener('click',()=>{active.title=title.value.slice(0,200);active.body=body.value.slice(0,20000);active.status='draft';fill();save();});
editor.querySelector('[data-next]').addEventListener('click',()=>{if(title.value!==active.title||body.value!==active.body){tell('Guarda los cambios antes de avanzar. Guardar devuelve el contenido a borrador.');return;}active.status=nextStatus(active.status);fill();save();tell(`${labels[active.status]}. Esta acción no constituye revisión científica ni publicación.`);});
editor.querySelector('[data-new]').addEventListener('click',fresh);
editor.querySelector('[data-export]').addEventListener('click',()=>{const payload={schemaVersion:1,simulation:true,exportedAt:new Date().toISOString(),entries};const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='ciudadania-borradores-demo.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);tell('Archivo exportado. Su estado editorial continúa siendo una simulación local.');});
if(!storageOK)tell('Almacenamiento no disponible. Usa Exportar para conservar tu trabajo.');
}
document.querySelectorAll('[data-quiz]').forEach(form=>form.addEventListener('submit',event=>{event.preventDefault();const selected=form.querySelector('input:checked');form.querySelector('[role=status]').textContent=!selected?'Selecciona una respuesta.':Number(selected.value)===Number(form.dataset.correct)?'Correcto. Explica con tus palabras por qué.':'Revisa la lección y vuelve a intentarlo.';}));
