import sharp from 'sharp';
import { mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
const source = path.resolve('assets/originals');
const output = path.resolve('public/images');
await mkdir(output, { recursive: true });
for (const filename of await readdir(source)) {
  if (!/\.(jpe?g|png|webp)$/i.test(filename)) continue;
  const name = path.parse(filename).name;
  const input = path.join(source, filename);
  await sharp(input).rotate().resize({ width: 1680, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(output, `${name}.webp`));
  await sharp(input).rotate().resize({ width: 1680, withoutEnlargement: true }).avif({ quality: 53, effort: 4 }).toFile(path.join(output, `${name}.avif`));
  // Mobil ana görsel ve galeri küçük görselleri için daha hafif kopya.
  await sharp(input).rotate().resize({ width: 850, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(output, `${name}-mobile.webp`));
  const info = await sharp(path.join(output, `${name}.webp`)).metadata();
  const size = await stat(path.join(output, `${name}.webp`));
  console.log(`${name}: ${info.width}×${info.height} WebP ${(size.size / 1024).toFixed(0)} KB + AVIF + mobil`);
}
