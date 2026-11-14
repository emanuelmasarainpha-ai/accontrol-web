// ACCONTROL · sitio web. Sin librerías: guilloché, navegación, escenas con el scroll, espacios e instalación.
'use strict';

/* ════════ Dirección de la app (cámbiala aquí cuando la publiques) ════════ */
const APP_URL = 'https://TU-DIRECCION-DE-LA-APP/';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p, a, b) => clamp((p - a) / (b - a));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const fmt = (n, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const SVGNS = 'http://www.w3.org/2000/svg';

document.documentElement.classList.add('js');

/* ════════ Guilloché: hipotrocoides reales, como en la app ════════ */
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
function hypotrochoid({ R, r, d, scale = 1, rotate = 0, steps = 240 }) {
  const turns = r / gcd(R, r);
  const total = Math.max(64, Math.round(steps * turns));
  const k = (R - r) / r;
  const c = Math.cos((rotate * Math.PI) / 180);
  const s = Math.sin((rotate * Math.PI) / 180);
  let out = '';
  for (let i = 0; i <= total; i += 1) {
    const t = (i / total) * 2 * Math.PI * turns;
    const x = ((R - r) * Math.cos(t) + d * Math.cos(k * t)) * scale;
    const y = ((R - r) * Math.sin(t) - d * Math.sin(k * t)) * scale;
    out += `${i ? 'L' : 'M'}${(x * c - y * s).toFixed(1)} ${(x * s + y * c).toFixed(1)}`;
  }
  return `${out}Z`;
}
const RINGS = [
  ...[1, 0.88, 0.76, 0.64, 0.52, 0.4].map((scale, i) => ({ R: 120, r: 8, d: 7, scale, rotate: i * 4 })),
  ...[0.94, 0.82, 0.7, 0.58, 0.46].map((scale, i) => ({ R: 120, r: 6, d: 9, scale, rotate: i * 3 + 2 })),
];
const EXT = Math.ceil(Math.max(...RINGS.map((g) => (g.R - g.r + g.d) * g.scale))) + 4;
const PATHS = RINGS.map(hypotrochoid);
$$('[data-rosette]').forEach((svg) => {
  svg.setAttribute('viewBox', `${-EXT} ${-EXT} ${EXT * 2} ${EXT * 2}`);
  const g = document.createElementNS(SVGNS, 'g');
  PATHS.forEach((d) => {
    const p = document.createElementNS(SVGNS, 'path');
    p.setAttribute('d', d);
    g.appendChild(p);
  });
  svg.appendChild(g);
});

/* Microtexto: una línea de seguridad que llena todo el borde */
function fillMicro(el) {
  const base = el.dataset.base || el.textContent.trim();
  el.dataset.base = base;
  el.textContent = ` ${base}`.repeat(24);
}
$$('[data-micro]').forEach((el) => { el.setAttribute('aria-hidden', 'true'); fillMicro(el); });

/* ════════ Sistema operativo ════════ */
function detectOS() {
  const ua = navigator.userAgent || '';
  const plat = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
  if (/android/i.test(ua)) return 'android';
  if (/iphone|ipad|ipod/i.test(ua) || (/Mac/i.test(plat) && navigator.maxTouchPoints > 1)) return 'ios';
  if (/win/i.test(plat) || /windows/i.test(ua)) return 'windows';
  if (/mac/i.test(plat) || /mac os/i.test(ua)) return 'mac';
  if (/linux|cros|x11/i.test(plat + ua)) return 'linux';
  return null;
}
const OS_NAME = { windows: 'Windows', mac: 'Mac', linux: 'Linux', android: 'Android', ios: 'iPhone y iPad' };
const OS_CTA = { windows: 'Instalar en Windows', mac: 'Instalar en Mac', linux: 'Instalar en Linux', android: 'Instalar en Android', ios: 'Instalar en iPhone' };
const myOS = detectOS();
if (myOS) $$('[data-os-cta] [data-os-label]').forEach((el) => { el.textContent = OS_CTA[myOS]; });
$$('[data-app-link]').forEach((a) => { a.href = APP_URL; a.target = '_blank'; a.rel = 'noopener'; });

/* ════════ Navegación global: desplegables ════════ */
const gnav = $('#gnav');
const items = $$('[data-flyout]', gnav);
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
let openItem = null;
let hoverTimer = 0;
function setOpen(item) {
  if (openItem === item) return;
  if (openItem) {
    openItem.classList.remove('is-open');
    $('button', openItem).setAttribute('aria-expanded', 'false');
  }
  openItem = item;
  if (item) {
    item.classList.add('is-open');
    $('button', item).setAttribute('aria-expanded', 'true');
  }
  gnav.classList.toggle('has-open', Boolean(item));
}
items.forEach((item) => {
  const btn = $('button', item);
  btn.addEventListener('click', () => setOpen(openItem === item ? null : item));
  item.addEventListener('pointerenter', () => {
    if (!finePointer.matches) return;
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => setOpen(item), openItem ? 0 : 140);
  });
  item.addEventListener('pointerleave', () => {
    if (!finePointer.matches) return;
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => setOpen(null), 220);
  });
  item.addEventListener('focusout', (e) => { if (!item.contains(e.relatedTarget)) setOpen(null); });
});
$$('.gnav__item:not([data-flyout])', gnav).forEach((li) => li.addEventListener('pointerenter', () => { if (finePointer.matches) setOpen(null); }));
$('.scrim', gnav).addEventListener('click', () => setOpen(null));
addEventListener('scroll', () => { if (openItem && scrollY > 24) setOpen(null); }, { passive: true });
$$('.fly a', gnav).forEach((a) => a.addEventListener('click', () => setOpen(null)));

/* Menú de celular */
const burger = $('.gnav__burger');
const sheet = $('#sheet');
$$('nav > *', sheet).forEach((el, i) => el.style.setProperty('--i', i));
function setSheet(open) {
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) {
    sheet.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add('is-in')));
  } else {
    sheet.classList.remove('is-in');
    sheet.hidden = true;
  }
}
burger.addEventListener('click', () => setSheet(burger.getAttribute('aria-expanded') !== 'true'));
$$('a', sheet).forEach((a) => a.addEventListener('click', () => setSheet(false)));
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (openItem) { const b = $('button', openItem); setOpen(null); b.focus(); }
  if (burger.getAttribute('aria-expanded') === 'true') { setSheet(false); burger.focus(); }
});

/* ════════ Subnavegación y sección actual ════════ */
const lnav = $('#lnav');
const lnavLinks = $$('.lnav__links a');
const spyTargets = lnavLinks.map((a) => $(a.getAttribute('href')));

