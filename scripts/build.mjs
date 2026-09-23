import { mkdir, rm, cp, writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { createSite, escape } from '../src/templates.mjs';
import { validateConfig } from './validate.mjs';

export async function build({ production = false, config } = {}) {
  const c = config || (await import(`${pathToFileURL(path.resolve('src/site.config.mjs')).href}?t=${Date.now()}`)).default;
  // published=true daima tam yayın doğrulamasını etkinleştirir.
  const errors = validateConfig(c, { production: production || c.published });
  if (errors.length) throw new Error(`Yayın bilgileri eksik veya geçersiz:\n- ${errors.join('\n- ')}`);
  const root = path.resolve('.');
  const output = path.resolve(root, 'dist');
  if (path.dirname(output) !== root || path.basename(output) !== 'dist') throw new Error('Güvenli olmayan çıktı yolu.');
  await rm(output, { recursive: true, force: true });
  await mkdir(path.join(output, 'assets'), { recursive: true });
  await cp(path.resolve('public'), output, { recursive: true });
  const styles = await Promise.all(['src/styles.css', 'src/refinements.css'].map(file => readFile(file, 'utf8')));
  await writeFile(path.join(output, 'assets/styles.css'), styles.join('\n'));
  await cp('src/main.js', path.join(output, 'assets/main.js'));
  const { pages, notFound } = createSite(c);
  for (const page of pages) {
    const folder = path.join(output, page.path);
    await mkdir(folder, { recursive: true });
    await writeFile(path.join(folder, 'index.html'), page.html);
  }
  await writeFile(path.join(output, '404.html'), notFound);
  const urls = c.published ? pages.map(p => `<url><loc>${escape(c.domain + p.path)}</loc></url>`).join('') : '';
  await writeFile(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
  await writeFile(path.join(output, 'robots.txt'), c.published ? `User-agent: *\nAllow: /\nSitemap: ${c.domain}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
  await writeFile(path.join(output, '_headers'), `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: SAMEORIGIN\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'\n/assets/*\n  Cache-Control: public, max-age=3600\n/images/*\n  Cache-Control: public, max-age=86400\n/fonts/*\n  Cache-Control: public, max-age=604800\n`);
  console.log(`${pages.length} sayfa oluşturuldu → dist/ (${c.published ? 'YAYIN' : 'ÖNİZLEME / noindex'})`);
  return { pages, config: c };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  build({ production: process.argv.includes('--production') }).catch(error => { console.error(error.message); process.exitCode = 1; });
}
