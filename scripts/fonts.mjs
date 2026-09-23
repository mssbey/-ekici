// İsteğe bağlı yenileme aracı. Fontlar public/fonts/ içinde yerel olarak sunulur.
import { mkdir, writeFile } from 'node:fs/promises';
const response = await fetch('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap', { headers: { 'User-Agent': 'Mozilla/5.0 AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36' } });
if (!response.ok) throw new Error('Font CSS indirilemedi.');
const css = await response.text();
await mkdir('public/fonts', { recursive: true });
for (const subset of ['latin', 'latin-ext']) {
  const block = css.split(`/* ${subset} */`)[1]?.split('}')[0];
  const url = block?.match(/url\(([^)]+)\)/)?.[1];
  if (!url) throw new Error(`${subset} fontu bulunamadı.`);
  const file = await fetch(url);
  if (!file.ok) throw new Error(`${subset} fontu indirilemedi.`);
  await writeFile(`public/fonts/manrope-${subset}.woff2`, Buffer.from(await file.arrayBuffer()));
  console.log(`${subset} fontu hazır.`);
}
const license = await fetch('https://raw.githubusercontent.com/google/fonts/main/ofl/manrope/OFL.txt');
if (!license.ok) throw new Error('Font lisansı indirilemedi.');
await writeFile('public/fonts/OFL.txt', await license.text());