/* ════════ Escena del héroe ════════ */
const hero = $('.hero');
const heroCopy = $('.hero__copy');
const device = $('.device');
const lid = $('.device__lid');
const heroRosette = $('.note--hero .rosette');
const countEl = $('[data-count]');
let counted = false;
/* El Disponible sube despacio hasta su cifra, con los centavos girando, y frena suave al llegar */
function countUp(el, target, ms = 5600) {
  const centsEl = $('[data-cents]');
  const t0 = performance.now();
  const total = Math.round(target * 100);
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) * 0.35 + (1 - Math.pow(1 - t, 4)) * 0.65;
  const tick = (now) => {
    const k = clamp((now - t0) / ms);
    const v = k >= 1 ? total : Math.floor(total * ease(k));
    el.textContent = fmt(Math.floor(v / 100));
    if (centsEl) centsEl.textContent = `.${String(v % 100).padStart(2, '0')}`;
    if (k < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
/* Empieza cuando el billete de la portada ya se ve, para que se disfrute desde el principio */
if (countEl) {
  countEl.textContent = '0';
  const cEl = $('[data-cents]');
  if (cEl) cEl.textContent = '.00';
  const noteIO = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting) || counted) return;
    counted = true;
    noteIO.disconnect();
    countUp(countEl, Number(countEl.dataset.count));
  }, { threshold: 0.35 });
  noteIO.observe($('.note--hero'));
}

/* ════════ Declaración palabra por palabra ════════ */
const say = $('.say');
const sayText = $('[data-words]');
const words = sayText.textContent.trim().split(/\s+/);
sayText.setAttribute('aria-label', sayText.textContent.trim());
sayText.textContent = '';
const wordEls = words.map((w, i) => {
  const s = document.createElement('span');
  s.className = /DEMO|finge/.test(w) ? 'w w--k' : 'w';
  s.textContent = w;
  s.setAttribute('aria-hidden', 'true');
  sayText.appendChild(s);
  if (i < words.length - 1) sayText.appendChild(document.createTextNode(' '));
  return s;
});

/* ════════ Bucle de scroll (solo lee posiciones y escribe transform/opacity) ════════ */
let ticking = false;
function frame() {
  ticking = false;
  const vh = innerHeight;
  const y = scrollY;

  // Subnavegación: aparece cuando el titular del héroe se va
  lnav.classList.toggle('is-on', y > vh * 0.55);
  let here = -1;
  spyTargets.forEach((t, i) => { if (t && t.getBoundingClientRect().top < vh * 0.4) here = i; });
  lnavLinks.forEach((a, i) => a.classList.toggle('is-here', i === here));

  // Con «reducir movimiento» (Windows lo trae activo a menudo) la escena sigue, pero sin giros ni zoom fuertes

  // Héroe: el equipo se abre, sube y se acerca mientras el texto se retira
  const hr = hero.getBoundingClientRect();
  const p = clamp(-hr.top / Math.max(1, hr.height - vh));
  const a = easeOut(seg(p, 0, 0.42));
  const b = easeIO(seg(p, 0.08, 0.8));
  heroCopy.style.opacity = String(1 - seg(p, 0.06, 0.32));
  heroCopy.style.transform = `translate3d(0, ${-60 * seg(p, 0, 0.4)}px, 0) scale(${1 - 0.06 * seg(p, 0, 0.4)})`;
  heroCopy.style.filter = `blur(${8 * seg(p, 0.1, 0.32)}px)`;
  lid.style.transform = `rotateX(${(1 - a) * (reduce.matches ? 18 : 52)}deg)`;
  const lift = innerWidth < 600 ? (heroCopy.offsetHeight + 40) * 0.62 : heroCopy.offsetHeight + 40;
  const narrow = innerWidth < 600;
  device.style.transform = `translate3d(0, ${-lift * b}px, 0) scale(${narrow ? 0.9 + 0.1 * b : reduce.matches ? 0.9 + 0.12 * b : 0.82 + 0.3 * b})`;
  if (heroRosette) heroRosette.style.rotate = `${p * (reduce.matches ? 20 : 70)}deg`;

  // Declaración: cada palabra se enciende al pasar
  const sr = say.getBoundingClientRect();
  const sp = clamp((vh * 0.85 - sr.top) / (sr.height - vh * 0.4));
  const n = wordEls.length;
  wordEls.forEach((w, i) => {
    const o = 0.16 + 0.84 * clamp(sp * (n + 6) - i, 0, 1);
    w.style.setProperty('--o', o.toFixed(3));
  });
}
const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll);
frame();

/* ════════ Cómo funciona: el billete cambia de cara ════════ */
const storyNote = $('.note--story');
const steps = $$('[data-step]');
const stepIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    steps.forEach((s) => s.classList.toggle('is-on', s === e.target));
    storyNote.dataset.face = e.target.dataset.step;
  });
}, { rootMargin: innerWidth < 600 ? '-68% 0px -30% 0px' : '-45% 0px -45% 0px' });
steps.forEach((s) => stepIO.observe(s));
steps[0].classList.add('is-on');

