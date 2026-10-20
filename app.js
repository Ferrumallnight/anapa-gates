import { gates } from './gates.js';
const $ = id => document.getElementById(id);
const viewport = $('viewport'), scene = $('scene');
let selected = gates.find(g => g.number === 2)?.id || gates[0].id;
const placeholder = $('photo-area').innerHTML;
function select(id) {
  const gate = gates.find(g => g.id === id); if (!gate) return;
  selected = id;
  document.querySelectorAll('[data-gate]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.gate === id)));
  $('gate-title').textContent = `Калитка ${gate.number}`;
  $('selected-index').textContent = `${String(gate.number).padStart(2, '0')} / ${String(gates.length).padStart(2, '0')}`;
  $('gate-description').textContent = gate.description;
  const callable = /^\+[1-9]\d{7,14}$/.test(gate.phone || '');
  $('gate-status').textContent = callable ? '● Номер для открытия добавлен' : '○ Номер ещё не добавлен';
  const action = document.createElement(callable ? 'a' : 'button');
  action.className = 'call';
  if (callable) { action.href = `tel:${gate.phone}`; action.textContent = '↗  Позвонить и открыть'; action.setAttribute('aria-label', `Позвонить на калитку ${gate.number}: ${gate.phone}`); }
  else { action.disabled = true; action.textContent = 'Номер скоро появится'; }
  $('call-action').replaceChildren(action);
  $('call-note').textContent = callable ? `${gate.phone} · iPhone запросит подтверждение` : 'Звонок станет доступен после добавления номера';
  $('photo-area').innerHTML = placeholder;
  $('photo-area').classList.remove('has-photo');
  if (gate.photo) { const img = new Image(); img.alt = `Калитка ${gate.number}`; img.onload = () => { if (selected === id) { $('photo-area').replaceChildren(img); $('photo-area').classList.add('has-photo'); } }; img.src = gate.photo; }
}
for (const gate of gates) {
  const marker = document.createElement('button');
  marker.className = 'marker'; marker.dataset.gate = gate.id; marker.textContent = gate.number;
  marker.style.left = `${gate.x}%`; marker.style.top = `${gate.y}%`;
  marker.setAttribute('aria-label', `Калитка ${gate.number}`);
  marker.addEventListener('click', () => select(gate.id)); $('markers').append(marker);
  const item = document.createElement('button'); item.className = 'gate-item'; item.dataset.gate = gate.id;
  const number = document.createElement('span'); number.className = 'gate-number'; number.textContent = gate.number;
  const text = document.createElement('span'), title = document.createElement('strong'), status = document.createElement('small');
  title.textContent = `Калитка ${gate.number}`; status.textContent = gate.phone ? 'Номер добавлен' : 'Нет номера';
  text.append(title, status); item.append(number, text); item.addEventListener('click', () => select(gate.id)); $('gate-list').append(item);
}
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
function connection(){ $('connection').textContent=navigator.onLine?`${gates.length} калиток`:'Офлайн · карта сохранена'; }
window.addEventListener('online',connection);window.addEventListener('offline',connection);connection();
if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{ $('connection').textContent='Офлайн-режим недоступен'; });
