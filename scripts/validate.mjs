import { existsSync } from 'node:fs';
import path from 'node:path';

export function validateConfig(c, { production = false, checkFiles = true } = {}) {
  const errors = [];
  const required = key => { if (!String(c[key] || '').trim()) errors.push(`${key}: doğrulanmış bilgi eklenmeli.`); };
  if (production) {
    if (!c.published) errors.push('published: işletme bilgileri doğrulandıktan sonra true yapın.');
    ['domain', 'phone', 'whatsapp', 'city', 'district', 'about'].forEach(required);
    if (!c.services.some(s => s.verified)) errors.push('En az bir hizmet doğrulanmalı.');
    if (!c.regions.some(r => r.verified)) errors.push('En az bir gerçek hizmet bölgesi açıklaması eklenmeli.');
  }
  if (Boolean(c.hoursLabel) !== Boolean(c.openingHours.length)) errors.push('Çalışma saatleri eklenecekse hoursLabel ve openingHours birlikte doldurulmalı.');
  if (c.domain) {
    try {
      const u = new URL(c.domain);
      if (u.protocol !== 'https:' || u.origin !== c.domain || /localhost|example\.|\.invalid$/.test(u.hostname)) throw new Error();
    } catch { errors.push('domain: gerçek HTTPS alan adı olmalı, sonunda / veya alt yol olmamalı.'); }
  }
  for (const key of ['phone', 'whatsapp']) if (c[key] && !/^\+[1-9]\d{7,14}$/.test(c[key])) errors.push(`${key}: boşluksuz uluslararası +ülke kodu biçimini kullanın.`);
  if (c.mapUrl) {
    try { if (new URL(c.mapUrl).protocol !== 'https:') throw new Error(); }
    catch { errors.push('mapUrl: geçerli HTTPS bağlantısı gerekli.'); }
  }
  const slugs = new Set();
  for (const s of c.services) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s.slug) || slugs.has(s.slug)) errors.push(`Geçersiz veya tekrar eden hizmet URL’si: ${s.slug}`);
    slugs.add(s.slug);
    if (s.verified && (!s.title || !s.short || !s.intro || !s.details?.length || !s.preparation)) errors.push(`${s.slug}: hizmet içeriği tamamlanmalı.`);
  }
  const descriptions = new Set();
  for (const r of c.regions.filter(r => r.verified)) {
    if (!r.name?.trim() || !r.description?.trim()) errors.push('Doğrulanan her bölgenin adı ve özgün açıklaması gerekli.');
    if (descriptions.has(r.description?.trim())) errors.push('Bölgeler için tekrar eden açıklamalar kullanmayın.');
    descriptions.add(r.description?.trim());
  }
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  for (const h of c.openingHours) {
    if (!h.days?.length || !h.days.every(d => days.includes(d)) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(h.opens) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(h.closes)) errors.push('openingHours: gün adlarını ve HH:MM saat biçimini kontrol edin.');
  }
  const assets = [c.hero.src, c.hero.avif, c.hero.mobile, c.logo, c.banner];
  if (!c.hero.alt) errors.push('Hero görseli için açıklayıcı alt metin ekleyin.');
  for (const p of c.gallery.filter(p => p.verified)) {
    if (!p.src || !p.alt || !p.title || !p.category || !Number.isInteger(p.width) || p.width <= 0 || !Number.isInteger(p.height) || p.height <= 0) errors.push('Galeri görsellerinde src, alt, title, category ve pozitif tam sayı width/height gerekli.');
    assets.push(p.src, p.avif);
  }
  for (const asset of assets.filter(Boolean)) {
    if (!asset.startsWith('/') || asset.includes('..') || asset.startsWith('//')) { errors.push(`Görsel yerel public/ dosyası olmalı: ${asset}`); continue; }
    if (checkFiles && !existsSync(path.resolve('public', `.${asset}`))) errors.push(`Görsel bulunamadı: public${asset}`);
  }
  return errors;
}
