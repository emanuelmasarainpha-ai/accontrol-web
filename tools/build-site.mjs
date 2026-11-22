// ACCONTROL · generador del blog y de las páginas informativas.
//   node tools/build-site.mjs
// Lee:   site.config.mjs, content/blog/*.html (artículos) y content/paginas/*.html (páginas).
// Escribe: blog/ (listado, categorías, artículos, buscador), sobre-nosotros.html, contacto.html, privacidad.html,
//          cookies.html, terminos.html, 404.html, sitemap.xml, robots.txt y, solo si AdSense está configurado, ads.txt.
// También actualiza el bloque de configuración de index.html (entre las marcas site-config) sin tocar nada más.
// Sin dependencias: solo Node.

import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const { SITE, CATEGORIES, PAGE_SIZE, ADS, CONTACT, ANALYTICS } = await import(pathToFileURL(join(ROOT, 'site.config.mjs')).href);

// ───────────────────────────── utilidades ─────────────────────────────
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (path) => `${SITE.url}${path === '/' ? '/' : path}`;
const slugify = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
const stripTags = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const longDate = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d} de ${MONTHS[m - 1]} de ${y}`; };
const adsReady = () => ADS.enabled === true && /^pub-\d{10,20}$/.test(ADS.publisherId ?? '');
const write = (rel, text) => { const file = join(ROOT, rel); mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, text); };

/** Lee un archivo con encabezado «---  clave: valor  ---» y el cuerpo en HTML. */
function readContent(file) {
  const raw = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`${file}: falta el encabezado --- ... ---`);
  const meta = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^([a-zA-Z]+):\s*(.*)$/);
    if (m) meta[m[1]] = m[2].trim();
  }
  return { meta, body: match[2].replace(/<!--[\s\S]*?-->/g, '').trim() };
}

/** Pone id a los h2 y h3 que no lo tengan y devuelve la lista de h2 (para la tabla de contenido). */
function withHeadingIds(body) {
  const seen = new Set();
  const toc = [];
  const html = body.replace(/<(h[23])(\s[^>]*)?>([\s\S]*?)<\/\1>/g, (all, tag, attrs = '', inner) => {
    let id = (attrs.match(/\sid="([^"]+)"/) || [])[1];
    if (!id) {
      id = slugify(stripTags(inner)) || 'seccion';
      while (seen.has(id)) id += '-2';
    }
    seen.add(id);
    if (tag === 'h2') toc.push({ id, text: stripTags(inner) });
    return `<${tag}${attrs.replace(/\sid="[^"]*"/, '')} id="${id}">${inner}</${tag}>`;
  });
  return { html, toc };
}

// ───────────────────────────── contenido ─────────────────────────────
const catBySlug = new Map(CATEGORIES.map((c) => [c.slug, c]));

const posts = readdirSync(join(ROOT, 'content/blog')).filter((f) => f.endsWith('.html')).map((file) => {
  const { meta, body } = readContent(join(ROOT, 'content/blog', file));
  const slug = file.replace(/\.html$/, '');
  for (const key of ['title', 'description', 'date', 'category']) if (!meta[key]) throw new Error(`content/blog/${file}: falta «${key}»`);
  if (!catBySlug.has(meta.category)) throw new Error(`content/blog/${file}: la categoría «${meta.category}» no existe en site.config.mjs`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) throw new Error(`content/blog/${file}: la fecha debe ser AAAA-MM-DD`);
  if (meta.description.length > 170) console.warn(`Aviso: la descripción de ${file} pasa de 170 letras (Google la cortará).`);
  const words = stripTags(body).split(' ').length;
  const { html, toc } = withHeadingIds(body);
  return {
    slug, file, ...meta, featured: meta.featured === 'true', updated: meta.updated || meta.date,
    url: `/blog/${slug}`, body: html, toc, words, minutes: Math.max(1, Math.round(words / 200)), text: stripTags(body),
  };
}).sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'es'));

const pages = readdirSync(join(ROOT, 'content/paginas')).filter((f) => f.endsWith('.html')).map((file) => {
  const { meta, body } = readContent(join(ROOT, 'content/paginas', file));
  for (const key of ['title', 'description', 'path']) if (!meta[key]) throw new Error(`content/paginas/${file}: falta «${key}»`);
  return { ...meta, body: withHeadingIds(body).html };
});