/* ════════ Galería: pantallas reales de cada espacio, filtrables y arrastrables ════════ */
const SHOTS = {
  personal: [
    ['home-0', 'Inicio', 'Tu Disponible, el mes y tu patrimonio en una sola pantalla.', 'Inicio: Disponible RD$ 24,857.23'],
    ['finanzas-1', 'Movimientos', 'Busca, filtra y toca uno para editarlo.', 'Finanzas: lista de movimientos con filtros'],
    ['metas-1', 'Metas', 'Aporta, retira y mira si vas al ritmo.', 'Metas: progreso del fondo de emergencia'],
    ['estadisticas-1', 'Estadísticas', 'Seis meses de tu dinero, calculados con tus datos.', 'Estadísticas: ingresos, gastos y dinero disponible por mes'],
    ['patrimonio-1', 'Patrimonio', 'Lo que tienes y lo que debes, con su evolución.', 'Patrimonio: evolución y desglose'],
    ['deudas-0', 'Deudas', 'Cuánto debes, cuánto pagas al mes y qué vence primero.', 'Deudas: total, pagos al mes y riesgo'],
    ['logros-0', 'Logros', 'Niveles y rachas que solo cuentan lo que registras de verdad.', 'Logros: nivel, puntos y rachas'],
  ],
  freelancer: [
    ['freelancer/inicio', 'Inicio', 'Tu Disponible como freelancer, aparte de tus finanzas personales.', 'Inicio del espacio Freelancer: Disponible RD$ 99,157.23'],
    ['freelancer/inicio2', 'Tu trabajo freelance', 'Flujo neto, lo acumulado del año, lo que te deben y tu ranking de clientes.', 'Resumen del trabajo freelance y ranking de clientes'],
    ['freelancer/clientes', 'Clientes', 'Lo cobrado, lo que te deben y los servicios en proceso de cada cliente.', 'Clientes: cobrado, por cobrar y servicios en proceso'],
    ['freelancer/facturas', 'Facturas', 'Facturas internas con cobros parciales, lo vencido y lo que falta por cobrar.', 'Facturas: por cobrar, vencido y cobrado'],
    ['freelancer/finanzas', 'Movimientos', 'Ingresos y gastos profesionales, comparados con el mes anterior.', 'Finanzas del espacio Freelancer'],
    ['freelancer/estadisticas', 'Estadísticas', 'Seis meses de ingresos y gastos, y cuánto llevas vencido.', 'Estadísticas del espacio Freelancer'],
  ],
  entrepreneur: [
    ['emprendedor/inicio', 'Inicio', 'El Disponible de tu negocio, separado de lo personal.', 'Inicio del espacio Emprendedor: Disponible RD$ 149,650.00'],
    ['emprendedor/inicio2', 'Tu negocio', 'Beneficio del mes, margen, comparación con el mes anterior y proyección.', 'Resumen del negocio: beneficio, margen y proyección'],
    ['emprendedor/resultados', 'Resultados', 'Estado de resultados por mes, trimestre o año.', 'Estado de resultados del negocio'],
    ['emprendedor/inventario', 'Inventario', 'Valor del inventario, stock bajo, ventas y ganancia bruta.', 'Inventario: valor, stock bajo y ventas'],
    ['emprendedor/facturas', 'Facturas', 'Lo facturado, lo cobrado y lo que está vencido.', 'Facturas del negocio'],
    ['emprendedor/finanzas', 'Movimientos', 'Ingresos y gastos del negocio, con su balance del mes.', 'Finanzas del espacio Emprendedor'],
  ],
  company: [
    ['empresa/inicio', 'Inicio', 'El Disponible de la organización, con su propio color.', 'Inicio del espacio Empresa: Disponible RD$ 108,394.00'],
    ['empresa/inicio2', 'Tu empresa', 'Beneficio, proyección, inventario, cobros pendientes y salud financiera.', 'Resumen de la empresa'],
    ['empresa/departamentos', 'Departamentos', 'Presupuesto mensual por área y lo gastado en cada una.', 'Departamentos: presupuesto y gasto por área'],
    ['empresa/salud', 'Salud financiera', 'Punto de equilibrio, meses de efectivo y peso de la deuda.', 'Salud financiera: punto de equilibrio'],
    ['empresa/inventario', 'Inventario', 'Productos, stock, compras y ventas de la organización.', 'Inventario de la empresa'],
    ['empresa/resultados', 'Resultados', 'Estado de resultados con comparación y proyección.', 'Estado de resultados de la empresa'],
  ],
};
const gallery = $('.gallery');
const rail = $('[data-rail]');
const dots = $('[data-dots]');
const prev = $('[data-prev]');
const next = $('[data-next]');
const galBtns = $$('[data-gal]');
const glide = $('.gal-pick__glide');
let shots = $$('.shot', rail);
let galKind = 'personal';

const stepW = () => (shots.length > 1 ? shots[1].offsetLeft - shots[0].offsetLeft : rail.clientWidth);
function buildDots() {
  dots.innerHTML = '';
  shots.forEach(() => dots.appendChild(document.createElement('i')));
}
function railState() {
  const i = Math.round(rail.scrollLeft / stepW());
  $$('i', dots).forEach((d, k) => d.classList.toggle('is-on', k === clamp(i, 0, shots.length - 1)));
  prev.disabled = rail.scrollLeft < 8;
  next.disabled = rail.scrollLeft > rail.scrollWidth - rail.clientWidth - 8;
}
function placeGlide() {
  const on = galBtns.find((b) => b.getAttribute('aria-checked') === 'true');
  if (!on || !glide) return;
  glide.style.width = `${on.offsetWidth}px`;
  glide.style.transform = `translateX(${on.offsetLeft}px)`;
}
function setGallery(kind, animate = true) {
  if (!SHOTS[kind]) return;
  galBtns.forEach((b) => {
    const on = b.dataset.gal === kind;
    b.setAttribute('aria-checked', String(on));
    b.tabIndex = on ? 0 : -1;
  });
  placeGlide();
  if (kind === galKind && animate) return;
  galKind = kind;
  gallery.dataset.kind = kind;
  const render = () => {
    rail.innerHTML = SHOTS[kind].map(([src, t, d, alt], i) => `<figure class="shot" style="--i:${i}"><div class="phone"><img src="assets/app/${src}.webp" alt="${alt}, con datos de demostración" width="430" height="932" loading="lazy" decoding="async" draggable="false"></div>
      <figcaption><strong>${t}.</strong> ${d}</figcaption></figure>`).join('');
    shots = $$('.shot', rail);
    buildDots();
    rail.scrollLeft = 0;
    railState();
  };
  if (!animate) { render(); return; }
  rail.classList.add('is-swap-out');
  setTimeout(() => {
    render();
    rail.classList.remove('is-swap-out');
    rail.classList.add('is-swap-in');
    setTimeout(() => rail.classList.remove('is-swap-in'), 1200);
  }, 280);
}
galBtns.forEach((b, i) => {
  b.addEventListener('click', () => {
    setGallery(b.dataset.gal);
    renderKind(b.dataset.gal, true);
  });
  b.addEventListener('keydown', (e) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const nb = galBtns[(i + d + galBtns.length) % galBtns.length];
    nb.focus();
    nb.click();
  });
});
addEventListener('resize', placeGlide);
if (document.fonts) document.fonts.ready.then(placeGlide);

prev.addEventListener('click', () => rail.scrollBy({ left: -stepW(), behavior: 'smooth' }));
next.addEventListener('click', () => rail.scrollBy({ left: stepW(), behavior: 'smooth' }));
rail.addEventListener('scroll', () => requestAnimationFrame(railState), { passive: true });
rail.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') { e.preventDefault(); next.click(); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); prev.click(); }
});

/* Arrastrar con el mouse: los celulares siguen al cursor y siguen con inercia al soltar */
let drag = null;
let moved = false;
rail.addEventListener('pointerdown', (e) => {
  if (e.pointerType !== 'mouse' || e.button !== 0) return;
  drag = { x: e.clientX, left: rail.scrollLeft, t: performance.now(), v: 0, lastX: e.clientX };
  moved = false;
  rail.classList.add('is-drag');
});
addEventListener('pointermove', (e) => {
  if (!drag) return;
  const dx = e.clientX - drag.x;
  if (Math.abs(dx) > 4) moved = true;
  rail.scrollLeft = drag.left - dx;
  const now = performance.now();
  const dt = Math.max(1, now - drag.t);
  drag.v = (e.clientX - drag.lastX) / dt;
  drag.lastX = e.clientX;
  drag.t = now;
});
addEventListener('pointerup', () => {
  if (!drag) return;
  let v = -drag.v * 16;
  drag = null;
  const glideOn = () => {
    if (Math.abs(v) < 0.6) { rail.classList.remove('is-drag'); return; }
    rail.scrollLeft += v;
    v *= 0.92;
    requestAnimationFrame(glideOn);
  };
  requestAnimationFrame(glideOn);
});
rail.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
rail.addEventListener('dragstart', (e) => e.preventDefault());

setGallery('personal', false);

