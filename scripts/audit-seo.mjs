import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import config from '../src/site.config.mjs';

const origin = config.domain;
assert.ok(origin, 'Ana yayın adresi gerekli.');
const agent = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
async function read(url) {
  const response = await fetch(url, { headers: { 'User-Agent': agent }, signal: AbortSignal.timeout(25000) });
  assert.equal(response.status, 200, `${url}: HTTP ${response.status}`);
  assert.ok(!/noindex|none/i.test(response.headers.get('x-robots-tag') || ''), `${url}: engelleyici HTTP başlığı`);
  return { response, text: await response.text() };
}
const robots = await read(`${origin}/robots.txt`);
assert.ok(robots.text.includes('Allow: /'));
assert.ok(!/^Disallow:\s*\/\s*$/m.test(robots.text));
assert.ok(robots.text.includes(`Sitemap: ${origin}/sitemap.xml`));
const sitemap = new JSDOM((await read(`${origin}/sitemap.xml`)).text, { contentType: 'text/xml' }).window.document;
const urls = [...sitemap.querySelectorAll('url > loc')].map(loc => loc.textContent);
assert.ok(urls.includes(`${origin}/`));
assert.ok(urls.includes(`${origin}/hizmetler/cekici/`));
assert.ok(urls.includes(`${origin}/hizmetler/oto-kurtarma/`));
assert.equal(new Set(urls).size, urls.length);
const titles = new Set();
const descriptions = new Set();
await Promise.all(urls.map(async url => {
  assert.equal(new URL(url).origin, origin, `Yanlış site adresi: ${url}`);
  const { response, text } = await read(url);
  assert.equal(response.url, url, `${url}: sitemap adresi başka sayfaya yönleniyor`);
  const doc = new JSDOM(text).window.document;
  assert.equal(doc.documentElement.lang, 'tr');
  assert.equal(doc.querySelectorAll('h1').length, 1, url);
  assert.equal(doc.querySelector('meta[name="robots"]')?.content, 'index, follow', url);
  assert.equal(doc.querySelector('link[rel="canonical"]')?.href, url, url);
  assert.ok(doc.title && !titles.has(doc.title), `${url}: boş veya aynı başlık`);
  titles.add(doc.title);
  const description = doc.querySelector('meta[name="description"]')?.content;
  assert.ok(description && !descriptions.has(description), `${url}: boş veya aynı açıklama`);
  descriptions.add(description);
  const schemas = JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent);
  assert.equal(schemas[0].telephone, config.phone, url);
  if (url === `${origin}/`) {
    assert.ok(doc.title.includes(config.siteName));
    assert.ok(doc.body.textContent.includes('Mersin Uysal Çekici'));
    assert.equal(schemas.find(s => s['@type'] === 'WebSite').name, config.siteName);
  }
}));
for (const host of ['mersinuysalotokurtarma.com', 'uysalotokurtarma.mssbeys.xyz', 'ekici.vercel.app']) {
  const response = await fetch(`https://${host}/hizmetler/cekici/?kaynak=seo-kontrol`, { redirect: 'manual', signal: AbortSignal.timeout(25000) });
  assert.ok([301, 308].includes(response.status), `${host}: kalıcı yönlendirme yok, HTTP ${response.status}`);
  assert.equal(response.headers.get('location'), `${origin}/hizmetler/cekici/?kaynak=seo-kontrol`, host);
}
console.log(`${urls.length} canlı sayfa: tarama izni, canonical, marka, telefon, benzersiz meta ve eski alan adı yönlendirmeleri doğrulandı.`);
console.log('Bu kontrol HTTP yanıtlarını doğrular; Google dizinine eklenmiş olmayı veya sıralamayı ölçmez.');
