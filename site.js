// ACCONTROL · sitio web — código de las páginas nuevas y piezas compartidas con la portada.
//   · Aviso y preferencias de cookies (también en la portada). Solo aparece si hay algo OPCIONAL que aceptar
//     (hoy no hay nada: ni anuncios ni analítica). Es el que decide si se cargan los anuncios.
//   · Anuncios de AdSense: solo si están configurados en site.config.mjs Y la persona los aceptó.
//   · Menú del celular, buscador del blog, «copiar enlace», tabla de contenido y formulario de contacto (páginas nuevas).
// Sin librerías.
'use strict';

(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const fold = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  let CONFIG = { ads: null, analytics: false, contactEndpoint: '', searchIndex: '/blog/search-index.json' };
  try { CONFIG = { ...CONFIG, ...JSON.parse($('#site-config')?.textContent || '{}') }; } catch { /* sin configuración: todo apagado */ }

  /* ════════ Consentimiento ════════ */
  const CONSENT_KEY = 'accontrol.consent.v1';
  const CONSENT_VERSION = 1;
  // Solo existen las categorías que el sitio usa de verdad.
  const CATEGORIES = [
    ...(CONFIG.analytics ? [{ id: 'analytics', name: 'Analítica', text: 'Medir de forma agregada cuántas personas visitan el sitio y qué páginas leen.' }] : []),
    ...(CONFIG.ads ? [{ id: 'ads', name: 'Publicidad', text: 'Mostrar anuncios de Google AdSense en los artículos del blog. Google y sus socios usan cookies para mostrarlos, medirlos y, si lo permites, personalizarlos.' }] : []),
  ];

  function readConsent() {
    try {
      const saved = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
      return saved && saved.version === CONSENT_VERSION ? saved : null;
    } catch { return null; }
  }
  function saveConsent(choices) {
    const value = { version: CONSENT_VERSION, date: new Date().toISOString(), ...choices };
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify(value)); } catch { /* navegador sin almacenamiento: se aplica solo en esta visita */ }
    return value;
  }
  let consent = readConsent();
  const allowed = (id) => Boolean(consent && consent[id] === true);

  // Google Consent Mode v2: todo «denegado» por defecto; solo se concede lo que la persona aceptó.
  function consentMode(kind) {
    window.dataLayer = window.dataLayer || [];
    // eslint-disable-next-line prefer-rest-params
    window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
    const ads = allowed('ads') ? 'granted' : 'denied';
    const analytics = allowed('analytics') ? 'granted' : 'denied';
    window.gtag('consent', kind, { ad_storage: ads, ad_user_data: ads, ad_personalization: ads, analytics_storage: analytics });
  }

  function applyConsent() {
    if (!CONFIG.ads) return;
    consentMode('update');
    if (allowed('ads')) loadAds();
  }

  let banner = null;
  function hideBanner() { banner?.remove(); banner = null; }
  function decide(choices) {
    consent = saveConsent(choices);
    hideBanner();
    applyConsent();
  }
  const allChoices = (value) => Object.fromEntries(CATEGORIES.map((c) => [c.id, value]));

  function showBanner() {
    if (banner || CATEGORIES.length === 0) return;
    banner = document.createElement('section');
    banner.className = 'consent';
    banner.setAttribute('aria-labelledby', 'consent-t');
    banner.innerHTML = `<p class="consent__t" id="consent-t">Tu privacidad</p>
      <p class="consent__p">Usamos almacenamiento esencial para que el sitio funcione. Con tu permiso, también ${CATEGORIES.map((c) => esc(c.name.toLowerCase())).join(' y ')}. Puedes cambiar tu decisión cuando quieras. <a href="/cookies">Más información</a>.</p>
      <div class="consent__actions">
        <button class="btn-line" type="button" data-consent="reject">Rechazar</button>
        <button class="btn-line" type="button" data-consent="config">Configurar</button>
        <button class="btn-fill" type="button" data-consent="accept">Aceptar</button>
      </div>`;
    banner.addEventListener('click', (e) => {
      const action = e.target.closest('[data-consent]')?.dataset.consent;
      if (action === 'accept') decide(allChoices(true));
      if (action === 'reject') decide(allChoices(false));
      if (action === 'config') openPrefs();
    });
    document.body.append(banner);
  }

  function openPrefs() {
    $('.prefs')?.remove();
    const dialog = document.createElement('dialog');
    dialog.className = 'prefs';
    dialog.setAttribute('aria-labelledby', 'prefs-t');
    const rows = CATEGORIES.map((c) => `<label class="pref"><strong>${esc(c.name)}</strong><small>${esc(c.text)}</small><input type="checkbox" name="${c.id}" ${allowed(c.id) ? 'checked' : ''}></label>`).join('');
    dialog.innerHTML = `<form class="prefs__in" method="dialog">
        <p class="prefs__t" id="prefs-t">Preferencias de cookies</p>
        ${CATEGORIES.length
          ? `<p class="prefs__p">Elige qué permites. Lo esencial (recordar esta elección) siempre está activo. <a href="/cookies">Política de cookies</a>.</p>
             <div class="pref"><strong>Esencial</strong><small>Recordar tu elección sobre las cookies. Siempre activo.</small><input type="checkbox" checked disabled></div>
             ${rows}
             <div class="consent__actions"><button class="btn-line" value="reject">Rechazar todo</button><button class="btn-fill" value="save">Guardar</button></div>`
          : `<p class="prefs__p">Este sitio <strong>no usa cookies opcionales</strong>: no tiene anuncios ni analítica. Solo guarda en tu navegador tu elección sobre las cookies, para cuando haya algo que decidir. <a href="/cookies">Política de cookies</a>.</p>
             <div class="consent__actions"><button class="btn-fill" value="close">Entendido</button></div>`}
      </form>`;
    dialog.addEventListener('close', () => {
      const value = dialog.returnValue;
      if (value === 'save') decide(Object.fromEntries(CATEGORIES.map((c) => [c.id, $(`input[name="${c.id}"]`, dialog).checked])));
      if (value === 'reject') decide(allChoices(false));
      dialog.remove();
    });
    document.body.append(dialog);
    dialog.showModal();
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-consent-open]')) openPrefs();
  });

  /* ════════ Anuncios (AdSense) ════════ */
  let adsLoaded = false;
  function loadAds() {
    const slots = $$('[data-ad]');
    if (adsLoaded || !CONFIG.ads || slots.length === 0) return;
    adsLoaded = true;
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(CONFIG.ads.client)}`;
    script.addEventListener('load', () => {
      slots.forEach((slot) => {
        slot.hidden = false;
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch { slot.hidden = true; }
      });
    });
    script.addEventListener('error', () => slots.forEach((slot) => slot.remove()));
    document.head.append(script);
  }

  if (CONFIG.ads) consentMode('default');
  if (CATEGORIES.length > 0 && !consent) showBanner();
  else applyConsent();

  /* ════════ Desde aquí, solo en las páginas nuevas (la portada tiene su propio menú en main.js) ════════ */
  if (!document.body.classList.contains('site')) return;

  /* Menú del celular */
  const burger = $('.gnav__burger');
  const sheet = $('#sheet');
  if (burger && sheet) {
    $$('nav > *', sheet).forEach((el, i) => el.style.setProperty('--i', i));
    const setSheet = (open) => {
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
    };
    burger.addEventListener('click', () => setSheet(burger.getAttribute('aria-expanded') !== 'true'));
    $$('a', sheet).forEach((a) => a.addEventListener('click', () => setSheet(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setSheet(false); burger.focus(); }
    });
    matchMedia('(min-width: 834px)').addEventListener('change', (e) => { if (e.matches) setSheet(false); });
  }

  /* Copiar el enlace de un artículo */
  $$('[data-copy-link]').forEach((button) => {
    button.addEventListener('click', async () => {
      const status = $('[data-copy-status]');
      const url = button.dataset.copyLink;
      try {
        if (navigator.share && matchMedia('(pointer: coarse)').matches) {
          await navigator.share({ title: document.title, url });
          return;
        }
        await navigator.clipboard.writeText(url);
        if (status) status.textContent = 'Enlace copiado.';
      } catch (error) {
        if (error?.name === 'AbortError') return;
        if (status) status.textContent = 'No se pudo copiar. Copia la dirección desde la barra del navegador.';
      }
      setTimeout(() => { if (status) status.textContent = ''; }, 4000);
    });
  });

  /* Tabla de contenido: marca la sección que estás leyendo */
  const tocLinks = $$('.toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const byId = new Map(tocLinks.map((a) => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        tocLinks.forEach((a) => a.removeAttribute('aria-current'));
        byId.get(entry.target.id)?.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    byId.forEach((_, id) => { const h = document.getElementById(id); if (h) io.observe(h); });
  }

  /* Buscador del blog */
  const searchForm = $('[data-search]');
  const results = $('[data-search-results]');
  const lists = $('[data-blog-lists]');
  if (searchForm && results) {
    const input = $('input', searchForm);
    let index = null;
    let loading = null;
    const load = () => {
      loading = loading || fetch(CONFIG.searchIndex, { headers: { Accept: 'application/json' } })
        .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
        .then((data) => { index = data; return data; });
      return loading;
    };
    const card = (p) => `<article class="card tone-${esc(p.tone)}"><a class="card__link" href="${esc(p.url)}">
        <div class="card__cover" aria-hidden="true"><span class="card__glyph">${esc(p.categoryName.charAt(0))}</span></div>
        <div class="card__body"><p class="card__meta"><span class="card__cat">${esc(p.categoryName)}</span><span>${p.minutes} min de lectura</span></p>
        <h3 class="card__title">${esc(p.title)}</h3><p class="card__excerpt">${esc(p.description)}</p></div></a></article>`;
    const show = (html) => { results.innerHTML = html; results.hidden = false; if (lists) lists.hidden = true; };
    const reset = () => { results.hidden = true; results.innerHTML = ''; if (lists) lists.hidden = false; };
    let timer = 0;
    const run = async (raw) => {
      const query = fold(raw).trim();
      if (query.length < 2) { reset(); return; }
      if (!index) show('<p class="search-results__msg">Buscando…</p>');
      try {
        const data = await load();
        const words = query.split(/\s+/);
        const found = data
          .map((p) => {
            const title = fold(p.title);
            const rest = fold(`${p.description} ${p.categoryName} ${p.text}`);
            if (!words.every((w) => title.includes(w) || rest.includes(w))) return null;
            return { p, score: words.filter((w) => title.includes(w)).length * 3 + 1 };
          })
          .filter(Boolean)
          .sort((a, b) => b.score - a.score);
        show(found.length
          ? `<h2 class="search-results__t">${found.length} ${found.length === 1 ? 'artículo' : 'artículos'} para «${esc(raw.trim())}»</h2><div class="grid">${found.map((f) => card(f.p)).join('')}</div>`
          : `<p class="search-results__msg">No encontramos artículos con «${esc(raw.trim())}». Prueba con otra palabra o mira las categorías.</p>`);
      } catch {
        show('<p class="search-results__msg">No se pudo cargar el buscador. Revisa tu conexión o navega por las categorías.</p>');
        loading = null;
      }
    };
    input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => run(input.value), 160); });
    searchForm.addEventListener('submit', (e) => { e.preventDefault(); run(input.value); });
    const initial = new URLSearchParams(location.search).get('q');
    if (initial) { input.value = initial; run(initial); }
  }

  /* Formulario de contacto */
  const form = $('[data-contact-form]');
  if (form) {
    const status = $('[data-contact-status]', form);
    const send = $('button[type="submit"]', form);
    const LIMITS = { name: 80, email: 120, subject: 120, message: 4000 };
    const setError = (name, text) => {
      const field = form.elements[name];
      const slot = $(`[data-error-for="${name}"]`, form);
      if (field) field.setAttribute('aria-invalid', text ? 'true' : 'false');
      if (slot) { slot.textContent = text; slot.hidden = !text; }
    };
    const validate = () => {
      const v = Object.fromEntries(['name', 'email', 'subject', 'message'].map((k) => [k, form.elements[k].value.trim()]));
      const errors = {
        name: v.name ? '' : 'Escribe tu nombre.',
        email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email) ? '' : 'Escribe un correo válido, por ejemplo nombre@ejemplo.com.',
        subject: v.subject ? '' : 'Escribe el asunto.',
        message: v.message.length >= 10 ? '' : 'Escribe tu mensaje (al menos 10 letras).',
      };
      for (const [k, max] of Object.entries(LIMITS)) if (!errors[k] && v[k].length > max) errors[k] = `Es demasiado largo (máximo ${max} letras).`;
      Object.entries(errors).forEach(([k, t]) => setError(k, t));
      return { values: v, ok: Object.values(errors).every((t) => !t) };
    };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.className = 'contact__status';
      if (!CONFIG.contactEndpoint || form.hasAttribute('data-disabled')) {
        status.textContent = 'El envío todavía no está activado: tu mensaje no se envió.';
        status.classList.add('is-error');
        return;
      }
      const { values, ok } = validate();
      if (!ok) { status.textContent = 'Revisa los campos marcados.'; status.classList.add('is-error'); $('[aria-invalid="true"]', form)?.focus(); return; }
      if (form.elements._gotcha.value) return; // casilla trampa para robots
      send.disabled = true;
      status.textContent = 'Enviando…';
      try {
        const reply = await fetch(CONFIG.contactEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...values, _subject: `ACCONTROL · ${values.subject}` }),
        });
        if (!reply.ok) throw new Error(String(reply.status));
        form.reset();
        status.textContent = 'Mensaje enviado. Te responderemos al correo que escribiste.';
        status.classList.add('is-ok');
      } catch {
        status.textContent = 'No se pudo enviar el mensaje. Revisa tu conexión e inténtalo de nuevo en unos minutos.';
        status.classList.add('is-error');
      } finally {
        send.disabled = false;
      }
    });
  }
})();
