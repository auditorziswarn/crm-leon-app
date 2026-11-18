'use strict';
// ---- Almacén: hoy localStorage. Para pasar a Drive/DB solo se cambian load() y save(). ----
const KEY = 'crm-leon-v1';
const store = {
  async load() {
    try { const t = localStorage.getItem(KEY); if (t) return JSON.parse(t); } catch (e) {}
    try { const r = await fetch('semilla.json'); if (!r.ok) throw 0; const d = await r.json(); store.save(d); return d; }
    catch (e) { return null; }   // versión publicada sin datos: se cargan desde un respaldo
  },
  save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { alert('No se pudo guardar: ' + e.message); } }
};

// ---- datos de referencia (fichas + sucursales): solo lectura, no se mezclan con lo capturado ----
let X = { fichas: {}, sucursales: {} };
const KEYX = 'crm-leon-extra';
const guardaExtra = () => { try { localStorage.setItem(KEYX, JSON.stringify(X)); } catch (e) { alert('No se pudieron guardar las fichas: ' + e.message); } };
const cargaExtra = async () => {
  try { const t = localStorage.getItem(KEYX); if (t) { X = JSON.parse(t); return; } } catch (e) {}
  try { const r = await fetch('datos-extra.json'); if (r.ok) X = await r.json(); } catch (e) {}
};
// Aplica un respaldo (marcas, bitácora, listas y, si trae, las fichas)
function aplicaRespaldo(d) {
  if (!d.marcas || !d.listas) throw 0;
  if (d.extra) { X = d.extra; guardaExtra(); delete d.extra; }
  D = d; persist();
}

let D, view = 'hoy', F = { q: '', pri: '', est: '', aj: '' }, tabF = 'seg';
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const hoy = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const persist = () => store.save(D);

// ---- helpers de contacto ----
const phones = s => (String(s ?? '').match(/\+?\d[\d\s-]{8,}\d/g) || []).map(p => p.replace(/[\s-]/g, ''));
const norm = p => { p = p.replace(/^\+/, ''); if (p.length === 10) p = '52' + p; return p; };
const emails = s => String(s ?? '').match(/[\w.+-]+@[\w-]+\.[\w.-]+/g) || [];
const urls = s => String(s ?? '').match(/https?:\/\/[^\s|)]+/g) || [];

function acciones(m) {
  const out = [];
  const wa = phones(m['WhatsApp']);
  const tel = phones(m['Teléfono']);
  new Set([...wa, ...(wa.length ? [] : tel)]).forEach(p => out.push(`<a class="wa" href="https://wa.me/${norm(p)}" target="_blank">WhatsApp ${esc(p)}</a>`));
  new Set(tel).forEach(p => out.push(`<a href="tel:${p}">Llamar ${esc(p)}</a>`));
  new Set([...emails(m['Correo']), ...emails(m['Contacto de franquicias'])]).forEach(c => out.push(`<a href="mailto:${c}">${esc(c)}</a>`));
  urls(m['Formulario / contacto web']).forEach(u => out.push(`<a href="${u}" target="_blank">Formulario / web</a>`));
  [['Sitio web', 'Sitio'], ['Instagram', 'Instagram'], ['Facebook', 'Facebook']].forEach(([k, t]) => urls(m[k]).slice(0, 1).forEach(u => out.push(`<a href="${u}" target="_blank">${t}</a>`)));
  return out.join('') || '<span class="mut">Sin contacto directo registrado</span>';
}