/* ════════ Espacios (los módulos que existen hoy, tal como la app los lista) ════════ */
const KINDS = {
  personal: {
    label: 'PERSONAL', tag: 'Tus finanzas personales',
    included: ['Ingresos y gastos', 'Presupuesto', 'Deudas', 'Metas de ahorro', 'Patrimonio neto', 'Diagnóstico financiero y viabilidad de cada meta', 'Logros, rachas y niveles', 'Estadísticas y calculadoras'],
    soon: ['IA financiera personal'],
  },
  freelancer: {
    label: 'FREELANCER', tag: 'Para profesionales independientes',
    included: ['Ingresos y gastos profesionales', 'Clientes y servicios, con lo cobrado y lo que te deben', 'Ranking de clientes y flujo de caja', 'Gastos cargados a cada cliente: cuánto te deja de verdad', 'Facturas internas con cobros parciales y PDF', 'Recordatorio de cobro listo para copiar y enviar tú', 'Diagnóstico financiero y viabilidad de cada meta', 'Logros, rachas y niveles', 'Estadísticas y calculadoras', 'Exportar a PDF, Excel y CSV'],
    soon: ['Envío automático de recordatorios'],
  },
  entrepreneur: {
    label: 'EMPRENDEDOR', tag: 'Para pequeños negocios',
    included: ['Ingresos y gastos del negocio, separados de los personales', 'Estado de resultados con beneficio, margen y rentabilidad', 'Comparación con el mes y el año anterior', 'Proyección de ingresos, gastos y beneficio', 'Inventario: productos, stock, proveedores, compras y ventas', 'Margen por producto y avisos de stock bajo', 'Facturas internas, cuentas por cobrar y PDF', 'Diagnóstico financiero y viabilidad de cada meta', 'Logros, rachas y niveles', 'Exportar a PDF, Excel y CSV'],
    soon: ['IA financiera del negocio'],
  },
  company: {
    label: 'EMPRESA', tag: 'Para organizaciones',
    included: ['Ingresos y gastos del espacio', 'Estado de resultados, comparación y proyección', 'Salud financiera: punto de equilibrio, meses de efectivo y peso de la deuda', 'Inventario: productos, stock, proveedores, compras y ventas', 'Facturas internas, cuentas por cobrar y PDF', 'Departamentos con presupuesto mensual y gastos por área', 'Viabilidad de cada meta de ahorro', 'Logros, rachas y niveles', 'Estadísticas y exportación'],
    soon: ['Empleados, roles e invitaciones', 'Sucursales'],
  },
};
const CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
const spaces = $('#espacios');
const kindBtns = $$('[data-kind-btn]');
function renderKind(kind, animate) {
  const k = KINDS[kind];
  const apply = () => {
    spaces.dataset.kind = kind;
    $('[data-kind-tag]').textContent = k.tag;
    const micro = $('[data-kind-micro]');
    micro.dataset.base = `ACCONTROL · ${k.label} · RD$ ·`;
    fillMicro(micro);
    $('[data-kind-list]').innerHTML = k.included.map((t, i) => `<li style="--i:${i}">${CHECK}<span>${t}</span></li>`).join('');
    $('[data-kind-soon]').innerHTML = k.soon.map((t) => `<li>${t}</li>`).join('');
    kindBtns.forEach((b) => {
      const on = b.dataset.kindBtn === kind;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    });
  };
  if (!animate) { apply(); return; }
  // Elegir un espacio pinta toda la página con su color
  document.documentElement.dataset.kind = kind;
  setGallery(kind);
  if (spaces.dataset.kind === kind && !spaces.classList.contains('is-swapping')) { apply(); return; }
  spaces.classList.add('is-swapping');
  setTimeout(() => { apply(); requestAnimationFrame(() => requestAnimationFrame(() => spaces.classList.remove('is-swapping'))); }, 220);
}
kindBtns.forEach((b, i) => {
  b.addEventListener('click', () => renderKind(b.dataset.kindBtn, true));
  b.addEventListener('keydown', (e) => {
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const nb = kindBtns[(i + dir + kindBtns.length) % kindBtns.length];
    nb.focus();
    renderKind(nb.dataset.kindBtn, true);
  });
});
$$('[data-pick]').forEach((a) => a.addEventListener('click', () => renderKind(a.dataset.pick, true)));
renderKind('personal', false);

/* ════════ Compara ════════ */
const ROWS = [
  ['Ingresos y gastos', 1, 1, 1, 1],
  ['Presupuesto', 1, 0, 0, 0],
  ['Deudas', 1, 0, 0, 0],
  ['Metas de ahorro y su viabilidad', 1, 1, 1, 1],
  ['Patrimonio neto', 1, 0, 0, 0],
  ['Clientes y servicios', 0, 1, 0, 0],
  ['Facturas internas con PDF', 0, 1, 1, 1],
  ['Estado de resultados y proyección', 0, 0, 1, 1],
  ['Inventario y proveedores', 0, 0, 1, 1],
  ['Departamentos con presupuesto', 0, 0, 0, 1],
  ['Salud financiera', 0, 0, 0, 1],
  ['Logros, rachas y niveles', 1, 1, 1, 1],
  ['Estadísticas', 1, 1, 1, 1],
];
const YES = '<svg class="y" viewBox="0 0 24 24" role="img" aria-label="Incluido"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
const NO = '<svg class="n" viewBox="0 0 24 24" role="img" aria-label="No incluido"><path d="M7 12h10"/></svg>';
$('[data-cmp]').innerHTML = ROWS.map(([t, ...v]) => `<tr><th scope="row">${t}</th>${v.map((x) => `<td>${x ? YES : NO}</td>`).join('')}</tr>`).join('');
const cmpBtns = $$('[data-col]', $('.cmp-pick'));
cmpBtns.forEach((b, i) => {
  const pick = (btn) => {
    $('.cmp').dataset.col = btn.dataset.col;
    cmpBtns.forEach((x) => { x.setAttribute('aria-checked', String(x === btn)); x.tabIndex = x === btn ? 0 : -1; });
  };
  b.tabIndex = i === 0 ? 0 : -1;
  b.addEventListener('click', () => pick(b));
  b.addEventListener('keydown', (e) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const nb = cmpBtns[(i + d + cmpBtns.length) % cmpBtns.length];
    nb.focus();
    pick(nb);
  });
});

/* ════════ Instalar: paso a paso por sistema ════════ */
const I = {
  install: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M12 7.5v6m0 0-2.5-2.5M12 13.5l2.5-2.5M8 20.5h8"/></svg>',
  dotsH: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/></svg>',
  dotsV: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="12" cy="19" r="1.3"/></svg>',
  share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5v11m0-11L8 7.5m4-4 4 4M7 10.5H6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/></svg>',
};
const ui = (icon, text) => `<span class="ui">${icon || ''}${text ? `<span>${text}</span>` : ''}</span>`;

/* ════════ Dibujos del instalador: el equipo de cada sistema, con el cursor o el dedo haciendo el paso ════════ */
const MARK = (x, y, s) => `<image href="assets/brand/icono.svg" x="${x}" y="${y}" width="${64 * s}" height="${64 * s}"/>`;
const LOCK = (x, y, s = 0.42) => `<g class="o" transform="translate(${x} ${y}) scale(${s})"><rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></g>`;
const TXT = (x, y, size, cls, s, anchor = 'start') => `<text class="${cls}" x="${x}" y="${y}" style="font-size:${size}px" text-anchor="${anchor}">${s}</text>`;

