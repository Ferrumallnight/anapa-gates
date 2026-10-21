import { gates } from './gates.js';
const $ = id => document.getElementById(id);
const viewport = $('viewport'), scene = $('scene');
let selected = gates.find(g => g.number === 2)?.id || gates[0].id;
const phoneIcon = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 2.7c.5-.3 1.1-.1 1.4.4l2 3.8c.3.5.2 1.1-.2 1.5L8 10.1a16 16 0 0 0 5.9 5.9l1.7-1.8c.4-.4 1-.5 1.5-.2l3.8 2c.5.3.7.9.4 1.4l-1.1 2.3c-.5 1-1.6 1.5-2.7 1.3C9.8 19.5 4.5 14.2 3 6.5c-.2-1.1.3-2.2 1.3-2.7z"/></svg>';
function formatPhone(phone) { return phone?.replace(/^(\+7)(\d{3})(\d{3})(\d{4})$/, '$1 $2 $3 $4') || 'Номер пока не добавлен'; }
function select(id) {
 const gate = gates.find(g => g.id === id); if (!gate) return;
 selected = id;
 document.querySelectorAll('.marker').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.gate === id)));
 document.querySelectorAll('.gate-item').forEach(el => {const active=el.dataset.gate===id;el.setAttribute('aria-selected',String(active));el.tabIndex=active?0:-1;});
 $('gate-panel').setAttribute('aria-labelledby', `tab-${id}`);
 $('gate-panel').classList.toggle('first-tab', id===gates[0].id);
 $('gate-panel').classList.toggle('last-tab', id===gates.at(-1).id);
 $('gate-title').textContent = `Ворота ${gate.number}`;
 $('gate-description').textContent = gate.description;
 $('phone-number').textContent = formatPhone(gate.phone);
 $('copy-status').textContent='';
 const callable = /^\+[1-9]\d{7,14}$/.test(gate.phone || '');
 $('copy-phone').disabled=!callable;
 const action=document.createElement(callable?'a':'button');action.className='call';
 if(callable){action.href=`tel:${gate.phone}`;action.innerHTML=phoneIcon;action.append(document.createTextNode('Позвонить и открыть'));action.setAttribute('aria-label',`Позвонить на калитку ${gate.number}: ${gate.phone}`);}
 else{action.disabled=true;action.textContent='Номер скоро появится';}
 $('call-action').replaceChildren(action);
 $('call-note').textContent=callable?'Телефон запросит подтверждение':'Звонок станет доступен после добавления номера';
 $('photo-area').replaceChildren(document.createTextNode('Загружаем фотографию…'));
 if(gate.photo){const img=new Image();img.alt=`Калитка ${gate.number}`;img.onload=()=>{if(selected===id)$('photo-area').replaceChildren(img);};img.onerror=()=>{if(selected===id)$('photo-area').textContent='Не удалось загрузить фотографию';};img.src=gate.photo;}else $('photo-area').textContent='Фотография появится здесь';
}
for(const gate of gates){
 const marker=document.createElement('button');marker.className='marker';marker.dataset.gate=gate.id;marker.textContent=gate.number;marker.style.left=`${gate.x}%`;marker.style.top=`${gate.y}%`;marker.setAttribute('aria-label',`Калитка ${gate.number}`);marker.onclick=()=>select(gate.id);$('markers').append(marker);
 const item=document.createElement('button');item.className='gate-item';item.dataset.gate=gate.id;item.id=`tab-${gate.id}`;item.setAttribute('role','tab');item.setAttribute('aria-controls','gate-panel');item.setAttribute('aria-label',`Калитка ${gate.number}`);item.textContent=gate.number;item.onclick=()=>select(gate.id);$('gate-list').append(item);
}
$('gate-list').addEventListener('keydown',e=>{let i=gates.findIndex(g=>g.id===selected);if(e.key==='ArrowRight')i=(i+1)%gates.length;else if(e.key==='ArrowLeft')i=(i-1+gates.length)%gates.length;else if(e.key==='Home')i=0;else if(e.key==='End')i=gates.length-1;else return;e.preventDefault();select(gates[i].id);$(`tab-${gates[i].id}`).focus();});
$('copy-phone').onclick=async()=>{const id=selected;const phone=gates.find(g=>g.id===id)?.phone;if(!phone)return;try{await navigator.clipboard.writeText(phone);if(selected===id)$('copy-status').textContent='Номер скопирован';}catch{if(selected===id)$('copy-status').textContent='Не удалось скопировать. Зажмите номер, чтобы выделить его.';}};
select(selected);
let scale = 1, tx = 0, ty = 0, width = 0, height = 0;
function draw() {
  const w = viewport.clientWidth, h = viewport.clientHeight;
  tx = width * scale <= w ? (w - width * scale) / 2 : Math.min(0, Math.max(w - width * scale, tx));
  ty = height * scale <= h ? (h - height * scale) / 2 : Math.min(0, Math.max(h - height * scale, ty));
  scene.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`;
  scene.style.setProperty('--inverse', 1 / scale);
  $('zoom-in').disabled = scale >= 4; $('zoom-out').disabled = scale <= 1;
}
function reset() { width = Math.min(viewport.clientWidth, viewport.clientHeight * 1200 / 660); height = width * 660 / 1200; scene.style.width = `${width}px`; scale = 1; tx = 0; ty = (viewport.clientHeight - height) / 2; draw(); }
function zoom(next, x = viewport.clientWidth / 2, y = viewport.clientHeight / 2) {
  next = Math.max(1, Math.min(4, next)); const ratio = next / scale;
  tx = x - (x - tx) * ratio; ty = y - (y - ty) * ratio; scale = next; draw();
}
$('zoom-in').onclick = () => zoom(scale * 1.4); $('zoom-out').onclick = () => zoom(scale / 1.4); $('reset').onclick = reset;
viewport.addEventListener('wheel', e => { e.preventDefault(); const r = viewport.getBoundingClientRect(); zoom(scale * Math.exp(-e.deltaY * .002), e.clientX - r.left, e.clientY - r.top); }, { passive: false });
const pointers = new Map(); let prior = null, moved = false;
function gesture() { const p = [...pointers.values()]; return { x: p.reduce((n,v) => n+v.x,0)/p.length, y:p.reduce((n,v)=>n+v.y,0)/p.length, distance:p.length>1?Math.hypot(p[1].x-p[0].x,p[1].y-p[0].y):0 }; }
viewport.addEventListener('pointerdown', e => { if(e.target.closest('.controls'))return; pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}); prior=gesture(); moved=false; if(!e.target.closest('button'))viewport.setPointerCapture(e.pointerId); });
viewport.addEventListener('pointermove', e => { if(!pointers.has(e.pointerId))return; pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}); const now=gesture(); const dx=now.x-prior.x,dy=now.y-prior.y; if(Math.abs(dx)+Math.abs(dy)>2)moved=true; tx+=dx;ty+=dy; if(now.distance && prior.distance){ const r=viewport.getBoundingClientRect();zoom(scale*now.distance/prior.distance,now.x-r.left,now.y-r.top); }else draw();prior=now; });
function end(e){ pointers.delete(e.pointerId); prior=pointers.size?gesture():null; }
viewport.addEventListener('pointerup',end);viewport.addEventListener('pointercancel',end);
viewport.addEventListener('click',e=>{if(moved&&!e.target.closest('.controls')){e.stopPropagation();e.preventDefault();moved=false;}},true);
viewport.addEventListener('keydown', e => { if(e.target!==viewport)return; if(['+','=','-','0','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))e.preventDefault(); if(e.key==='+'||e.key==='=')zoom(scale*1.4);if(e.key==='-')zoom(scale/1.4);if(e.key==='0')reset();if(e.key==='ArrowLeft')tx+=40;if(e.key==='ArrowRight')tx-=40;if(e.key==='ArrowUp')ty+=40;if(e.key==='ArrowDown')ty-=40;draw(); });
new ResizeObserver(reset).observe(viewport);
let installPrompt;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installPrompt=e; });
$('install').onclick = async () => { if(installPrompt){await installPrompt.prompt();installPrompt=null;}else $('install-help').showModal(); };
$('close-help').onclick=()=>$('install-help').close();
function connection(){ $('connection').textContent=navigator.onLine?'':'Нет интернета · звонки используют мобильную связь'; }
window.addEventListener('online',connection);window.addEventListener('offline',connection);connection();
if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{ $('connection').textContent='Офлайн-режим недоступен'; });