// ---- mini-markdown para las fichas ----
function inline(t) {
  return t.split(/(https?:\/\/[^\s)|"”]*[^\s)|"”.,;:])/).map((p, i) => i % 2
    ? `<a href="${esc(p)}" target="_blank" rel="noopener">${esc(p.replace(/^https?:\/\/(www\.)?/, '').slice(0, 48))}</a>`
    : esc(p).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`([^`]+)`/g, '<code>$1</code>')).join('');
}
function md(s) {
  const L = String(s || '').split('\n'), out = []; let i = 0;
  while (i < L.length) {
    const l = L[i];
    if (/^\s*\|/.test(l)) {
      const rows = []; while (i < L.length && /^\s*\|/.test(L[i])) rows.push(L[i++]);
      const cells = r => r.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
      const body = rows.filter(r => !/^\s*\|[\s:|-]+\|?\s*$/.test(r)).map(cells);
      out.push(`<div class="tw"><table>${body.map((r, k) => `<tr>${r.map(c => k ? `<td>${inline(c)}</td>` : `<th>${inline(c)}</th>`).join('')}</tr>`).join('')}</table></div>`);
    } else if (/^\s*([-*]|\d+[.)])\s+/.test(l)) {
      const it = []; while (i < L.length && /^\s*([-*]|\d+[.)])\s+/.test(L[i])) it.push(L[i++].replace(/^\s*([-*]|\d+[.)])\s+/, ''));
      out.push(`<ul>${it.map(x => `<li>${inline(x)}</li>`).join('')}</ul>`);
    } else if (/^#{3,}\s/.test(l)) { out.push(`<h4>${inline(l.replace(/^#+\s*/, ''))}</h4>`); i++; }
    else if (!l.trim()) i++;
    else {
      const t = l.trim(), q = t.match(/^"([\s\S]+)"$/);
      out.push(q ? `<div class="quote">${inline(t)}<button class="b g cp" data-t="${esc(q[1])}">Copiar</button></div>` : `<p>${inline(t)}</p>`); i++;
    }
  }
  return out.join('');
}

const AJ = ['Alto', 'Medio-Alto', 'Medio', 'Medio-Bajo', 'Bajo'];
const ajuste = m => (X.fichas[m.Marca] || {}).ajuste;
const ajTag = a => a ? `<span class="tag aj-${a}">Ajuste ${esc(a)}</span>` : '';
const sucDe = m => X.sucursales[m.Marca] || [];

// ---- vistas ----
function head() { $('#sub').textContent = `${D.marcas.length} marcas · ${D.marcas.filter(m => m.Estado !== 'Sin contactar').length} trabajadas`; document.querySelectorAll('nav button').forEach(b => b.classList.toggle('on', b.dataset.v === view)); }
const prioN = { Alta: 0, Media: 1, Baja: 2 };

function cardHtml(m) {
  const late = m['Fecha próxima acción'] && m['Fecha próxima acción'] < hoy();
  const ns = sucDe(m).length, tf = X.fichas[m.Marca];
  return `<div class="card" data-id="${m['#']}"><div class="row"><span class="nm">${esc(m.Marca)}</span><span>${ajTag(ajuste(m))}<span class="tag ${m.Prioridad}">${esc(m.Prioridad)}</span></span></div>
  <div class="mut">${esc(m.Giro)} · ${esc(m.Estado)}${m.Responsable ? ' · ' + esc(m.Responsable) : ''}${ns ? ` · ${ns} ficha${ns > 1 ? 's' : ''} Uber Eats` : ''}${tf ? ' · con ficha' : ''}</div>
  ${m['Próxima acción'] ? `<div class="${late ? 'late' : 'mut'}">➜ ${esc(m['Próxima acción'])} ${esc(m['Fecha próxima acción'] || '')}</div>` : ''}</div>`;
}

function vHoy() {
  const t = hoy();
  const act = D.marcas.filter(m => m['Fecha próxima acción'] && m['Fecha próxima acción'] <= t && !['Cliente', 'Perdido', 'No contactar'].includes(m.Estado))
    .sort((a, b) => a['Fecha próxima acción'].localeCompare(b['Fecha próxima acción']));
  const nuevos = D.marcas.filter(m => m.Estado === 'Sin contactar' && !m['Fecha próxima acción'])
    .sort((a, b) => prioN[a.Prioridad] - prioN[b.Prioridad] || a['#'] - b['#']).slice(0, 8);
  return `<h3>Seguimientos pendientes (${act.length})</h3>${act.map(cardHtml).join('') || '<p class="mut">Nada vencido. Registra un contacto y fija su próxima acción.</p>'}
  <h3>Siguientes por contactar</h3>${nuevos.map(cardHtml).join('')}`;
}

function vCartera() {
  const opt = (arr, v) => `<option value="">${v}</option>` + arr.map(x => `<option ${F[v === 'Prioridad' ? 'pri' : 'est'] === x ? 'selected' : ''}>${esc(x)}</option>`).join('');
  return `<div class="filters"><input id="q" placeholder="Buscar marca, giro, dirección, notas…" value="${esc(F.q)}">
  <select id="fp">${opt(D.listas.Prioridad, 'Prioridad')}</select><select id="fe">${opt(D.listas.Estado, 'Estado')}</select>
  <select id="fa"><option value="">Ajuste</option>${AJ.map(x => `<option ${F.aj === x ? 'selected' : ''}>${x}</option>`).join('')}</select></div><div id="lista"></div>`;
}
function pintaLista() {
  const q = F.q.toLowerCase();
  const r = D.marcas.filter(m => (!F.pri || m.Prioridad === F.pri) && (!F.est || m.Estado === F.est) && (!F.aj || ajuste(m) === F.aj) &&
    (!q || [m.Marca, m.Giro, m['Notas / resultado'], ...sucDe(m).map(s => s['Dirección'])].join(' ').toLowerCase().includes(q)))
    .sort((a, b) => prioN[a.Prioridad] - prioN[b.Prioridad] || a['#'] - b['#']);
  $('#lista').innerHTML = `<p class="mut">${r.length} resultados</p>` + r.map(cardHtml).join('');
}

// ---- panorama: qué tanto tenemos del negocio ----
function vPanorama() {
  const M = D.marcas, N = M.length, has = k => M.filter(m => m[k]).length;
  const cnt = fn => { const c = {}; M.forEach(m => { const k = fn(m); if (k) c[k] = (c[k] || 0) + 1; }); return Object.entries(c).sort((a, b) => b[1] - a[1]); };
  const bar = (rows, key, max) => rows.map(([k, v]) => `<div class="bar" ${key ? `data-f="${key}" data-v="${esc(k)}"` : ''}><span class="bl">${esc(k)}</span><span class="bt"><i style="width:${Math.max(3, v / (max || N) * 100)}%"></i></span><span class="bn">${v}</span></div>`).join('');
  const tile = (n, t, s) => `<div class="tile"><b>${n}</b><span>${t}</span>${s ? `<em>${s}</em>` : ''}</div>`;
  const fichas = M.filter(m => X.fichas[m.Marca]).length;
  const ue = Object.values(X.sucursales).reduce((a, r) => a + Math.max(0, ...r.map(s => +s['Sucursales en Uber Eats'] || 0)), 0);
  const filasUE = Object.values(X.sucursales).reduce((a, r) => a + r.length, 0);
  const cal = Object.values(X.sucursales).flat().map(s => +s['Calif. Uber Eats']).filter(x => x > 0);
  const calp = cal.length ? (cal.reduce((a, b) => a + b, 0) / cal.length).toFixed(2) : '—';
  const wa = M.filter(m => phones(m.WhatsApp).length).length, tel = M.filter(m => phones(m['Teléfono']).length).length;
  const cor = M.filter(m => emails(m.Correo).length || emails(m['Contacto de franquicias']).length).length;
  const frm = M.filter(m => urls(m['Formulario / contacto web']).length).length;
  const ig = M.filter(m => urls(m.Instagram).length || urls(m.Facebook).length).length;
  const alguno = M.filter(m => phones(m.WhatsApp).length || phones(m['Teléfono']).length || emails(m.Correo).length || emails(m['Contacto de franquicias']).length || urls(m['Formulario / contacto web']).length).length;
  const propios = cnt(m => { const p = (sucDe(m).map(s => s['Pedidos propios']).find(Boolean) || '').toString(); return !p ? 'Sin dato' : /^(n\/?a|no)/i.test(p) ? 'No tiene' : 'Tiene / por revisar'; });
  const fr = cnt(m => (m['Franquicia / tipo'] || 'Sin dato').split(/[;(]/)[0].trim().slice(0, 32));
  const ver = cnt(m => /re-?verific|confirmad/i.test(m['Verificación'] || '') ? 'Re-verificado / confirmado' : m['Verificación'] ? 'Verificado parcial / por verificar' : 'Sin verificación');
  const bajoUE = cnt(m => { const c = sucDe(m).map(s => +s['Calif. Uber Eats']).filter(x => x > 0); return c.length ? (Math.max(...c) >= 4.5 ? '4.5 o más' : Math.max(...c) >= 4 ? '4.0 – 4.4' : 'Menos de 4') : 'Sin calificación'; });
  const ordenA = M.filter(m => ajuste(m) === 'Alto' || ajuste(m) === 'Medio-Alto').sort((a, b) => prioN[a.Prioridad] - prioN[b.Prioridad]);
  return `<div class="tiles">${tile(N, 'marcas en cartera', `${M.filter(m => m.Estado === 'Sin contactar').length} sin contactar`)}${tile(fichas, 'con ficha completa', `de ${N}`)}${tile(filasUE, 'fichas Uber Eats', `${ue} sucursales declaradas`)}${tile(calp, 'calificación media UE', `${cal.length} fichas con dato`)}</div>
  <h3>Contacto: qué tenemos</h3><p class="mut">Marcas con cada tipo de dato registrado (de ${N}).</p>
  ${bar([['Algún contacto directo', alguno], ['WhatsApp', wa], ['Teléfono', tel], ['Correo', cor], ['Formulario / web', frm], ['Instagram / Facebook', ig]])}
  <h3>Ajuste con DeliPROPIO</h3>${bar(AJ.map(a => [a, M.filter(m => ajuste(m) === a).length]).filter(r => r[1]), 'aj')}
  <p class="mut">Toca una barra para ver esas marcas en Cartera.</p>
  <h3>Prioridad</h3>${bar(cnt(m => m.Prioridad), 'pri')}
  <h3>Estado del embudo</h3>${bar(cnt(m => m.Estado), 'est')}
  <h3>Giro (top 12)</h3>${bar(cnt(m => m.Giro).slice(0, 12), 'q')}
  <h3>Tipo de negocio</h3>${bar(fr.slice(0, 8))}
  <h3>Pedidos propios hoy</h3>${bar(propios)}
  <h3>Calificación Uber Eats (mejor sucursal)</h3>${bar(bajoUE)}
  <h3>Calidad de los datos</h3>${bar(ver)}
  <h3>Para contactar primero (ajuste alto)</h3>${ordenA.map(cardHtml).join('') || '<p class="mut">Sin marcas.</p>'}`;
}

function vBitacora() {
  const b = [...D.bitacora].reverse();
  return b.map(x => `<div class="card"><div class="row"><span class="nm">${esc(x.Marca)}</span><span class="mut">${esc(x.Fecha)}</span></div>
  <div class="mut">${esc(x.Canal)} · ${esc(x.Responsable)} → ${esc(x['Estado resultante'])}</div><div>${esc(x['Qué se hizo / qué dijeron'])}</div>
  ${x['Siguiente paso'] ? `<div class="mut">➜ ${esc(x['Siguiente paso'])}</div>` : ''}</div>`).join('') || '<p class="mut">Aún no hay contactos registrados.</p>';
}

function vAjustes() {
  return `<h3>Respaldo</h3><p class="mut">Todo vive en este navegador. Descarga un respaldo seguido.</p>
  <div class="acts"><button class="b" id="exj">Descargar respaldo (.json)</button><button class="b g" id="exc">Exportar cartera (.csv para Excel)</button></div>
  <h3>Restaurar</h3><input type="file" id="imp" accept=".json"><p class="mut">Reemplaza todo lo actual con el respaldo elegido.</p>
  <h3>Volver al Excel original</h3><button class="b g" id="rst">Borrar cambios y recargar semilla</button>`;
}

function render() {
  head();
  $('#main').innerHTML = { hoy: vHoy, cartera: vCartera, panorama: vPanorama, bitacora: vBitacora, ajustes: vAjustes }[view]();
  if (view === 'cartera') {
    pintaLista();
    $('#q').oninput = e => { F.q = e.target.value; pintaLista(); };
    $('#fp').onchange = e => { F.pri = e.target.value; pintaLista(); };
    $('#fe').onchange = e => { F.est = e.target.value; pintaLista(); };
    $('#fa').onchange = e => { F.aj = e.target.value; pintaLista(); };
  }
  if (view === 'ajustes') ajustes();
}

// ---- ficha completa y sucursales (solo lectura) ----
function fichaHtml(m) {
  const f = X.fichas[m.Marca];
  if (!f) return '<p class="mut">Esta marca todavía no tiene ficha de investigación.</p>';
  const abiertas = /ejecutiva|contactos|ajuste/i;
  return `<p class="mut">Investigación del 17 nov 2026 (${esc(f.slug)}.md). Lo marcado "por verificar" no está confirmado.</p>` +
    f.secciones.filter(s => s.md).map(s => `<details ${abiertas.test(s.t) ? 'open' : ''}><summary>${esc(s.t)}</summary>${md(s.md)}</details>`).join('');
}
function sucHtml(m) {
  const rows = sucDe(m);
  if (!rows.length) return '<p class="mut">Sin filas de Uber Eats para esta marca.</p>';
  const shown = ['#', 'Negocio', 'Marca (agrupada)', 'Dirección', 'CP', 'Tel.', 'Calif. Uber Eats', 'N° calif. Uber Eats', 'Categorías Uber Eats', 'Precio', 'Ficha Uber Eats'];
  return `<p class="mut">${rows.length} ficha${rows.length > 1 ? 's' : ''} en Uber Eats (captura 12 nov). Los horarios y sucursales completas están en la pestaña Ficha.</p>` + rows.map(s => {
    const dir = s['Dirección'], tel = phones(s['Tel.'])[0];
    const otros = Object.entries(s).filter(([k, v]) => !shown.includes(k) && v !== undefined);
    return `<div class="card nohover"><div class="row"><span class="nm">${esc(s.Negocio)}</span>${s['Calif. Uber Eats'] ? `<span class="tag">★ ${esc(s['Calif. Uber Eats'])} (${esc(s['N° calif. Uber Eats'] || '?')})</span>` : ''}</div>
    ${dir ? `<div class="kv">📍 ${esc(dir)}${s.CP ? ', CP ' + esc(s.CP) : ''}</div>` : ''}
    ${s['Categorías Uber Eats'] ? `<div class="mut">${esc(s['Categorías Uber Eats'])}${s.Precio ? ' · ' + esc(s.Precio) : ''}</div>` : ''}
    <div class="acts">${dir ? `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dir + ', ' + (s.CP || '') + ' León, Gto.')}" target="_blank" rel="noopener">Mapa</a>` : ''}${tel ? `<a href="tel:${tel}">Llamar ${esc(tel)}</a>` : ''}${s['Ficha Uber Eats'] ? `<a href="${esc(s['Ficha Uber Eats'])}" target="_blank" rel="noopener">Uber Eats</a>` : ''}</div>
    <details><summary>Todos los datos de esta fila</summary>${otros.map(([k, v]) => `<div class="kv"><b>${esc(k)}:</b> ${inline(String(v))}</div>`).join('')}</details></div>`;
  }).join('');
}

// ---- ficha ----
const sel = (arr, v) => `<option value=""></option>` + arr.map(x => `<option ${x === v ? 'selected' : ''}>${esc(x)}</option>`).join('');
function ficha(id) {
  const m = D.marcas.find(x => x['#'] == id), L = D.listas;
  const kv = k => m[k] ? `<div class="kv"><b>${k}:</b> ${esc(m[k])}</div>` : '';
  const hist = D.bitacora.filter(x => x.Marca === m.Marca).reverse();
  $('#sheet').hidden = false; $('#sheet').scrollTop = 0;
  $('#sheet').innerHTML = `<div><div class="top"><button class="b g" id="cl">← Volver</button><button class="b" id="sv">Guardar</button></div>
  <h2 style="margin:6px 0">${esc(m.Marca)} <span class="tag ${m.Prioridad}">${esc(m.Prioridad)}</span></h2>
  <div class="mut">${esc(m.Giro)} · ${esc(m['Franquicia / tipo'])} · ${esc(m['Sucursales en León'])}</div>
  <div class="acts">${acciones(m)}</div>
  <div class="kv">${ajTag(ajuste(m))} <b>Short sugerido:</b> ${esc(m['Short sugerido'])}</div>
  <div class="seg">${[['seg', 'Seguimiento'], ['fic', 'Ficha'], ['suc', `Sucursales (${sucDe(m).length})`]].map(([k, t]) => `<button data-tab="${k}" class="${tabF === k ? 'on' : ''}">${t}</button>`).join('')}</div>
  <div class="pn" data-p="fic" ${tabF === 'fic' ? '' : 'hidden'}>${fichaHtml(m)}</div>
  <div class="pn" data-p="suc" ${tabF === 'suc' ? '' : 'hidden'}>${sucHtml(m)}</div>
  <div class="pn" data-p="seg" ${tabF === 'seg' ? '' : 'hidden'}>
  <h3>Seguimiento</h3>
  <label>Estado</label><select id="f-est">${sel(L.Estado, m.Estado)}</select>
  <label>Prioridad</label><select id="f-pri">${sel(L.Prioridad, m.Prioridad)}</select>
  <label>Responsable</label><select id="f-resp">${sel(L.Responsable, m.Responsable)}</select>
  <label>Próxima acción</label><input id="f-pa" value="${esc(m['Próxima acción'])}">
  <label>Fecha próxima acción</label><input type="date" id="f-fpa" value="${esc(m['Fecha próxima acción'])}">
  <label>Notas</label><textarea id="f-n" rows="4">${esc(m['Notas / resultado'])}</textarea>
  <h3>Registrar contacto</h3>
  <label>Canal</label><select id="r-can">${sel(L.Canal, '')}</select>
  <label>Qué se hizo / qué dijeron</label><textarea id="r-txt" rows="3"></textarea>
  <button class="b" id="rg" style="margin-top:8px">Registrar en bitácora</button>
  <h3>Historial</h3>${hist.map(x => `<div class="kv"><b>${esc(x.Fecha)} · ${esc(x.Canal)} · ${esc(x.Responsable)}:</b> ${esc(x['Qué se hizo / qué dijeron'])}</div>`).join('') || '<p class="mut">Sin contactos todavía.</p>'}
  <h3>Datos de la marca</h3>${['Contacto directo (tipo)', 'Contacto alterno (no oficial)', 'Calidad del alterno', 'Por qué esa prioridad', 'Verificación', 'Fuente (URL)', 'Primer contacto', 'Último contacto'].map(kv).join('')}</div></div>`;
  document.querySelectorAll('.seg button').forEach(b => b.onclick = () => {
    tabF = b.dataset.tab;
    document.querySelectorAll('.seg button').forEach(x => x.classList.toggle('on', x === b));
    document.querySelectorAll('.pn').forEach(p => p.hidden = p.dataset.p !== tabF);
  });
  const leer = () => {
    m.Estado = $('#f-est').value || m.Estado; m.Prioridad = $('#f-pri').value || m.Prioridad; m.Responsable = $('#f-resp').value || null;
    m['Próxima acción'] = $('#f-pa').value || null; m['Fecha próxima acción'] = $('#f-fpa').value || null; m['Notas / resultado'] = $('#f-n').value || null;
  };
  $('#cl').onclick = () => { $('#sheet').hidden = true; render(); };
  $('#sv').onclick = () => { leer(); persist(); $('#sheet').hidden = true; render(); };
  $('#rg').onclick = () => {
    const txt = $('#r-txt').value.trim(); if (!txt) return alert('Escribe qué se hizo o qué dijeron.');
    leer(); if (m.Estado === 'Sin contactar') { m.Estado = 'Contactado'; }
    const can = $('#r-can').value || null, f = hoy();
    m['Canal usado'] = can || m['Canal usado']; m['Primer contacto'] = m['Primer contacto'] || f; m['Último contacto'] = f;
    D.bitacora.push({ Fecha: f, Marca: m.Marca, Responsable: m.Responsable, Canal: can, 'Qué se hizo / qué dijeron': txt, 'Estado resultante': m.Estado, 'Siguiente paso': m['Próxima acción'] });
    persist(); ficha(id);
  };
}

// ---- datos ----
function descarga(nombre, texto, tipo) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([texto], { type: tipo })); a.download = nombre; a.click();
}
function ajustes() {
  $('#exj').onclick = () => descarga(`crm-leon-respaldo-${hoy()}.json`, JSON.stringify({ ...D, extra: X }), 'application/json');
  $('#exc').onclick = () => {
    const cols = [...new Set(D.marcas.flatMap(Object.keys))], c = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    descarga(`crm-leon-${hoy()}.csv`, '﻿' + [cols.map(c).join(','), ...D.marcas.map(m => cols.map(k => c(m[k])).join(','))].join('\r\n'), 'text/csv');
  };
  $('#imp').onchange = async e => {
    try { const d = JSON.parse(await e.target.files[0].text()); if (!d.marcas || !d.listas) throw 0; if (!confirm('¿Reemplazar todo con este respaldo?')) return; aplicaRespaldo(d); render(); }
    catch { alert('Archivo de respaldo no válido.'); }
  };
  $('#rst').onclick = async () => { if (confirm('Se borra TODO lo capturado y vuelve el Excel original. ¿Seguro?')) { localStorage.removeItem(KEY); localStorage.removeItem(KEYX); D = await store.load(); await cargaExtra(); if (D) render(); else location.reload(); } };
}

document.addEventListener('click', e => {
  const cp = e.target.closest('.cp');
  if (cp) { const t = cp.dataset.t, ok = () => { cp.textContent = '¡Copiado!'; setTimeout(() => cp.textContent = 'Copiar', 1500); };
    return (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(ok, () => { const a = document.createElement('textarea'); a.value = t; document.body.append(a); a.select(); document.execCommand('copy'); a.remove(); ok(); }); }
  const br = e.target.closest('.bar[data-f]');
  if (br) { const k = br.dataset.f, v = br.dataset.v; F = { q: '', pri: '', est: '', aj: '' }; F[k] = v; view = 'cartera'; render(); window.scrollTo(0, 0); return; }
  const c = e.target.closest('.card[data-id]'); if (c) { tabF = 'seg'; return ficha(c.dataset.id); }
  const n = e.target.closest('nav button'); if (n) { view = n.dataset.v; render(); window.scrollTo(0, 0); }
});
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
// Primer arranque sin datos (versión publicada): pide el respaldo
function vacio() {
  $('#sub').textContent = 'Sin datos todavía';
  $('#main').innerHTML = `<h3>Carga tu respaldo</h3><p class="mut">Esta app no trae datos. Elige el archivo <b>respaldo-completo.json</b> que te pasaron (por WhatsApp, correo o cable). Se guarda solo en este teléfono.</p>
  <input type="file" id="imp0" accept=".json,application/json">`;
  $('#imp0').onchange = async e => {
    try { aplicaRespaldo(JSON.parse(await e.target.files[0].text())); render(); }
    catch { alert('Archivo de respaldo no válido.'); }
  };
}
Promise.all([store.load(), cargaExtra()]).then(([d]) => { D = d; D ? render() : vacio(); });
