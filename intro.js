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
// - Al terminar avisa con el evento `accontrol:intro-end` (main.js espera a ese aviso para contar el billete).
//
// Fluidez (sobre todo en celulares):
// - Solo el trazo de las letras, la raya y la palabra se calculan cuadro a cuadro (requestAnimationFrame), y solo se
//   tocan los atributos que cambian.
// - El giro del guilloché, los fundidos del fondo, el vuelo del logo y el armado de la página usan la Web Animations
//   API con transform/opacity: la tarjeta gráfica los mueve sola aunque el teléfono esté ocupado cargando la página.
// - Nada de desenfoques (filter: blur) al armar la página: son lo más caro de pintar.
'use strict';

(() => {
  const root = document.documentElement;
  if (!root.classList.contains('has-intro')) return;

  const SVGNS = 'http://www.w3.org/2000/svg';
  const LOGO_URL = 'assets/brand/logo-noche.svg';
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Línea de tiempo (ms). La versión calmada se salta el trazo y el vuelo.
  // drawA/drawC: cada letra se escribe por su cuenta, con calma, como a pluma.
  const T = calm
    ? { drawA: [0, 0], drawC: [0, 0], fill: [0, 700], line: [200, 700], word: [500, 1100], rings: 1, hold: 1600, exit: [1600, 2200] }
    : { drawA: [150, 1400], drawC: [550, 1800], fill: [1500, 2000], line: [1850, 2350], word: [2450, 3050], rings: 2000, hold: 3350, exit: [3350, 4050] };

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
  const inOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2; // trazo de pluma: arranca y termina suave, ritmo parejo
  const lerp = (a, b, t) => a + (b - a) * t;
  const EASE_OUT = 'cubic-bezier(.16, 1, .3, 1)';
  const EASE_IN_OUT = 'cubic-bezier(.65, 0, .35, 1)';

  // Solo escribe un atributo si su valor cambió (cada escritura obliga a repintar).
  const last = new WeakMap();
  const setA = (node, name, value) => {
    let m = last.get(node);
    if (!m) { m = new Map(); last.set(node, m); }
    if (m.get(name) === value) return;
    m.set(name, value);
    node.setAttribute(name, value);
  };
  const r3 = (v) => String(Math.round(v * 1000) / 1000);
  const r1 = (v) => String(Math.round(v * 10) / 10);

  /** Se acabó: todo queda como si nunca hubiera habido intro. */
  let finished = false;
  const announce = () => dispatchEvent(new Event('accontrol:intro-end'));
  let cleanup = () => {
    if (finished) return;
    finished = true;
    root.classList.remove('has-intro', 'intro-run');
    announce();
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
  let onSkip = () => { skipRequested = true; };
  const skip = () => onSkip();
  const skipEvents = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
  skipEvents.forEach((type) => addEventListener(type, skip, { passive: true }));
  cleanup = () => {
    if (finished) return;
    finished = true;
    skipEvents.forEach((type) => removeEventListener(type, skip));
    layer.remove();
    root.classList.remove('has-intro', 'intro-run');
    announce();
  };

  // Si el logo no llega en un tiempo razonable, no se hace esperar a nadie.
  const giveUp = setTimeout(() => cleanup(), 2500);

  fetch(LOGO_URL)
    .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
    .then((text) => { clearTimeout(giveUp); if (!finished) run(text); })
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

  // ---- Página: lo que se arma al final ------------------------------------------------------------------------
  // Solo opacidad y `translate` (no `transform`: main.js mueve con transform la computadora y el texto al hacer scroll,
  // y así las dos cosas se suman en vez de pisarse).
  function assemblePage() {
    const rise = (nodes, { delay = 0, step = 60, y = 26, duration = 760 } = {}) => {
      nodes.filter(Boolean).forEach((node, i) => {
        node.animate(calm
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [{ opacity: 0, translate: `0 ${y}px` }, { opacity: 1, translate: '0 0' }],
        { duration: calm ? 500 : duration, delay: delay + i * step, easing: EASE_OUT, fill: 'backwards' });
      });
    };
    const $$ = (s) => [...document.querySelectorAll(s)];
    // Barra de arriba: entra de arriba; luego cada enlace.
    rise([document.querySelector('.gnav__bar')], { y: -18, duration: 600 });
    rise($$('.gnav__menu > .gnav__item, .gnav__cta, .gnav__burger'), { delay: 120, step: 45, y: -12 });

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
      rise(spans, { delay: 160, step: 70, y: 46, duration: 900 });
      const end = (160 + (spans.length - 1) * 70 + 900) + 50;
      setTimeout(() => { title.innerHTML = original; }, end);
    } else {
      rise([title], { delay: 120 });
    }
    rise([document.querySelector('.hero__sub')], { delay: 520 });
    rise([...document.querySelectorAll('.hero__actions > *')], { delay: 660, step: 90, y: 18 });
    rise([document.querySelector('.hero__fine')], { delay: 820 });
    rise([document.querySelector('.hero .device')], { delay: 760, y: 80, duration: 1100 });
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
    const onResize = () => { from = startBox(); placeAt(from); };
    addEventListener('resize', onResize);

    // Guilloché: aparece, gira despacio y «respira» cuando termina la raya (todo en la tarjeta gráfica).
    const ringOpacity = calm ? 0.18 : 0.32;
    const startRings = () => {
      const total = T.exit[1];
      rosette.animate([{ opacity: 0 }, { opacity: ringOpacity }], { duration: 600, easing: EASE_OUT, fill: 'forwards' });
      if (!calm) {
        rosette.animate([{ rotate: '0deg' }, { rotate: `${total * 0.012}deg` }], { duration: total, fill: 'forwards' });
        rosette.animate([{ scale: 1 }, { scale: 1.04 }], { delay: T.line[1] - 100, duration: 600, easing: EASE_OUT, fill: 'forwards' });
      }
    };

    let start = performance.now();
    let exiting = false;

    /** Dibuja el logo tal como está en el instante t (ms). */
    function paint(t) {
      // Guilloché: se traza una sola vez al principio.
      if (t <= T.rings + 50) {
        const draw = outQuint(prog(t, [0, T.rings]));
        rings.forEach((ring, i) => setA(ring, 'stroke-dashoffset', r3(1 - clamp(draw * 1.15 - i * 0.04))));
      }
      hint.style.opacity = t > 900 && t < T.hold ? '1' : '0';

      // Trazo y relleno de las letras.
      if (!calm) {
        setA(a, 'stroke-dashoffset', r3(1 - inOutSine(prog(t, T.drawA))));
        setA(c, 'stroke-dashoffset', r3(1 - inOutSine(prog(t, T.drawC))));
      }
      const fill = r3(outQuint(prog(t, T.fill)));
      const strokeOut = calm ? '0' : r3(1 - outQuint(prog(t, [T.fill[0] + 200, T.fill[1] + 150])));
      for (const p of [a, c]) {
        setA(p, 'fill-opacity', fill);
        setA(p, 'stroke-opacity', strokeOut);
      }

      // La raya cruza y suelta el destello.
      const lineP = calm ? prog(t, T.line) : outQuint(prog(t, T.line));
      setA(lineClip, 'width', r1((LINE_SPAN + 40) * lineP));
      if (!calm) {
        const f = prog(t, [T.line[1] - 120, T.line[1] + 380]);
        setA(flash, 'r', r1(40 + 300 * outExpo(f)));
        setA(flash, 'opacity', r3(f <= 0 ? 0 : 0.9 * (1 - f)));
      }

      // El monograma viene desde el centro y se corre; aparece la palabra.
      const slide = inOut(prog(t, [T.word[0] - 150, T.word[1]]));
      const grow = calm ? 1 : lerp(1.32, 1.12, outExpo(prog(t, [0, T.fill[1] - 100])));
      const scale = lerp(grow, 1, slide);
      const dx = (LOGO_CENTER - MONO_CENTER) * (1 - slide);
      const cy = 342;
      setA(mono, 'transform', `translate(${r1(dx)} 0) translate(${MONO_CENTER} ${cy}) scale(${r3(scale)}) translate(${-MONO_CENTER} ${-cy})`);
      // La palabra sale de detrás del monograma y viaja con él: nunca se pisan.
      const wordP = outQuint(prog(t, T.word));
      setA(wordClip, 'width', r1(WORD_SPAN * wordP));
      setA(word, 'transform', `translate(${r1(dx)} 0)`);
      setA(word, 'opacity', r3(clamp(wordP * 1.6)));
    }

    /** Final: el logo vuela a la barra, el fondo se disuelve y la página se arma. */
    function exit() {
      if (exiting) return;
      exiting = true;
      removeEventListener('resize', onResize);
      paint(T.hold); // el logo queda completo, pase lo que pase
      layer.style.pointerEvents = 'none'; // la página ya se puede tocar
      hint.style.opacity = '0';

      const landing = target(); // se mide antes de que la barra empiece a moverse
      assemblePage();

      const duration = T.exit[1] - T.exit[0];
      bg.animate([{ opacity: 1 }, { opacity: 0 }], { delay: 100, duration: duration - 150, easing: EASE_IN_OUT, fill: 'forwards' });
      rosette.animate([{ opacity: ringOpacity }, { opacity: 0 }], { delay: 100, duration: duration - 150, easing: EASE_IN_OUT, fill: 'forwards' });
      let fly;
      if (calm) {
        fly = svg.animate([{ opacity: 1 }, { opacity: 0 }], { duration, easing: EASE_IN_OUT, fill: 'forwards' });
      } else {
        const to = landing ?? { x: from.x + from.w * 0.3, y: from.y + from.h * 0.3, w: from.w * 0.4, h: from.h * 0.4 };
        const frames = [
          { transform: 'translate(0px, 0px) scale(1)', opacity: 1 },
          { transform: `translate(${to.x - from.x}px, ${to.y - from.y}px) scale(${to.w / from.w})`, opacity: landing ? 1 : 0 },
        ];
        fly = svg.animate(frames, { duration, easing: EASE_IN_OUT, fill: 'forwards' });
      }
      fly.finished.then(cleanup, cleanup);
      setTimeout(cleanup, duration + 600); // por si el navegador no avisa (pestaña escondida, etc.)
      onSkip = cleanup; // un segundo toque durante el vuelo termina ya
    }

    function frame(now) {
      if (finished || exiting) return;
      let t = now - start;
      if (skipRequested) { skipRequested = false; t = T.hold; } // salta directo al vuelo final
      if (t >= T.hold) { exit(); return; }
      paint(t);
      requestAnimationFrame(frame);
    }

    // Al abrir, el navegador pasa un rato acomodando toda la portada (en un celular, unas décimas de segundo en las
    // que no puede dibujar). Se espera a que eso pase —3 cuadros seguidos a tiempo, o 1,2 s como mucho— para que el
    // trazo de las letras empiece sin tirones. Mientras, se ve el fondo de la marca.
    const t0 = performance.now();
    let prev = t0;
    let steady = 0;
    const settle = (now) => {
      if (finished) return;
      steady = now - prev < 34 ? steady + 1 : 0;
      prev = now;
      if (steady >= 3 || now - t0 > 1200 || skipRequested) {
        start = now;
        startRings();
        frame(now);
      } else {
        requestAnimationFrame(settle);
      }
    };
    requestAnimationFrame(settle);
  }
})();