/* Puntero: cursor de mouse en computadora, dedo en celular. Se mueve de un punto a otro y hace clic en cada destino. */
function pointer(kind, pts) {
  const [a, b, c = b] = pts;
  const two = pts.length > 2;
  const vars = `--x0:${a[0]};--y0:${a[1]};--x1:${b[0]};--y1:${b[1]};--x2:${c[0]};--y2:${c[1]}`;
  const shape = kind === 'touch'
    ? '<circle class="touch__ring" r="9"/><circle class="touch__dot" r="6"/>'
    : '<path class="cur" d="M0 0v15.5l4-3.6 2.7 6.3 2.7-1.2-2.7-6.1H12.6Z"/>';
  const ripples = pts.slice(1).map((p, i) => `<circle class="ripple ripple--${i + 1} ${two ? 'is-two' : 'is-one'}" cx="${p[0]}" cy="${p[1]}" r="9"/>`).join('');
  return `${ripples}<g class="ptr ${two ? 'ptr--two' : 'ptr--one'}" style="${vars}">${shape}</g>`;
}

/* Ventana del navegador de escritorio, con los controles de cada sistema */
function browserWin(os, x, y, w, h, inner, install) {
  const mac = os === 'mac';
  const ctrl = mac
    ? `<circle cx="${x + 9}" cy="${y + 6}" r="2.3" fill="#ff5f57"/><circle cx="${x + 16}" cy="${y + 6}" r="2.3" fill="#febc2e"/><circle cx="${x + 23}" cy="${y + 6}" r="2.3" fill="#28c840"/>`
    : `<g class="o"><path d="M${x + w - 34} ${y + 6}h5"/><rect x="${x + 22 + w - 46}" y="${y + 3.5}" width="5" height="5" rx=".6"/><path d="M${x + w - 10} ${y + 3.5}l5 5m0-5-5 5"/></g>`;
  const ax = x + 30;
  const aw = w - 60;
  return `<g class="win">
    <rect class="win__frame" x="${x}" y="${y}" width="${w}" height="${h}" rx="5"/>
    <path class="win__line" d="M${x} ${y + 12}h${w}M${x} ${y + 26}h${w}"/>
    ${ctrl}
    <rect class="win__tab" x="${mac ? x + 32 : x + 6}" y="${y + 2.5}" width="70" height="9.5" rx="3"/>
    ${TXT(mac ? x + 38 : x + 12, y + 9.5, 5.5, 't', 'ACCONTROL')}
    <rect class="win__url" x="${ax}" y="${y + 15}" width="${aw}" height="9" rx="4.5"/>
    ${LOCK(ax + 3, y + 15)}
    ${TXT(ax + 14, y + 21.6, 5.5, 't', 'tu-app-de-accontrol')}
    ${install ? `<g class="hl" transform="translate(${ax + aw - 13} ${y + 15.6}) scale(.36)"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M12 7.5v6m0 0-2.5-2.5M12 13.5l2.5-2.5M8 20.5h8"/></g>` : ''}
    ${inner}
  </g>`;
}

/* El billete pequeño de la app (el saldo cabe siempre dentro) */
const miniNote = (x, y, w, size) => `<g class="mininote">
  <rect class="hl" x="${x}" y="${y}" width="${w}" height="${size * 3.3}" rx="${size * 0.55}"/>
  <rect class="o o--soft" x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${size * 3.3 - 6}" rx="${size * 0.4}"/>
  ${TXT(x + size * 0.6, y + size * 1.1, size * 0.36, 't t--lab', 'DISPONIBLE')}
  ${TXT(x + size * 0.6, y + size * 2.35, size, 'val', 'RD$ 24,857')}
</g>`;

function deskArt(os, step) {
  const mac = os === 'mac';
  const win = os === 'windows';
  const X = 78;
  const Y = 14;
  const W = 304;
  const H = 190;
  // Barra de tareas / Dock / panel
  let bar = '';
  let appSlot;
  if (win) {
    bar = `<rect class="task" x="${X}" y="${Y + H - 14}" width="${W}" height="14"/>
      <g class="o" transform="translate(186 ${Y + H - 11})"><rect width="3.6" height="3.6" rx=".5"/><rect x="4.4" width="3.6" height="3.6" rx=".5"/><rect y="4.4" width="3.6" height="3.6" rx=".5"/><rect x="4.4" y="4.4" width="3.6" height="3.6" rx=".5"/></g>
      ${[0, 1, 2].map((k) => `<rect class="o" x="${202 + k * 14}" y="${Y + H - 11}" width="8" height="8" rx="2"/>`).join('')}`;
    appSlot = [246, Y + H - 12, 0.15];
  } else if (mac) {
    bar = `<rect class="task" x="${X}" y="${Y}" width="${W}" height="8"/>
      ${TXT(X + 8, Y + 6, 5, 't', ' Safari   Archivo   Edición   Ver')}
      <rect class="task task--dock" x="168" y="${Y + H - 17}" width="124" height="14" rx="5"/>
      ${[0, 1, 2, 3, 4].map((k) => `<rect class="o" x="${174 + k * 16}" y="${Y + H - 14.5}" width="9" height="9" rx="2.4"/>`).join('')}`;
    appSlot = [255, Y + H - 15, 0.155];
  } else {
    bar = `<rect class="task" x="${X}" y="${Y}" width="${W}" height="8"/>${TXT(X + 6, Y + 6, 5, 't', 'Actividades')}${TXT(X + W / 2, Y + 6, 5, 't', '9:41', 'middle')}
      <rect class="task" x="${X}" y="${Y + 8}" width="16" height="${H - 8}"/>
      ${[0, 1, 2].map((k) => `<rect class="o" x="${X + 3.5}" y="${Y + 18 + k * 15}" width="9" height="9" rx="2.4"/>`).join('')}`;
    appSlot = [X + 3, Y + 63, 0.155];
  }
  const wx = os === 'linux' ? X + 26 : X + 18;
  const wy = win ? Y + 8 : Y + 14;
  const ww = os === 'linux' ? W - 36 : W - 36;
  const wh = win ? H - 30 : H - 36;
  const cx = wx + ww / 2;
  let inner = '';
  let ptr = '';
  if (step === 1) {
    const page = `<g class="hide-a">
        ${TXT(cx, wy + 58, 13, 'disp', 'Tus números no', 'middle')}
        ${TXT(cx, wy + 73, 13, 'disp', 'salen de aquí.', 'middle')}
        ${TXT(cx, wy + 86, 5.5, 't', 'Instala ACCONTROL en tu equipo.', 'middle')}
        <rect class="hl hl--fill" x="${cx - 38}" y="${wy + 96}" width="76" height="16" rx="8"/>
        ${TXT(cx, wy + 106.5, 6, 'ht ht--btn', 'Abrir ACCONTROL', 'middle')}
      </g>
      <g class="show-a">${miniNote(cx - 70, wy + 44, 140, 20)}
        ${TXT(cx, wy + 126, 5.5, 't', 'Ya estás en ACCONTROL', 'middle')}</g>`;
    inner = browserWin(os, wx, wy, ww, wh, page, false);
    ptr = pointer('mouse', [[wx + ww - 30, wy + wh - 14], [cx + 6, wy + 105]]);
  } else if (step === 2) {
    const page = `${miniNote(wx + 18, wy + 40, 128, 18)}
      <rect class="o o--soft" x="${wx + 158}" y="${wy + 40}" width="${ww - 176}" height="27" rx="5"/>
      <rect class="o o--soft" x="${wx + 158}" y="${wy + 72}" width="${ww - 176}" height="27" rx="5"/>
      ${TXT(wx + 164, wy + 51, 5, 't', 'Ingresos')}${TXT(wx + 164, wy + 61, 7.5, 'val val--pos', 'RD$ 53,980')}
      ${TXT(wx + 164, wy + 83, 5, 't', 'Gastos')}${TXT(wx + 164, wy + 93, 7.5, 'val val--ink', 'RD$ 25,982')}`;
    let dialog;
    let pts;
    if (mac) {
      // Safari: Archivo → Añadir al Dock
      dialog = `<g class="show-1">
          <rect class="menu" x="${X + 30}" y="${Y + 8}" width="92" height="56" rx="4"/>
          ${TXT(X + 38, Y + 19, 5.5, 't', 'Nueva ventana')}${TXT(X + 38, Y + 30, 5.5, 't', 'Abrir archivo…')}
          <rect class="hl hl--soft" x="${X + 33}" y="${Y + 35}" width="86" height="10" rx="2.5"/>${TXT(X + 38, Y + 42, 5.5, 'ht', 'Añadir al Dock…')}
          ${TXT(X + 38, Y + 55, 5.5, 't', 'Compartir')}
        </g>
        <g class="show-2">${TXT(X + W / 2, Y + H - 24, 6, 'ht', 'ACCONTROL quedó en el Dock', 'middle')}</g>`;
      pts = [[wx + ww - 40, wy + wh - 20], [X + 41, Y + 5], [X + 62, Y + 41]];
    } else {
      const ax = wx + 30 + (ww - 60) - 13 + 4.3;
      const ay = wy + 19.5;
      const dx = wx + ww - 148;
      const dy = wy + 30;
      dialog = `<g class="show-1">
          <rect class="menu" x="${dx}" y="${dy}" width="140" height="62" rx="6"/>
          ${MARK(dx + 9, dy + 9, 0.22)}
          ${TXT(dx + 28, dy + 16, 7, 'ht', '¿Instalar ACCONTROL?')}
          ${TXT(dx + 28, dy + 25, 5.2, 't', 'Se abrirá en su propia ventana')}
          <rect class="o" x="${dx + 30}" y="${dy + 40}" width="46" height="14" rx="4"/>${TXT(dx + 53, dy + 49.5, 5.5, 't', 'Cancelar', 'middle')}
          <rect class="hl hl--fill" x="${dx + 82}" y="${dy + 40}" width="50" height="14" rx="4"/>${TXT(dx + 107, dy + 49.5, 5.8, 'ht ht--btn', 'Instalar', 'middle')}
        </g>
        <g class="show-2"><rect class="menu" x="${cx - 52}" y="${wy + wh - 26}" width="104" height="16" rx="8"/>${TXT(cx, wy + wh - 15.5, 5.8, 'ht', 'ACCONTROL instalada', 'middle')}</g>`;
      pts = [[wx + 60, wy + wh - 18], [ax, ay], [dx + 107, dy + 47]];
    }
    inner = browserWin(os, wx, wy, ww, wh, page + (mac ? '' : dialog), !mac) + (mac ? dialog : '');
    ptr = pointer('mouse', pts);
  } else {
    const [sx, sy, sc] = appSlot;
    const tip = mac ? [sx + 5, sy - 7] : win ? [sx + 5, sy - 6] : [sx + 22, sy + 6];
    inner = `<g class="slot">${MARK(sx, sy, sc)}</g>
      <g class="show-a">
        <rect class="win__frame" x="${X + 46}" y="${Y + 22}" width="${W - 92}" height="${H - 56}" rx="6"/>
        <rect x="${X + 46}" y="${Y + 22}" width="52" height="${H - 56}" rx="6" fill="#34204f"/>
        ${MARK(X + 52, Y + 28, 0.15)}${TXT(X + 64, Y + 35, 5, 'ht ht--btn', 'ACCONTROL')}
        ${['Inicio', 'Finanzas', 'Metas', 'Estadísticas'].map((t, k) => TXT(X + 54, Y + 52 + k * 11, 5.2, k ? 't t--onv' : 'ht ht--btn', t)).join('')}
        ${TXT(X + 108, Y + 38, 9, 'disp', 'Buenas noches')}
        ${miniNote(X + 108, Y + 46, 140, 19)}
      </g>
      ${TXT(tip[0], tip[1], 5.5, 'ht', 'ACCONTROL', win || mac ? 'middle' : 'start')}`;
    ptr = pointer('mouse', [[X + W / 2, Y + H / 2 - 20], [sx + 5, sy + 5]]);
  }
  return `<svg class="art art--desk" viewBox="0 0 460 236" aria-hidden="true">
    <rect class="dev" x="68" y="4" width="324" height="210" rx="13"/>
    <rect class="scr" x="${X}" y="${Y}" width="${W}" height="${H}" rx="4"/>
    ${mac ? '<circle cx="230" cy="9" r="1.6" fill="#2c3446"/>' : ''}
    <g clip-path="url(#clip-${os}-${step})"><clipPath id="clip-${os}-${step}"><rect x="${X}" y="${Y}" width="${W}" height="${H}" rx="4"/></clipPath>
      ${bar}${inner}${ptr}
    </g>
    <path class="dev dev--base" d="M28 214h404l-12 12H40Z"/>
    <rect class="dev__notch" x="204" y="214" width="52" height="4" rx="2"/>
  </svg>`;
}

function phoneArt(os, step) {
  const ios = os === 'ios';
  const SX = 172;
  const SY = 8;
  const SW = 116;
  const SH = 254;
  const cx = SX + SW / 2;
  const status = `${TXT(SX + 12, SY + 13, 6, 'ht', ios ? '9:41' : '12:30')}
    ${ios ? `<rect x="${cx - 18}" y="${SY + 5}" width="36" height="10" rx="5" fill="#000"/>` : `<circle cx="${cx}" cy="${SY + 9}" r="3.4" fill="#000"/>`}
    <g class="o" transform="translate(${SX + SW - 26} ${SY + 7})"><rect width="12" height="6" rx="1.6"/><path d="M13.5 2v2"/></g>`;
  const urlBar = ios
    ? `<rect class="task" x="${SX}" y="${SY + SH - 34}" width="${SW}" height="34"/><rect class="win__url" x="${SX + 10}" y="${SY + SH - 30}" width="${SW - 20}" height="12" rx="6"/>${LOCK(SX + 22, SY + SH - 30, 0.4)}${TXT(SX + 32, SY + SH - 21.8, 5.5, 't', 'tu-app-de-accontrol')}
       <g class="o" transform="translate(${cx - 4.5} ${SY + SH - 15}) scale(.38)"><path d="M12 3.5v11m0-11L8 7.5m4-4 4 4M7 10.5H6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/></g>`
    : `<rect class="win__url" x="${SX + 8}" y="${SY + 22}" width="${SW - 30}" height="12" rx="6"/>${LOCK(SX + 11, SY + 22, 0.4)}${TXT(SX + 21, SY + 30.2, 5.5, 't', 'tu-app-de-accontrol')}
       <g class="o" transform="translate(${SX + SW - 16} ${SY + 22}) scale(.5)"><circle cx="12" cy="5" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="12" cy="19" r="1.3"/></g>`;
  let body = '';
  let ptr = '';
  if (step === 1) {
    body = `${urlBar}
      <g class="hide-a">
        ${TXT(cx, SY + 82, 11, 'disp', 'Tus números', 'middle')}
        ${TXT(cx, SY + 95, 11, 'disp', 'no salen de aquí.', 'middle')}
        ${TXT(cx, SY + 107, 5, 't', 'Instala ACCONTROL en tu celular.', 'middle')}
        <rect class="hl hl--fill" x="${cx - 36}" y="${SY + 118}" width="72" height="16" rx="8"/>
        ${TXT(cx, SY + 128.5, 6, 'ht ht--btn', 'Abrir ACCONTROL', 'middle')}
      </g>
      <g class="show-a">${miniNote(SX + 10, SY + 64, SW - 20, 15)}${TXT(cx, SY + 130, 5.5, 't', 'Ya estás en ACCONTROL', 'middle')}</g>`;
    ptr = pointer('touch', [[cx + 30, SY + SH - 60], [cx, SY + 126]]);
  } else if (step === 2) {
    const page = `${miniNote(SX + 10, SY + (ios ? 34 : 48), SW - 20, 15)}
      <rect class="o o--soft" x="${SX + 10}" y="${SY + (ios ? 92 : 106)}" width="${SW - 20}" height="22" rx="5"/>${TXT(SX + 16, SY + (ios ? 101 : 115), 5, 't', 'Ingresos')}${TXT(SX + 16, SY + (ios ? 110 : 124), 7, 'val val--pos', 'RD$ 53,980')}`;
    if (ios) {
      body = `${page}${urlBar}
        <g class="show-1"><rect class="menu" x="${SX}" y="${SY + 136}" width="${SW}" height="${SH - 136}" rx="14"/>
          <rect x="${cx - 12}" y="${SY + 141}" width="24" height="3" rx="1.5" fill="#3a4357"/>
          ${TXT(SX + 12, SY + 162, 6, 't', 'Copiar')}
          <rect class="hl hl--soft" x="${SX + 6}" y="${SY + 172}" width="${SW - 12}" height="14" rx="4"/>${TXT(SX + 12, SY + 181.5, 6, 'ht', 'Añadir a pantalla de inicio')}
          ${TXT(SX + 12, SY + 202, 6, 't', 'Añadir a favoritos')}
          ${TXT(SX + 12, SY + 220, 6, 't', 'Buscar en la página')}</g>
        <g class="show-2"><rect class="menu" x="${SX + 14}" y="${SY + 150}" width="${SW - 28}" height="16" rx="8"/>${TXT(cx, SY + 160.5, 5.5, 'ht', 'Añadida a inicio', 'middle')}</g>`;
      ptr = pointer('touch', [[cx + 20, SY + 160], [cx, SY + SH - 11], [cx, SY + 179]]);
    } else {
      body = `${urlBar}${page}
        <g class="show-1"><rect class="menu" x="${SX + 36}" y="${SY + 26}" width="${SW - 40}" height="84" rx="6"/>
          ${TXT(SX + 44, SY + 42, 6, 't', 'Nueva pestaña')}${TXT(SX + 44, SY + 58, 6, 't', 'Historial')}
          <rect class="hl hl--soft" x="${SX + 39}" y="${SY + 66}" width="${SW - 46}" height="14" rx="4"/>${TXT(SX + 44, SY + 75.5, 6, 'ht', 'Instalar aplicación')}
          ${TXT(SX + 44, SY + 96, 6, 't', 'Configuración')}</g>
        <g class="show-2"><rect class="menu" x="${SX + 14}" y="${SY + SH - 40}" width="${SW - 28}" height="16" rx="8"/>${TXT(cx, SY + SH - 29.5, 5.5, 'ht', 'ACCONTROL instalada', 'middle')}</g>`;
      ptr = pointer('touch', [[cx - 10, SY + 170], [SX + SW - 10, SY + 28], [SX + 72, SY + 73]]);
    }
  } else {
    const icons = [];
    for (let k = 0; k < 11; k += 1) {
      if (k === 6) continue;
      icons.push(`<rect class="o" x="${SX + 12 + (k % 4) * 25}" y="${SY + 30 + Math.floor(k / 4) * 32}" width="17" height="17" rx="5"/>`);
    }
    const ix = SX + 12 + 2 * 25;
    const iy = SY + 30 + 32;
    body = `${icons.join('')}
      ${MARK(ix - 0.5, iy - 0.5, 0.28)}${TXT(ix + 8.5, iy + 25, 4.6, 'ht', 'ACCONTROL', 'middle')}
      ${ios ? `<rect class="task task--dock" x="${SX + 8}" y="${SY + SH - 30}" width="${SW - 16}" height="24" rx="10"/>` : `<rect class="task" x="${SX + 34}" y="${SY + SH - 10}" width="48" height="3" rx="1.5"/>`}
      <g class="show-a"><rect x="${SX}" y="${SY}" width="${SW}" height="${SH}" fill="#0e121a"/>
        <rect x="${SX}" y="${SY}" width="${SW}" height="30" fill="#34204f"/>${TXT(SX + 12, SY + 22, 6.5, 'ht ht--btn', 'ACCONTROL')}
        ${TXT(SX + 10, SY + 48, 9, 'disp', 'Buenas noches')}
        ${miniNote(SX + 10, SY + 58, SW - 20, 15)}
        <rect class="hl hl--fill" x="${SX + 10}" y="${SY + 116}" width="${SW - 20}" height="14" rx="5"/>${TXT(cx, SY + 125.5, 5.5, 'ht ht--btn', 'Registrar ingreso', 'middle')}</g>`;
    ptr = pointer('touch', [[cx + 24, SY + 190], [ix + 8.5, iy + 8.5]]);
  }
  return `<svg class="art art--phone" viewBox="0 0 460 270" aria-hidden="true">
    <rect class="dev" x="${SX - 7}" y="${SY - 7}" width="${SW + 14}" height="${SH + 14}" rx="24"/>
    <rect class="dev__btn" x="${SX + SW + 7}" y="${SY + 60}" width="2.4" height="26" rx="1"/>
    <rect class="scr" x="${SX}" y="${SY}" width="${SW}" height="${SH}" rx="18"/>
    <g clip-path="url(#clip-${os}-${step})"><clipPath id="clip-${os}-${step}"><rect x="${SX}" y="${SY}" width="${SW}" height="${SH}" rx="18"/></clipPath>
      ${status}${body}${ptr}
    </g>
  </svg>`;
}
const artFor = (os, step) => (os === 'android' || os === 'ios' ? phoneArt(os, step) : deskArt(os, step));

