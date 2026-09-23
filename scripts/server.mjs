import http from 'node:http';
import path from 'node:path';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { build } from './build.mjs';

await build();
const root = path.resolve('dist');
const portFlag = process.argv.indexOf('--port');
const port = Number(process.env.PORT || (portFlag >= 0 ? process.argv[portFlag + 1] : 4321));
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.woff2': 'font/woff2', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };
const server = http.createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return; }
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); res.end(); return; }
  let file = path.resolve(root, `.${pathname}`);
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  try {
    if ((await stat(file)).isDirectory()) {
      if (!pathname.endsWith('/')) { res.writeHead(301, { Location: `${pathname}/` }); res.end(); return; }
      file = path.join(file, 'index.html');
    }
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(req.method === 'HEAD' ? undefined : await readFile(path.join(root, '404.html')));
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Site hazır: http://localhost:${port}`));
if (process.argv.includes('--watch')) {
  let timer;
  let building = false;
  let pending = false;
  async function rebuild() {
    if (building) { pending = true; return; }
    building = true;
    try { await build(); console.log('Değişiklik hazır. Tarayıcıyı yenileyin.'); }
    catch (error) { console.error(error.message); }
    finally { building = false; if (pending) { pending = false; await rebuild(); } }
  }
  for (const dir of ['src', 'public']) watch(dir, { recursive: true }, (_event, filename) => {
    if (filename && ['templates.mjs', 'icons.mjs'].includes(filename)) {
      console.log('Şablon değişikliği algılandı. Geliştirme sunucusunu yeniden başlatın.');
      return;
    }
    clearTimeout(timer);
    timer = setTimeout(rebuild, 150);
  });
}
