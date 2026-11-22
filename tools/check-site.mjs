// ACCONTROL · revisión automática del sitio generado.
//   node tools/build-site.mjs && node tools/check-site.mjs
// Comprueba: enlaces internos (y sus #anclas), un solo h1 por página, títulos y descripciones únicos, canonical,
// JSON-LD válido, imágenes con alt, sitemap coherente y que no haya código de anuncios mientras estén apagados.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const { SITE, ADS } = await import(pathToFileURL(join(ROOT, 'site.config.mjs')).href);
const SKIP = new Set(['content', 'tools', '.git', '.impeccable', 'node_modules']);
const problems = [];
const fail = (where, what) => problems.push(`${where}: ${what}`);

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    if (SKIP.has(name)) return [];
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return htmlFiles(full);
    return name.endsWith('.html') ? [full] : [];
  });
}
/** Dirección pública de un archivo (como la sirve Vercel con cleanUrls). */
const urlOf = (file) => {
  const rel = `/${relative(ROOT, file).split(sep).join('/')}`;
  if (rel === '/index.html') return '/';
  return rel.replace(/\/index\.html$/, '').replace(/\.html$/, '');
};
/** Archivo que sirve una dirección, o null. */
function fileFor(path) {
  if (path === '/') return join(ROOT, 'index.html');
  const base = join(ROOT, ...path.split('/').filter(Boolean));
  for (const candidate of [base, `${base}.html`, join(base, 'index.html')]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}
const idsOf = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

const files = htmlFiles(ROOT);
const pages = new Map(files.map((f) => [urlOf(f), readFileSync(f, 'utf8')]));
const titles = new Map();
const descriptions = new Map();

for (const [url, html] of pages) {
  const noindex = /<meta name="robots" content="noindex/.test(html);
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) fail(url, `tiene ${h1} h1 (debe ser 1)`);
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  const description = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (!title) fail(url, 'sin <title>');
  if (!description) fail(url, 'sin meta description');
  if (!noindex) {
    if (titles.has(title)) fail(url, `título repetido con ${titles.get(title)}`);
    if (descriptions.has(description)) fail(url, `descripción repetida con ${descriptions.get(description)}`);
    titles.set(title, url);
    descriptions.set(description, url);
    const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
    if (canonical !== `${SITE.url}${url}`) fail(url, `canonical «${canonical}» no coincide con la dirección`);
  }
  // Encabezados: no saltar de h1 a h3, etc.
  let last = 1;
  for (const m of html.matchAll(/<h([1-6])[\s>]/g)) {
    const level = Number(m[1]);
    if (level > last + 1) fail(url, `salta de h${last} a h${level}`);
    last = level;
  }
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { fail(url, 'JSON-LD inválido'); }
  }
  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\salt="/.test(m[0])) fail(url, `imagen sin alt: ${m[0].slice(0, 80)}`);
  if (!(ADS.enabled && ADS.publisherId) && /adsbygoogle|googlesyndication/.test(html.replace(/<script src="[^"]*site\.js[^"]*"/, ''))) fail(url, 'tiene código de anuncios con los anuncios apagados');
  // Enlaces internos
  for (const m of html.matchAll(/\shref="([^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g, '&');
    if (/^(https?:|mailto:|tel:)/.test(href)) continue;
    const [pathPart, hash] = href.split('#');
    const path = pathPart === '' ? url : pathPart.split('?')[0];
    if (!path.startsWith('/')) { if (url !== '/') fail(url, `enlace relativo «${href}»`); continue; }
    const target = fileFor(path);
    if (!target) { fail(url, `enlace roto «${href}»`); continue; }
    if (hash && target.endsWith('.html')) {
      const targetHtml = readFileSync(target, 'utf8');
      if (!idsOf(targetHtml).has(hash)) fail(url, `el ancla «#${hash}» no existe en ${path}`);
    }
  }
}

// Sitemap: cada dirección existe, no es noindex, y no falta ninguna página indexable.
const sitemap = readFileSync(join(ROOT, 'sitemap.xml'), 'utf8');
const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE.url, '') || '/');
for (const path of listed) {
  const html = pages.get(path);
  if (!html) fail('sitemap.xml', `«${path}» no existe`);
  else if (/noindex/.test(html)) fail('sitemap.xml', `«${path}» está marcada noindex`);
}
for (const [url, html] of pages) {
  if (!/noindex/.test(html) && !listed.includes(url)) fail('sitemap.xml', `falta «${url}»`);
}
const robots = readFileSync(join(ROOT, 'robots.txt'), 'utf8');
if (!robots.includes(`Sitemap: ${SITE.url}/sitemap.xml`)) fail('robots.txt', 'no apunta al sitemap');
if (/Disallow:\s*\/\s*$/m.test(robots)) fail('robots.txt', 'bloquea todo el sitio');
if (!(ADS.enabled && ADS.publisherId) && existsSync(join(ROOT, 'ads.txt'))) fail('ads.txt', 'existe con los anuncios apagados');

console.log(`${pages.size} páginas revisadas, ${listed.length} direcciones en el sitemap.`);
if (problems.length) {
  console.log(`\n${problems.length} problema(s):\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log('Sin problemas.');