const GUIDES = {
  windows: [
    ['Abre ACCONTROL en Edge o Chrome.', 'Pulsa «Abrir ACCONTROL» aquí abajo. Se abre en tu navegador como cualquier página.', 'OS:1'],
    ['Pulsa «Instalar».', `En la barra de direcciones aparece ${ui(I.install, 'Instalar')}. Si no lo ves, busca la opción para instalar la página como app en el menú ${ui(I.dotsH)} del navegador.`, 'OS:2'],
    ['Ábrela desde Inicio.', 'ACCONTROL queda en el menú Inicio con su ícono y se abre en su propia ventana. Puedes anclarla a la barra de tareas.', 'OS:3'],
  ],
  mac: [
    ['Abre ACCONTROL en Safari, Chrome o Edge.', 'Pulsa «Abrir ACCONTROL» aquí abajo.', 'OS:1'],
    ['Añádela como app.', `En Safari: menú Archivo, «Añadir al Dock» (macOS Sonoma o posterior). En Chrome o Edge: ${ui(I.install, 'Instalar')} en la barra de direcciones.`, 'OS:2'],
    ['Ábrela desde el Dock.', 'Queda en el Dock y en tus aplicaciones, con su ventana propia.', 'OS:3'],
  ],
  linux: [
    ['Abre ACCONTROL en Chrome, Chromium o Edge.', 'Pulsa «Abrir ACCONTROL» aquí abajo.', 'OS:1'],
    ['Pulsa «Instalar».', `Usa ${ui(I.install, 'Instalar')} en la barra de direcciones, o la opción de instalar del menú ${ui(I.dotsH)}.`, 'OS:2'],
    ['Ábrela desde tus aplicaciones.', 'Aparece en el menú de aplicaciones de tu escritorio.', 'OS:3'],
  ],
  android: [
    ['Abre ACCONTROL en Chrome.', 'Pulsa «Abrir ACCONTROL» aquí abajo desde tu celular.', 'OS:1'],
    ['Instala la app.', `Toca el menú ${ui(I.dotsV)} y elige «Instalar aplicación» o «Agregar a la pantalla principal».`, 'OS:2'],
    ['Listo, junto a tus apps.', 'ACCONTROL queda en tu pantalla con su ícono y abre a pantalla completa.', 'OS:3'],
  ],
  ios: [
    ['Abre ACCONTROL en Safari.', 'Pulsa «Abrir ACCONTROL» aquí abajo desde tu iPhone o iPad.', 'OS:1'],
    ['Añádela a la pantalla de inicio.', `Toca ${ui(I.share, 'Compartir')} y elige «Añadir a pantalla de inicio».`, 'OS:2'],
    ['Pulsa «Añadir».', 'ACCONTROL queda en tu pantalla de inicio y abre como una app.', 'OS:3'],
  ],
};