// ───────────────────────────── piezas comunes ─────────────────────────────
const PAGE_CONFIG = {
  ads: adsReady() ? { client: `ca-${ADS.publisherId}` } : null,
  analytics: ANALYTICS.enabled === true,
  contactEndpoint: CONTACT.endpoint || '',
  searchIndex: '/blog/search-index.json',
};
const configBlock = `<script type="application/json" id="site-config">${JSON.stringify(PAGE_CONFIG)}</script>`;

const ORGANIZATION = { '@type': 'Organization', '@id': `${SITE.url}/#organizacion`, name: SITE.name, url: `${SITE.url}/`, logo: { '@type': 'ImageObject', url: abs(SITE.logo) } };
const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', ...data }).replace(/</g, '\\u003c')}</script>`;

function head({ title, description, path, type = 'website', noindex = false, extra = '', ld = [] }) {
  const url = abs(path);
  return `<!doctype html>
<html lang="${SITE.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  ${noindex ? '<meta name="robots" content="noindex, follow">' : `<link rel="canonical" href="${url}">`}
  <meta name="theme-color" content="#0e121a">
  <meta name="color-scheme" content="dark">
  <meta property="og:site_name" content="${SITE.name}">
  <meta property="og:locale" content="${SITE.locale}">
  <meta property="og:type" content="${type}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${abs(SITE.shareImage)}">
  <meta property="og:image:alt" content="Logo de ACCONTROL">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${abs(SITE.shareImage)}">
  ${extra}
  <link rel="icon" href="/assets/icon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/assets/icon-512.png">
  <link rel="preload" href="/assets/fonts/bodoni-moda-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/schibsted-grotesk-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/styles.css?v=${SITE.assetVersion}">
  <link rel="stylesheet" href="/site.css?v=${SITE.assetVersion}">
  <script src="/site.js?v=${SITE.assetVersion}" defer></script>
  ${configBlock}
  ${ld.map(jsonLd).join('\n  ')}
</head>`;
}

const NAV = [
  { href: '/', label: 'Inicio', key: 'home' },
  { href: '/blog', label: 'Blog', key: 'blog' },
  { href: '/sobre-nosotros', label: 'Sobre ACCONTROL', key: 'about' },
  { href: '/contacto', label: 'Contacto', key: 'contact' },
];

function header(active) {
  const current = (key) => (key === active ? ' aria-current="page"' : '');
  return `<body class="site" data-page="${active}">
  <a class="skip" href="#contenido">Saltar al contenido</a>
  <header class="gnav" id="gnav">
    <nav class="gnav__bar" aria-label="Principal">
      <a class="gnav__brand" href="/" aria-label="ACCONTROL, inicio">
        <img class="gnav__logo" src="/assets/brand/logo-noche.svg" alt="" width="150" height="26">
        <span class="sr">ACCONTROL</span>
      </a>
      <ul class="gnav__menu" role="list">
        ${NAV.map((n) => `<li class="gnav__item"><a class="gnav__link" href="${n.href}"${current(n.key)}>${n.label}</a></li>`).join('\n        ')}
      </ul>
      <a class="pill pill--sm gnav__cta" href="/#instalar">Instalar</a>
      <button class="gnav__burger" type="button" aria-expanded="false" aria-controls="sheet" aria-label="Abrir menú">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path class="b1" d="M4 9h16"/><path class="b2" d="M4 15h16"/></svg>
      </button>
    </nav>
  </header>
  <div class="sheet" id="sheet" hidden>
    <nav aria-label="Menú">
      ${NAV.map((n) => `<a class="sheet__link" href="${n.href}"${current(n.key)}>${n.label}</a>`).join('\n      ')}
      <a class="sheet__link" href="/#instalar">Instalar</a>
    </nav>
  </div>`;
}

export const FOOTER_RESOURCES = `<details class="foot__col" open><summary>Recursos<svg class="chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg></summary>
          <a href="/blog">Blog</a><a href="/sobre-nosotros">Sobre ACCONTROL</a><a href="/contacto">Contacto</a></details>`;
export const FOOTER_LEGAL = `<span class="foot__links"><a href="/privacidad">Política de privacidad</a><a href="/cookies">Política de cookies</a><a href="/terminos">Términos y condiciones</a><button type="button" data-consent-open>Preferencias de cookies</button></span>`;

