// Servidor local para ver el sitio: node tools/serve.mjs  ->  http://localhost:5300
// Imita a Vercel: direcciones sin «.html» (/blog, /blog/articulo), sin barra al final y la página 404.html.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, sep, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT) || 5300;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8' };
const isFile = async (path) => { try { return (await stat(path)).isFile(); } catch { return false; } };

createServer(async (req, res) => {
  const [rawPath, query = ''] = (req.url || '/').split('?');
  const url = decodeURIComponent(rawPath);
  if (url.length > 1 && url.endsWith('/')) { res.writeHead(308, { Location: url.slice(0, -1) + (query ? `?${query}` : '') }).end(); return; }
  if (url.endsWith('.html') && url !== '/index.html') { res.writeHead(308, { Location: url.slice(0, -5) }).end(); return; }
  const base = normalize(join(ROOT, url === '/' ? 'index.html' : url));
  if (!base.startsWith(ROOT + sep) || base.includes(`${sep}.`)) { res.writeHead(403).end(); return; }
  const candidates = extname(base) ? [base] : [`${base}.html`, join(base, 'index.html')];
  for (const path of candidates) {
    if (await isFile(path)) {
      res.writeHead(200, { 'Content-Type': TYPES[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-store' }).end(await readFile(path));
      return;
    }
  }
  const notFound = join(ROOT, '404.html');
  if (await isFile(notFound)) res.writeHead(404, { 'Content-Type': TYPES['.html'] }).end(await readFile(notFound));
  else res.writeHead(404).end('No encontrado');
}).listen(PORT, () => console.log(`ACCONTROL sitio: http://localhost:${PORT}`));
