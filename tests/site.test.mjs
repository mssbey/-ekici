import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import config from '../src/site.config.mjs';
import { createSite } from '../src/templates.mjs';
import { validateConfig } from '../scripts/validate.mjs';

const draft = structuredClone(config);
Object.assign(draft, { published: false, domain: '', phone: '', whatsapp: '', city: '', district: '', address: '', hoursLabel: '', about: '', openingHours: [], regions: [], gallery: [] });
draft.services.forEach(s => { s.verified = false; });
const preview = createSite(draft);
const fixture = structuredClone(config);
// Bunlar yalnızca test verileridir; hiçbir oluşturulmuş siteye yazılmaz.
Object.assign(fixture, { published: true, domain: 'https://test-isletme.test', phone: '+905550000000', whatsapp: '+905550000000', city: 'Test İl', district: 'Test İlçe', address: 'Test adres', hoursLabel: 'Pazartesi 09.00–18.00', about: 'İşletme tarafından doğrulanmış örnek test metni.', openingHours: [{ days: ['Monday'], opens: '09:00', closes: '18:00' }], regions: [{ name: 'Test Bölge', description: 'Sadece test amacıyla kullanılan özgün bölge açıklaması.', verified: true }] });
fixture.services[0].verified = true;
const production = createSite(fixture);

test('önizleme: tek H1, benzersiz başlık ve açıklama, noindex', () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const page of preview.pages) {
    const doc = new JSDOM(page.html).window.document;
    assert.equal(doc.querySelectorAll('h1').length, 1, page.path);
    assert.equal(doc.documentElement.lang, 'tr');
    assert.equal(doc.querySelector('meta[name="robots"]').content, 'noindex, nofollow');
    assert.ok(!titles.has(doc.title)); titles.add(doc.title);
    const desc = doc.querySelector('meta[name="description"]').content;
    assert.ok(!descriptions.has(desc)); descriptions.add(desc);
    assert.equal(doc.querySelector('link[rel="canonical"]'), null);
    assert.equal(doc.querySelector('a[href^="tel:"]'), null);
    assert.equal(doc.querySelector('a[href*="wa.me"]'), null);
    assert.ok(!page.html.includes('Bursa'));
  }
});

test('gerçek bilgi olmadan yayın engellenir', () => {
  const errors = validateConfig(draft, { production: true });
  assert.ok(errors.some(e => e.startsWith('phone:')));
  assert.ok(errors.some(e => e.startsWith('domain:')));
  assert.ok(errors.some(e => e.includes('hizmet doğrulanmalı')));
  assert.deepEqual(validateConfig(fixture, { production: true }), []);
});

test('yayında yalnızca doğrulanmış hizmet görünür; bağımsız detay sayfası üretilir', () => {
  assert.equal(preview.pages.filter(p => p.path.startsWith('/hizmetler/') && p.path !== '/hizmetler/').length, 0);
  assert.ok(production.pages.some(p => p.path === '/hizmetler/oto-kurtarma/'));
  assert.ok(!production.pages.some(p => p.path === '/hizmetler/cekici/'));
  const doc = new JSDOM(production.pages[0].html).window.document;
  assert.equal(doc.querySelectorAll('.service-card').length, 1);
  assert.equal(doc.querySelectorAll('.draft-label').length, 0);
});

test('yayın SEO, canonical, breadcrumb ve işletme verisi aynı kaynaktan gelir', () => {
  for (const page of production.pages) {
    const doc = new JSDOM(page.html).window.document;
    assert.equal(doc.querySelectorAll('h1').length, 1);
    assert.equal(doc.querySelector('link[rel="canonical"]').href, fixture.domain + page.path);
    assert.equal(doc.querySelector('meta[property="og:url"]').content, fixture.domain + page.path);
    const schemas = JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent);
    assert.equal(schemas[0].telephone, fixture.phone);
    assert.equal(schemas[0].address.addressLocality, fixture.district);
    assert.ok(!schemas[0].aggregateRating);
    assert.ok(!schemas[0].review);
    if (page.path !== '/') assert.ok(schemas.some(s => s['@type'] === 'BreadcrumbList'));
    for (const link of doc.querySelectorAll('a[href^="tel:"]')) assert.equal(link.getAttribute('href'), `tel:${fixture.phone}`);
    for (const link of doc.querySelectorAll('a[href*="wa.me"]')) assert.ok(link.href.startsWith('https://wa.me/905550000000?text='));
  }
});

test('tüm dahili bağlantılar ve varlık dosyaları mevcut', async () => {
  const routes = new Set(preview.pages.map(p => p.path));
  for (const page of preview.pages) {
    const doc = new JSDOM(page.html).window.document;
    for (const link of doc.querySelectorAll('a[href]')) {
      const href = link.getAttribute('href');
      if (href.startsWith('/')) assert.ok(routes.has(href), `${page.path} → ${href}`);
      if (href.startsWith('#')) assert.ok(doc.getElementById(href.slice(1)));
    }
    for (const img of doc.querySelectorAll('img[src]')) {
      assert.ok(img.hasAttribute('alt'));
      assert.ok(img.hasAttribute('width') && img.hasAttribute('height'));
      await access(path.join('public', img.getAttribute('src')));
    }
  }
});

test('geçersiz numara, bağlantı ve tekrar eden bölge içeriği reddedilir', () => {
  const invalid = structuredClone(fixture);
  invalid.phone = '0555 000 00 00';
  invalid.mapUrl = 'javascript:alert(1)';
  invalid.regions.push({ ...invalid.regions[0], name: 'Başka Bölge' });
  const errors = validateConfig(invalid, { production: true });
  assert.ok(errors.some(x => x.startsWith('phone:')));
  assert.ok(errors.some(x => x.startsWith('mapUrl:')));
  assert.ok(errors.some(x => x.includes('tekrar eden açıklamalar')));
});

test('menü, galeri filtresi, lightbox ve eksik iletişim penceresi çalışır', async () => {
  const page = preview.pages.find(p => p.path === '/galeri/');
  const dom = new JSDOM(page.html, { runScripts: 'outside-only', url: 'http://localhost:4321/galeri/' });
  const { window: w } = dom;
  w.matchMedia = () => ({ addEventListener() {} });
  w.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  w.HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
  w.eval(await readFile('src/main.js', 'utf8'));
  const d = w.document;
  const menu = d.querySelector('.menu-toggle');
  menu.click();
  assert.equal(menu.getAttribute('aria-expanded'), 'true');
  d.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape' }));
  assert.equal(menu.getAttribute('aria-expanded'), 'false');
  d.querySelector('[data-filter="Araç taşıma"]').click();
  assert.equal(d.querySelectorAll('[data-photo]:not([hidden])').length, 1);
  assert.equal(d.querySelector('#filter-status').textContent, '1 görsel gösteriliyor.');
  d.querySelector('[data-photo]:not([hidden])').click();
  assert.ok(d.querySelector('#lightbox').open);
  assert.ok(d.querySelector('#lightbox-image').alt.includes('temsili'));
  d.querySelector('#lightbox [data-close-dialog]').click();
  assert.ok(!d.querySelector('#lightbox').open);
  d.querySelector('[data-filter="all"]').click();
  assert.equal(d.querySelectorAll('[data-photo]:not([hidden])').length, 3);
  d.querySelector('[data-missing-contact]').click();
  assert.ok(d.querySelector('#contact-dialog').open);
  d.querySelector('#contact-dialog [data-close-dialog]').click();
  assert.ok(!d.querySelector('#contact-dialog').open);
  dom.window.close();
});