const footer = `<footer class="foot">
    <div class="foot__in">
      <p class="foot__fine">ACCONTROL es una app para llevar tus finanzas personales y las de tu negocio. Los artículos del blog son informativos: no son asesoría financiera, legal ni fiscal.</p>
      <div class="foot__cols">
        <details class="foot__col" open><summary>Producto<svg class="chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg></summary>
          <a href="/#como-funciona">Cómo funciona</a><a href="/#funciones">Funciones</a><a href="/#compara">Compara espacios</a></details>
        <details class="foot__col" open><summary>Espacios<svg class="chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg></summary>
          <a href="/#espacios">Personal</a><a href="/#espacios">Freelancer</a><a href="/#espacios">Emprendedor</a><a href="/#espacios">Empresa</a></details>
        <details class="foot__col" open><summary>Ayuda<svg class="chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg></summary>
          <a href="/#instalar">Instalar</a><a href="/#privacidad">Privacidad</a><a href="/#preguntas">Preguntas</a></details>
        ${FOOTER_RESOURCES}
      </div>
      <p class="foot__legal"><span>ACCONTROL</span>${FOOTER_LEGAL}<span>Letras Bodoni Moda y Schibsted Grotesk, licencia OFL.</span></p>
    </div>
  </footer>
</body>
</html>
`;

function crumbs(items) {
  const html = `<nav class="crumbs" aria-label="Ruta de navegación"><ol role="list">${items.map((item, i) => (i === items.length - 1
    ? `<li><span aria-current="page">${esc(item.name)}</span></li>`
    : `<li><a href="${item.path}">${esc(item.name)}</a></li>`)).join('')}</ol></nav>`;
  const ld = { '@type': 'BreadcrumbList', itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: abs(item.path) })) };
  return { html, ld };
}

/** Espacio para un anuncio: SOLO existe si AdSense está configurado; si no, no se escribe nada en la página. */
function adSlot(name) {
  const slot = ADS.slots?.[name];
  if (!adsReady() || !/^\d{6,20}$/.test(slot ?? '')) return '';
  return `<aside class="ad" data-ad="${name}" aria-label="Publicidad" hidden>
      <p class="ad__label">Publicidad</p>
      <ins class="adsbygoogle ad__unit" data-ad-client="ca-${ADS.publisherId}" data-ad-slot="${slot}" data-ad-format="auto" data-full-width-responsive="true"></ins>
    </aside>`;
}

const toneOf = (post) => catBySlug.get(post.category).tone;

function card(post, level = 'h3') {
  const cat = catBySlug.get(post.category);
  return `<article class="card tone-${cat.tone}">
          <a class="card__link" href="${post.url}">
            <div class="card__cover" aria-hidden="true"><span class="card__glyph">${esc(cat.name.charAt(0))}</span></div>
            <div class="card__body">
              <p class="card__meta"><span class="card__cat">${esc(cat.name)}</span><span>${post.minutes} min de lectura</span></p>
              <${level} class="card__title">${esc(post.title)}</${level}>
              <p class="card__excerpt">${esc(post.description)}</p>
            </div>
          </a>
        </article>`;
}

const promo = `<aside class="promo" aria-labelledby="promo-t">
      <div class="promo__in">
        <p class="promo__kicker">ACCONTROL</p>
        <h2 class="promo__t" id="promo-t">Lleva tus cuentas en un solo lugar.</h2>
        <p class="promo__p">Ingresos, gastos, metas, deudas y, si tienes negocio, clientes, inventario y facturas internas. Cada espacio con sus datos aparte.</p>
        <a class="pill pill--sm promo__go" href="/#instalar">Conocer ACCONTROL</a>
      </div>
    </aside>`;

function pager(base, page, total) {
  if (total <= 1) return '';
  const href = (n) => (n === 1 ? base : `${base}/pagina/${n}`);
  const links = [];
  if (page > 1) links.push(`<a class="pager__step" href="${href(page - 1)}" rel="prev">Anteriores</a>`);
  for (let n = 1; n <= total; n += 1) links.push(n === page ? `<span class="pager__n" aria-current="page">${n}</span>` : `<a class="pager__n" href="${href(n)}">${n}</a>`);
  if (page < total) links.push(`<a class="pager__step" href="${href(page + 1)}" rel="next">Siguientes</a>`);
  return `<nav class="pager" aria-label="Páginas">${links.join('')}</nav>`;
}

