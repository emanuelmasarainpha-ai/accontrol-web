// ACCONTROL · sitio web · INTRO DEL LOGO al abrir la portada (cada vez que se abre).
// ----------------------------------------------------------------------------------------------------------------
// 1. Sobre el fondo de la marca se dibuja el guilloché (las líneas de billete del sitio) y gira despacio.
// 2. La A y la C del monograma se trazan como con pluma (contorno lila) y se rellenan de marfil.
// 3. La raya lavanda (la ✓) cruza las letras de izquierda a derecha y suelta un destello.
// 4. El monograma se corre a su sitio y aparece «ACCONTROL»: el logo completo.
// 5. El logo vuela a su lugar en la barra de arriba mientras el fondo se disuelve y la página se arma:
//    baja la navegación, el titular sube palabra por palabra, después el texto, los botones y la computadora.
//
// - Usa las formas REALES del logo (assets/brand/logo-noche.svg), no un dibujo aparte.
// - La decide el script del <head> de index.html (clase `has-intro`), antes de pintar, para que no se vea la página
//   un instante. Sin JavaScript, o con un enlace a otra sección (#…, salvo #resumen), no sale.
// - Un toque, un clic o una tecla la saltan. Con «reducir movimiento» sale una versión calmada (solo fundidos).
// - No usa librerías: un reloj con requestAnimationFrame para el logo y la Web Animations API para la página.
'use strict';

