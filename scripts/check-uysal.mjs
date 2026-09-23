import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import sharp from 'sharp';
import { JSDOM } from 'jsdom';
import config from '../src/site.config.mjs';
import { createSite } from '../src/templates.mjs';

for (const variant of ['light', 'dark']) {
  await sharp(`public/images/uysal-logo-${variant}.svg`).resize({ width: 1488 }).png().toFile(`public/images/uysal-logo-${variant}.png`);
}
const site = createSite(config);
const routes = new Set(site.pages.map(p => p.path));
for (const page of site.pages) {
  const doc = new JSDOM(page.html).window.document;
  assert.ok(doc.title.includes('UYSAL OTO KURTARMA'));
  assert.ok(!/Yenişehir|YENİŞEHİR/.test(page.html));
  assert.ok(doc.body.textContent.includes('0534 222 49 83'));
  assert.ok(doc.body.textContent.includes('Toroslar başta olmak üzere tüm Mersin'));
  for (const a of doc.querySelectorAll('a[href^="tel:"]')) assert.equal(a.getAttribute('href'), 'tel:+905342224983');
  for (const a of doc.querySelectorAll('a[href*="wa.me/"]')) assert.ok(a.href.startsWith('https://wa.me/905342224983?'));
  for (const a of doc.querySelectorAll('a[href^="/"]')) assert.ok(routes.has(a.getAttribute('href')));
  for (const img of doc.querySelectorAll('img[src]')) await access(`public${img.getAttribute('src')}`);
  for (const source of doc.querySelectorAll('source[srcset]')) await access(`public${source.getAttribute('srcset')}`);
}
assert.equal(config.gallery.length, 3);
console.log(`${site.pages.length} sayfada UYSAL markası, telefon, WhatsApp, hizmet alanı ve görseller doğrulandı.`);