function chips(active) {
  return `<nav class="chips" aria-label="Categorías">
        <a class="chip" href="/blog"${active ? '' : ' aria-current="page"'}>Todos</a>
        ${CATEGORIES.map((c) => `<a class="chip tone-${c.tone}" href="/blog/categoria/${c.slug}"${c.slug === active ? ' aria-current="page"' : ''}>${esc(c.name)}</a>`).join('\n        ')}
      </nav>`;
}

const searchBox = `<form class="search" role="search" action="/blog" method="get" data-search>
        <label class="sr" for="q">Buscar en el blog</label>
        <svg class="ico search__ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>
        <input class="search__input" id="q" name="q" type="search" placeholder="Buscar artículos" autocomplete="off" enterkeyhint="search">
      </form>
      <div class="search-results" data-search-results hidden aria-live="polite"></div>`;

// ───────────────────────────── páginas ─────────────────────────────
const out = []; // { path, lastmod, index }
const BLOG_DESC = 'Artículos sencillos y prácticos sobre finanzas personales, emprendimiento y administración de pequeños negocios, publicados por ACCONTROL.';

rmSync(join(ROOT, 'blog'), { recursive: true, force: true });

// Listado del blog (con páginas si crece)
const featured = posts.filter((p) => p.featured).slice(0, 3);
const rest = posts.filter((p) => !featured.includes(p));
const listPages = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
for (let page = 1; page <= listPages; page += 1) {
  const path = page === 1 ? '/blog' : `/blog/pagina/${page}`;
  const items = rest.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const bc = crumbs([{ name: 'Inicio', path: '/' }, { name: 'Blog', path: '/blog' }, ...(page > 1 ? [{ name: `Página ${page}`, path }] : [])]);
  const title = page === 1 ? 'Blog de ACCONTROL: finanzas, emprendimiento y negocios' : `Blog de ACCONTROL · página ${page}`;
  const blogLd = { '@type': 'Blog', '@id': `${SITE.url}/blog#blog`, name: 'Blog de ACCONTROL', url: abs('/blog'), inLanguage: SITE.lang, description: BLOG_DESC, publisher: { '@id': ORGANIZATION['@id'] } };
  const html = `${head({ title, description: page === 1 ? BLOG_DESC : `${BLOG_DESC} Página ${page}.`, path, ld: [ORGANIZATION, blogLd, bc.ld] })}
${header('blog')}
  <main id="contenido" class="blog">
    ${bc.html}
    <header class="blog__head">
      <p class="kicker">Blog · Recursos</p>
      <h1 class="blog__title">Aprende a gestionar mejor tu dinero y tu negocio</h1>
      <p class="blog__sub">Guías claras para organizar tus finanzas, llevar las cuentas de un negocio pequeño y entender tus números. Sin promesas mágicas: lo que funciona, explicado con ejemplos.</p>
      ${searchBox}
      ${chips(null)}
    </header>
    <div data-blog-lists>
    ${page === 1 && featured.length ? `<section class="shelf" aria-labelledby="dest-t">
      <h2 class="shelf__t" id="dest-t">Destacados</h2>
      <div class="grid grid--featured">
        ${featured.map((p) => card(p)).join('\n        ')}
      </div>
    </section>
    ${adSlot('blog-list')}` : ''}
    <section class="shelf" aria-labelledby="rec-t">
      <h2 class="shelf__t" id="rec-t">${page === 1 ? 'Recientes' : `Artículos · página ${page}`}</h2>
      ${items.length ? `<div class="grid">
        ${items.map((p) => card(p)).join('\n        ')}
      </div>` : '<p class="empty">Todavía no hay más artículos. Vuelve pronto.</p>'}
      ${pager('/blog', page, listPages)}
    </section>
    </div>
    ${promo}
  </main>
  ${footer}`;
  write(page === 1 ? 'blog/index.html' : `blog/pagina/${page}.html`, html);
  out.push({ path, lastmod: posts[0]?.updated, index: true });
}