const osTabs = $$('[data-os]');
const stepsBox = $('[data-steps]');
const progress = $('[data-progress]');
const back = $('[data-back]');
const fwd = $('[data-fwd]');
const countLabel = $('[data-count-label]');
let curOS = myOS || 'windows';
let curStep = 0;
function showStep(i, dir = 1) {
  const all = $$('.wstep', stepsBox);
  curStep = clamp(i, 0, all.length - 1);
  all.forEach((s, k) => {
    s.classList.toggle('is-on', k === curStep);
    s.classList.toggle('is-back', k < curStep);
    s.setAttribute('aria-hidden', String(k !== curStep));
    // El dibujo del paso que entra empieza su animación desde cero
    if (k === curStep) {
      const box = $('.wstep__art', s);
      box.innerHTML = artFor(curOS, k + 1);
    }
  });
  progress.parentElement.style.setProperty('--p', ((curStep + 1) / all.length).toFixed(3));
  progress.style.setProperty('--p', ((curStep + 1) / all.length).toFixed(3));
  back.disabled = curStep === 0;
  fwd.textContent = curStep === all.length - 1 ? 'Abrir ACCONTROL' : 'Siguiente';
  countLabel.textContent = `Paso ${curStep + 1} de ${all.length}`;
  return dir;
}
function setOS(os, focus) {
  curOS = os;
  osTabs.forEach((t) => {
    const on = t.dataset.os === os;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    if (on && focus) t.focus();
  });
  $('#panel-os').setAttribute('aria-labelledby', `tab-${os}`);
  stepsBox.innerHTML = GUIDES[os].map(([h, p, art], k) => `<li class="wstep"><span class="wstep__n" aria-hidden="true">${k + 1}</span><h3>${h}</h3><p>${p}</p><div class="wstep__art" data-art="${art}"></div></li>`).join('');
  showStep(0);
}
osTabs.forEach((t, i) => {
  t.addEventListener('click', () => setOS(t.dataset.os));
  t.addEventListener('keydown', (e) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    setOS(osTabs[(i + dir + osTabs.length) % osTabs.length].dataset.os, true);
  });
});
back.addEventListener('click', () => showStep(curStep - 1, -1));
fwd.addEventListener('click', () => {
  if (curStep === GUIDES[curOS].length - 1) { window.open(APP_URL, '_blank', 'noopener'); return; }
  showStep(curStep + 1, 1);
});
$('[data-os-found]').textContent = myOS ? `Detectamos ${OS_NAME[myOS]}. ¿Usas otro? Elígelo arriba.` : 'Elige tu sistema.';
setOS(curOS);

/* ════════ Entradas al llegar ════════ */
const riseTargets = $$('.section-title, .section-sub, .gallery .rail, .spaces__picker, .spaces__body, .pv, .privacy__note, .table-wrap, .os, .wizard, .install__go, .faq__list, .close > :not(.rosette)');

/* El pie se pliega en el celular, como sus columnas */
if (matchMedia('(max-width: 833px)').matches) $$('.foot__col').forEach((d) => { d.open = false; });
const riseIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    riseIO.unobserve(e.target);
  });
}, { rootMargin: '0px 0px -12% 0px' });
{
  riseTargets.forEach((el) => {
    if (el.getBoundingClientRect().top < innerHeight) return;
    const sib = el.parentElement ? [...el.parentElement.children].filter((c) => riseTargets.includes(c)) : [];
    el.style.setProperty('--d', `${Math.min(sib.indexOf(el), 4) * 0.08}s`);
    el.classList.add('rise');
    riseIO.observe(el);
  });
}