(() => {
  const root = document.documentElement;
  if (!root.classList.contains('has-intro')) return;

  const SVGNS = 'http://www.w3.org/2000/svg';
  const LOGO_URL = 'assets/brand/logo-noche.svg';
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Línea de tiempo (ms). La versión calmada se salta el trazo y el vuelo.
  const T = calm
    ? { draw: [0, 0], fill: [0, 700], line: [200, 700], word: [500, 1100], hold: 1600, exit: [1600, 2200], page: 1650, end: 2250 }
    : { draw: [150, 1100], fill: [850, 1300], line: [1150, 1650], word: [1750, 2350], hold: 2650, exit: [2650, 3350], page: 2700, end: 3400 };

  // Medidas del logo (unidades de su dibujo, viewBox «2 130 2153 420»).
  const VIEW = { x: 2, y: 130, w: 2153, h: 420 };
  const MONO_CENTER = 370;         // centro del monograma (A + C + raya)
  const LOGO_CENTER = VIEW.x + VIEW.w / 2;
  const LINE_FROM = 175;           // la raya va de x=175 a x=687
  const LINE_SPAN = 512;
  const WORD_FROM = 740;           // «ACCONTROL» va de x≈763 a x≈2104
  const WORD_SPAN = 1400;

  const clamp = (v) => Math.min(1, Math.max(0, v));
  const prog = (t, [a, b]) => (b <= a ? (t >= b ? 1 : 0) : clamp((t - a) / (b - a)));
  const outExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
  const outQuint = (t) => 1 - Math.pow(1 - t, 5);
  const inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const lerp = (a, b, t) => a + (b - a) * t;

  /** Se acabó: todo queda como si nunca hubiera habido intro. */
  let cleanup = () => {
    root.classList.remove('has-intro', 'intro-run');
  };

  // Pestaña en segundo plano: no vale la pena (nadie la vería y los relojes van lentos).
  if (document.visibilityState === 'hidden') { cleanup(); return; }

  // ---- Guilloché (hipotrocoides, como en el resto del sitio) ----------------------------------------------------
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  function hypotrochoid({ R, r, d, scale = 1, rotate = 0 }) {
    const turns = r / gcd(R, r);
    const total = Math.max(64, Math.round(200 * turns));
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
  const el = (tag, attrs = {}, ns = SVGNS) => {
    const node = ns ? document.createElementNS(ns, tag) : document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
    return node;
  };

  // ---- Capa de la intro ---------------------------------------------------------------------------------------
  const layer = el('div', { class: 'intro', 'aria-hidden': 'true' }, null);
  const bg = el('div', { class: 'intro__bg' }, null);
  const rosette = el('svg', { class: 'intro__rosette', viewBox: '-130 -130 260 260' });
  const rings = [1, 0.86, 0.72, 0.58, 0.44].map((scale, i) => el('path', {
    d: hypotrochoid({ R: 120, r: 8, d: 7, scale, rotate: i * 5 }), pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1,
  }));
  rosette.append(...rings);
  const hint = el('p', { class: 'intro__hint' }, null);
  hint.textContent = 'Toca para saltar';
  layer.append(bg, rosette, hint);
  document.body.append(layer);
  root.classList.add('intro-run');
  root.classList.remove('has-intro'); // la tapa del <head> ya no hace falta: ahora tapa la capa de la intro

  let skipRequested = false;
  const skip = () => { skipRequested = true; };
  const skipEvents = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
  skipEvents.forEach((type) => addEventListener(type, skip, { passive: true }));
  cleanup = () => {
    skipEvents.forEach((type) => removeEventListener(type, skip));
    layer.remove();
    root.classList.remove('has-intro', 'intro-run');
  };

  // Si el logo no llega en un tiempo razonable, no se hace esperar a nadie.
  const giveUp = setTimeout(() => cleanup(), 2500);

  fetch(LOGO_URL)
    .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
    .then((text) => { clearTimeout(giveUp); run(text); })
    .catch(() => { clearTimeout(giveUp); cleanup(); });

  // ---- El logo, armado para animar ----------------------------------------------------------------------------
  function buildLogo(text) {
    const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
    const src = doc.documentElement;
    // Ids propios para no chocar con nada de la página.
    src.querySelectorAll('[id]').forEach((n) => n.setAttribute('id', `intro-${n.getAttribute('id')}`));
    src.querySelectorAll('[mask],[clip-path]').forEach((n) => {
      for (const attr of ['mask', 'clip-path']) {
        const v = n.getAttribute(attr);
        if (v) n.setAttribute(attr, v.replace('url(#', 'url(#intro-'));
      }
    });
    const svg = /** @type {SVGSVGElement} */ (document.importNode(src, true));
    svg.setAttribute('class', 'intro__logo');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('overflow', 'visible');

    const defs = svg.querySelector('defs') ?? svg.insertBefore(el('defs'), svg.firstChild);
    // Recortes que crecen: la raya (de izquierda a derecha) y la palabra.
    const lineClip = el('rect', { x: LINE_FROM - 20, y: 0, width: 0, height: 800 });
    const wordClip = el('rect', { x: WORD_FROM, y: 0, width: 0, height: 800 });
    const grad = el('radialGradient', { id: 'intro-flash-g' });
    grad.append(el('stop', { offset: '0', 'stop-color': '#efe6ff', 'stop-opacity': '0.95' }),
      el('stop', { offset: '0.45', 'stop-color': '#c9b3f0', 'stop-opacity': '0.45' }),
      el('stop', { offset: '1', 'stop-color': '#c9b3f0', 'stop-opacity': '0' }));
    const lineClipPath = el('clipPath', { id: 'intro-line-clip', clipPathUnits: 'userSpaceOnUse' });
    const wordClipPath = el('clipPath', { id: 'intro-word-clip', clipPathUnits: 'userSpaceOnUse' });
    lineClipPath.append(lineClip);
    wordClipPath.append(wordClip);
    defs.append(lineClipPath, wordClipPath, grad);

    // Las piezas visibles: las que no están dentro de <defs>.
    const visible = [...svg.children].filter((n) => n.tagName.toLowerCase() === 'path');
    const lineEl = visible.find((p) => (p.getAttribute('fill') ?? '').toLowerCase() === '#c9b3f0');
    const letters = visible.filter((p) => p.hasAttribute('mask'));
    const word = visible.find((p) => p !== lineEl && !p.hasAttribute('mask'));
    if (!lineEl || letters.length !== 2 || !word) return null;
    const startX = (p) => Number(/^M\s*(-?[\d.]+)/.exec(p.getAttribute('d') ?? '')?.[1] ?? 0);
    const [a, c] = letters.sort((x, y) => startX(x) - startX(y));

    // La raya también corta las letras (el entrelazado): esos cortes crecen junto con la raya.
    lineEl.setAttribute('clip-path', 'url(#intro-line-clip)');
    const lineD = lineEl.getAttribute('d');
    defs.querySelectorAll('mask path').forEach((p) => {
      if (p.getAttribute('d') === lineD) p.setAttribute('clip-path', 'url(#intro-line-clip)');
    });
    word.setAttribute('clip-path', 'url(#intro-word-clip)');

    // Monograma en su propio grupo (se mueve y crece aparte de la palabra).
    const mono = el('g');
    const flash = el('circle', { cx: 660, cy: 196, r: 0, fill: 'url(#intro-flash-g)', opacity: 0 });
    svg.insertBefore(mono, word);
    mono.append(a, c, lineEl, flash);

    // Las letras arrancan como contorno a medio dibujar.
    for (const p of [a, c]) {
      p.setAttribute('pathLength', '1');
      p.setAttribute('stroke', '#cdbbf0');
      p.setAttribute('stroke-width', '5');
      p.setAttribute('stroke-linejoin', 'round');
      p.setAttribute('stroke-dasharray', '1');
      p.setAttribute('stroke-dashoffset', calm ? '0' : '1');
      p.setAttribute('fill-opacity', '0');
      p.setAttribute('stroke-opacity', calm ? '0' : '1');
    }
    return { svg, mono, a, c, word, lineClip, wordClip, flash };
  }

  // ---- Páginas: lo que se arma al final -----------------------------------------------------------------------
  function assemblePage() {
    const ease = 'cubic-bezier(.16, 1, .3, 1)';
    const base = calm ? [{ opacity: 0 }, { opacity: 1 }] : null;
    const rise = (nodes, { delay = 0, step = 60, y = 26, blur = 8, duration = 760 } = {}) => {
      nodes.filter(Boolean).forEach((node, i) => {
        node.animate(base ?? [
          { opacity: 0, transform: `translateY(${y}px)`, filter: `blur(${blur}px)` },
          { opacity: 1, transform: 'none', filter: 'blur(0px)' },
        ], { duration: calm ? 500 : duration, delay: delay + i * step, easing: ease, fill: 'backwards' });
      });
    };
    const $$ = (s) => [...document.querySelectorAll(s)];
    // Barra de arriba: entra de arriba; luego cada enlace.
    rise([document.querySelector('.gnav__bar')], { y: -18, blur: 0, duration: 600 });
    rise($$('.gnav__menu > .gnav__item, .gnav__cta, .gnav__burger'), { delay: 120, step: 45, y: -12, blur: 0 });

    // Titular: palabra por palabra (al terminar se devuelve el texto tal como estaba).
    const title = document.querySelector('.hero__title');
    if (title && !calm) {
      const original = title.innerHTML;
      const words = title.textContent.split(' ').filter(Boolean);
      title.replaceChildren(...words.flatMap((w, i) => {
        const span = document.createElement('span');
        span.className = 'intro-w';
        span.textContent = w;
        return i < words.length - 1 ? [span, document.createTextNode(' ')] : [span];
      }));
      const spans = [...title.querySelectorAll('.intro-w')];
      rise(spans, { delay: 160, step: 70, y: 46, blur: 12, duration: 900 });
      const last = (160 + (spans.length - 1) * 70 + 900) + 50;
      setTimeout(() => { title.innerHTML = original; }, last);
    } else {
      rise([title], { delay: 120 });
    }
    rise([document.querySelector('.hero__sub')], { delay: 520 });
    rise([...document.querySelectorAll('.hero__actions > *')], { delay: 660, step: 90, y: 18, blur: 4 });
    rise([document.querySelector('.hero__fine')], { delay: 820, blur: 0 });
    rise([document.querySelector('.hero .device')], { delay: 760, y: 80, blur: 6, duration: 1100 });
  }

  // ---- El reloj -----------------------------------------------------------------------------------------------
  function run(text) {
    const parts = buildLogo(text);
    if (!parts) { cleanup(); return; }
    const { svg, mono, a, c, word, lineClip, wordClip, flash } = parts;
    layer.insertBefore(svg, hint);

    // Dónde aterriza: el logo de la barra (el dibujo dentro del <img> mantiene su proporción y va centrado).
    const target = () => {
      const img = document.querySelector('.gnav__logo');
      const r = img?.getBoundingClientRect();
      if (!r || r.width < 4 || r.height < 4 || r.bottom < 0) return null;
      const ratio = VIEW.w / VIEW.h;
      const w = Math.min(r.width, r.height * ratio);
      const h = w / ratio;
      return { x: r.left + (r.width - w) / 2, y: r.top + (r.height - h) / 2, w, h };
    };
    // Tamaño y lugar en el centro de la pantalla.
    const startBox = () => {
      const w = Math.min(innerWidth * 0.86, 840);
      const h = (w * VIEW.h) / VIEW.w;
      return { x: (innerWidth - w) / 2, y: (innerHeight - h) / 2 - innerHeight * 0.02, w, h };
    };
    svg.style.position = 'absolute';
    svg.style.transformOrigin = '0 0';
    const placeAt = (box) => {
      svg.style.left = `${box.x}px`;
      svg.style.top = `${box.y}px`;
      svg.style.width = `${box.w}px`;
      svg.style.height = `${box.h}px`;
    };
    let from = startBox();
    placeAt(from);
    addEventListener('resize', () => { from = startBox(); placeAt(from); });

    let start = performance.now();
    let assembled = false;
    let landing = null;
    const setT = (ms) => { start = performance.now() - ms; };

    function frame(now) {
      let t = now - start;
      if (skipRequested) {
        skipRequested = false;
        if (t < T.hold) { setT(T.hold); t = T.hold; } // salta directo al vuelo final
        else if (t < T.exit[1] - 80) { setT(T.exit[1] - 80); t = T.exit[1] - 80; }
      }

      // Fondo y guilloché.
      const out = inOut(prog(t, [T.exit[0] + 100, T.exit[1] - 50]));
      bg.style.opacity = String(1 - out);
      const draw = outQuint(prog(t, [0, calm ? 1 : 1500]));
      rings.forEach((ring, i) => ring.setAttribute('stroke-dashoffset', String(1 - clamp(draw * 1.15 - i * 0.04))));
      rosette.style.opacity = String((calm ? 0.18 : 0.32) * outQuint(prog(t, [0, 600])) * (1 - out));
      rosette.style.transform = calm ? '' : `rotate(${t * 0.012}deg) scale(${1 + 0.04 * outExpo(prog(t, [T.line[1] - 100, T.line[1] + 500]))})`;
      hint.style.opacity = t > 900 && t < T.hold ? '1' : '0';

      // Trazo y relleno de las letras.
      const dA = outQuint(prog(t, [T.draw[0], T.draw[1] - 150]));
      const dC = outQuint(prog(t, [T.draw[0] + 150, T.draw[1]]));
      if (!calm) {
        a.setAttribute('stroke-dashoffset', String(1 - dA));
        c.setAttribute('stroke-dashoffset', String(1 - dC));
      }
      const fill = outQuint(prog(t, T.fill));
      for (const p of [a, c]) {
        p.setAttribute('fill-opacity', String(fill));
        if (!calm) p.setAttribute('stroke-opacity', String(1 - outQuint(prog(t, [T.fill[0] + 200, T.fill[1] + 150]))));
      }

      // La raya cruza y suelta el destello.
      const lineP = calm ? prog(t, T.line) : outQuint(prog(t, T.line));
      lineClip.setAttribute('width', String((LINE_SPAN + 40) * lineP));
      if (!calm) {
        const f = prog(t, [T.line[1] - 120, T.line[1] + 380]);
        flash.setAttribute('r', String(40 + 300 * outExpo(f)));
        flash.setAttribute('opacity', String(f <= 0 ? 0 : 0.9 * (1 - f)));
      }

      // El monograma viene desde el centro y se corre; aparece la palabra.
      const slide = inOut(prog(t, [T.word[0] - 150, T.word[1]]));
      const grow = calm ? 1 : lerp(1.32, 1.12, outExpo(prog(t, [0, 1300])));
      const scale = lerp(grow, 1, slide);
      const dx = (LOGO_CENTER - MONO_CENTER) * (1 - slide);
      const cy = 342;
      mono.setAttribute('transform', `translate(${dx} 0) translate(${MONO_CENTER} ${cy}) scale(${scale}) translate(${-MONO_CENTER} ${-cy})`);
      // La palabra sale de detrás del monograma y viaja con él: nunca se pisan.
      const wordP = outQuint(prog(t, T.word));
      wordClip.setAttribute('width', String(WORD_SPAN * wordP));
      word.setAttribute('transform', `translate(${dx} 0)`);
      word.setAttribute('opacity', String(clamp(wordP * 1.6)));

      // Vuelo a la barra (o, si no se ve, se encoge en su sitio) y la página se arma.
      if (t >= T.page && !assembled) {
        assembled = true;
        landing = target();
        assemblePage();
      }
      const fly = inOut(prog(t, T.exit));
      if (fly > 0) {
        layer.style.pointerEvents = 'none'; // la página ya se puede tocar
        if (calm) {
          svg.style.opacity = String(1 - fly); // versión calmada: se desvanece en su sitio
        } else {
          const to = landing ?? { x: from.x + from.w * 0.3, y: from.y + from.h * 0.3, w: from.w * 0.4, h: from.h * 0.4 };
          const s = lerp(1, to.w / from.w, fly);
          svg.style.transform = `translate(${lerp(0, to.x - from.x, fly)}px, ${lerp(0, to.y - from.y, fly)}px) scale(${s})`;
          if (!landing) svg.style.opacity = String(1 - fly);
        }
      }

      if (t >= T.end) { cleanup(); return; }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame((now) => { start = now; frame(now); });
  }
})();