// Categorías
for (const cat of CATEGORIES) {
  const list = posts.filter((p) => p.category === cat.slug);
  const total = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  for (let page = 1; page <= total; page += 1) {
    const base = `/blog/categoria/${cat.slug}`;
    const path = page === 1 ? base : `${base}/pagina/${page}`;
    const items = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const bc = crumbs([{ name: 'Inicio', path: '/' }, { name: 'Blog', path: '/blog' }, { name: cat.name, path: base }]);
    const empty = list.length === 0;
    const html = `${head({ title: `${cat.name} · Blog de ACCONTROL`, description: `${cat.description} Artículos del blog de ACCONTROL.`, path, noindex: empty, ld: [bc.ld] })}
${header('blog')}
  <main id="contenido" class="blog tone-${cat.tone}">
    ${bc.html}
    <header class="blog__head">
      <p class="kicker">Categoría</p>
      <h1 class="blog__title">${esc(cat.name)}</h1>
      <p class="blog__sub">${esc(cat.description)}</p>
      ${chips(cat.slug)}
    </header>
    <section class="shelf" aria-label="Artículos de ${esc(cat.name)}">
      ${empty ? `<div class="empty"><p><strong>Todavía no hay artículos en esta categoría.</strong></p><p>Mientras tanto, mira <a href="/blog">todos los artículos</a>.</p></div>` : `<div class="grid">
        ${items.map((p) => card(p, 'h2')).join('\n        ')}
      </div>`}
      ${pager(base, page, total)}
    </section>
    ${promo}
  </main>
  ${footer}`;
    write(page === 1 ? `blog/categoria/${cat.slug}.html` : `blog/categoria/${cat.slug}/pagina/${page}.html`, html);
    if (!empty) out.push({ path, lastmod: list[0].updated, index: true });
  }
}

// Artículos
for (const post of posts) {
  const cat = catBySlug.get(post.category);
  const bc = crumbs([{ name: 'Inicio', path: '/' }, { name: 'Blog', path: '/blog' }, { name: cat.name, path: `/blog/categoria/${cat.slug}` }, { name: post.title, path: post.url }]);
  const related = [...posts.filter((p) => p !== post && p.category === post.category), ...posts.filter((p) => p !== post && p.category !== post.category)].slice(0, 3);
  const ld = {
    '@type': 'BlogPosting', headline: post.title, description: post.description, datePublished: post.date, dateModified: post.updated,
    inLanguage: SITE.lang, articleSection: cat.name, wordCount: post.words, mainEntityOfPage: abs(post.url), url: abs(post.url),
    image: abs(post.image || SITE.shareImage), author: { '@id': ORGANIZATION['@id'] }, publisher: { '@id': ORGANIZATION['@id'] },
    isPartOf: { '@id': `${SITE.url}/blog#blog` },
  };
  // Anuncio a mitad del artículo: antes del h2 del medio (nunca dentro de una lista, una tabla ni un formulario).
  let body = post.body;
  const middle = adSlot('article-middle');
  if (middle && post.toc.length >= 4) {
    const target = post.toc[Math.floor(post.toc.length / 2)].id;
    body = body.replace(`<h2 id="${target}">`, `${middle}\n<h2 id="${target}">`);
  }
  const figure = post.image ? `<figure class="post__figure"><img src="${post.image}" alt="${esc(post.imageAlt || '')}" width="${post.imageWidth || ''}" height="${post.imageHeight || ''}" loading="lazy" decoding="async">${post.imageCaption ? `<figcaption>${esc(post.imageCaption)}</figcaption>` : ''}</figure>` : '';
  // Video del artículo (campos video, videoPoster y videoDuration del encabezado): reproductor bajo el título y VideoObject para Google.
  const video = post.video ? `<figure class="post__video">
        <video controls preload="none" playsinline poster="${post.videoPoster ? `${esc(post.videoPoster)}?v=${SITE.assetVersion}` : ''}" width="1920" height="1080" aria-describedby="vid-cap">
          <source src="${esc(post.video)}?v=${SITE.assetVersion}" type="video/mp4">
          Tu navegador no puede reproducir este video.
        </video>
        <figcaption id="vid-cap">${esc(post.videoCaption || 'Video: lo principal de este artículo en poco más de un minuto.')}</figcaption>
      </figure>` : '';
  const videoLd = post.video ? {
    '@type': 'VideoObject', name: post.title, description: post.description, thumbnailUrl: abs(post.videoPoster || SITE.shareImage),
    uploadDate: post.videoDate || post.updated, contentUrl: abs(post.video), embedUrl: abs(post.url), inLanguage: SITE.lang,
    ...(post.videoDuration ? { duration: post.videoDuration } : {}), publisher: { '@id': ORGANIZATION['@id'] },
  } : null;
  const shareUrl = encodeURIComponent(abs(post.url));
  const shareText = encodeURIComponent(post.title);
  const html = `${head({
    title: `${post.title} | Blog de ACCONTROL`, description: post.description, path: post.url, type: 'article',
    extra: `<meta property="article:published_time" content="${post.date}">\n  <meta property="article:modified_time" content="${post.updated}">\n  <meta property="article:section" content="${esc(cat.name)}">`,
    ld: [ORGANIZATION, ld, bc.ld, ...(videoLd ? [videoLd] : [])],
  })}
${header('blog')}
  <main id="contenido" class="post tone-${cat.tone}">
    ${bc.html}
    <article class="post__article">
      <header class="post__head">
        <a class="tag" href="/blog/categoria/${cat.slug}">${esc(cat.name)}</a>
        <h1 class="post__title">${esc(post.title)}</h1>
        <p class="post__lede">${esc(post.description)}</p>
        <p class="post__meta"><time datetime="${post.date}">${longDate(post.date)}</time><span aria-hidden="true">·</span><span>${post.minutes} min de lectura</span><span aria-hidden="true">·</span><span>Publicado por ACCONTROL</span></p>
      </header>
      ${video}
      <div class="post__layout${post.toc.length >= 4 ? '' : ' post__layout--single'}">
        ${post.toc.length >= 4 ? `<nav class="toc" aria-labelledby="toc-t">
          <p class="toc__t" id="toc-t">En este artículo</p>
          <ol role="list">${post.toc.map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join('')}</ol>
        </nav>` : ''}
        <div class="prose">
          ${figure}
          ${body}
          <p class="disclaimer">Este artículo es informativo y general: no es asesoría financiera, legal ni fiscal. Para tu caso concreto, consulta a un profesional o a la fuente oficial que corresponda.</p>
        </div>
      </div>
      <footer class="post__foot">
        <div class="share" aria-labelledby="share-t">
          <p class="share__t" id="share-t">Compartir</p>
          <a class="share__btn" href="https://wa.me/?text=${shareText}%20${shareUrl}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a class="share__btn" href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a class="share__btn" href="https://x.com/intent/post?text=${shareText}&amp;url=${shareUrl}" target="_blank" rel="noopener noreferrer">X</a>
          <a class="share__btn" href="https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <button class="share__btn" type="button" data-copy-link="${abs(post.url)}">Copiar enlace</button>
          <span class="share__ok" data-copy-status role="status"></span>
        </div>
        <a class="back" href="/blog"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>Volver al blog</a>
      </footer>
    </article>
    ${adSlot('article-end')}
    ${promo}
    <section class="related" aria-labelledby="rel-t">
      <h2 class="shelf__t" id="rel-t">Artículos relacionados</h2>
      <div class="grid">
        ${related.map((p) => card(p)).join('\n        ')}
      </div>
    </section>
  </main>
  ${footer}`;
  write(`blog/${post.slug}.html`, html);
  out.push({ path: post.url, lastmod: post.updated, index: true });
}

// Índice para el buscador (solo lo público de cada artículo)
write('blog/search-index.json', JSON.stringify(posts.map((p) => ({
  url: p.url, title: p.title, description: p.description, category: p.category, categoryName: catBySlug.get(p.category).name,
  tone: toneOf(p), minutes: p.minutes, date: p.date, text: p.text.slice(0, 4000),
}))));

// Páginas informativas y legales
const CONTACT_FORM = `<form class="contact" data-contact-form novalidate${CONTACT.endpoint ? '' : ' data-disabled'}>
          ${CONTACT.endpoint ? '' : `<p class="notice" role="note"><strong>El formulario todavía no está activado.</strong> Estamos configurando el servicio que recibe los mensajes. Hasta entonces no se envía nada, para que no escribas en vano.</p>`}
          <div class="field"><label for="c-name">Nombre</label><input id="c-name" name="name" type="text" autocomplete="name" maxlength="80" required aria-describedby="e-name"><p class="field__error" id="e-name" data-error-for="name" hidden></p></div>
          <div class="field"><label for="c-email">Correo electrónico</label><input id="c-email" name="email" type="email" autocomplete="email" maxlength="120" required aria-describedby="e-email"><p class="field__error" id="e-email" data-error-for="email" hidden></p></div>
          <div class="field"><label for="c-subject">Asunto</label><input id="c-subject" name="subject" type="text" maxlength="120" required aria-describedby="e-subject"><p class="field__error" id="e-subject" data-error-for="subject" hidden></p></div>
          <div class="field"><label for="c-message">Mensaje</label><textarea id="c-message" name="message" rows="6" maxlength="4000" required aria-describedby="e-message"></textarea><p class="field__error" id="e-message" data-error-for="message" hidden></p></div>
          <div class="hp" aria-hidden="true"><label for="c-web">No llenes este campo</label><input id="c-web" name="_gotcha" type="text" tabindex="-1" autocomplete="off"></div>
          <p class="fine">Usaremos tu nombre y tu correo solo para responderte. Más detalles en la <a href="/privacidad">política de privacidad</a>.</p>
          <button class="pill pill--lg contact__send" type="submit"${CONTACT.endpoint ? '' : ' disabled'}>${CONTACT.endpoint ? 'Enviar mensaje' : 'Envío no disponible todavía'}</button>
          <p class="contact__status" data-contact-status role="status" aria-live="polite"></p>
        </form>`;

for (const page of pages) {
  const bc = crumbs([{ name: 'Inicio', path: '/' }, { name: page.title, path: page.path }]);
  const active = page.path === '/sobre-nosotros' ? 'about' : page.path === '/contacto' ? 'contact' : 'legal';
  const updated = page.updated ? `<p class="page__meta">Última actualización: <time datetime="${page.updated}">${longDate(page.updated)}</time></p>` : '';
  const html = `${head({ title: `${page.title} · ACCONTROL`, description: page.description, path: page.path, ld: [ORGANIZATION, bc.ld] })}
${header(active)}
  <main id="contenido" class="page">
    ${bc.html}
    <article class="page__article">
      <header class="page__head">
        <h1 class="page__title">${esc(page.title)}</h1>
        ${page.lede ? `<p class="post__lede">${esc(page.lede)}</p>` : ''}
        ${updated}
      </header>
      <div class="prose">
        ${page.body.replace('{{contact-form}}', CONTACT_FORM)}
      </div>
    </article>
  </main>
  ${footer}`;
  write(`${page.path.slice(1)}.html`, html);
  out.push({ path: page.path, lastmod: page.updated, index: true });
}

// Página 404 (no se indexa)
write('404.html', `${head({ title: 'Página no encontrada · ACCONTROL', description: 'Esta página no existe o cambió de dirección.', path: '/404', noindex: true })}
${header('none')}
  <main id="contenido" class="page page--404">
    <article class="page__article">
      <header class="page__head">
        <p class="kicker">Error 404</p>
        <h1 class="page__title">Esta página no existe.</h1>
        <p class="post__lede">Puede que la dirección esté mal escrita o que el contenido haya cambiado de lugar.</p>
      </header>
      <p class="actions"><a class="pill pill--lg" href="/">Ir al inicio</a> <a class="link-more" href="/blog">Ver el blog</a></p>
    </article>
  </main>
  ${footer}`);

// ───────────────────────────── sitemap, robots y ads.txt ─────────────────────────────
const today = new Date().toISOString().slice(0, 10);
const urls = [{ path: '/', lastmod: today }, ...out.filter((u) => u.index)];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${abs(u.path)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`);
write('robots.txt', `# ACCONTROL · todo el sitio es público; no hay paneles privados en este dominio.
User-agent: *
Allow: /
Disallow: /blog/search-index.json

Sitemap: ${abs('/sitemap.xml')}
`);
if (adsReady()) {
  write('ads.txt', `google.com, ${ADS.publisherId}, DIRECT, f08c47fec0942fa0\n`);
} else if (existsSync(join(ROOT, 'ads.txt'))) {
  rmSync(join(ROOT, 'ads.txt'));
}

// ───────────────────────────── portada: solo el bloque de configuración ─────────────────────────────
const indexFile = join(ROOT, 'index.html');
const index = readFileSync(indexFile, 'utf8');
const marked = /<!-- site-config:start -->[\s\S]*?<!-- site-config:end -->/;
if (marked.test(index)) {
  writeFileSync(indexFile, index.replace(marked, `<!-- site-config:start -->${configBlock}<!-- site-config:end -->`));
}

console.log(`Listo: ${posts.length} artículos, ${pages.length} páginas, ${urls.length} direcciones en sitemap.xml${adsReady() ? ', ads.txt creado' : ' (anuncios apagados: sin ads.txt)'}.`);
