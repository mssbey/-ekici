# UYSAL OTO KURTARMA

Türkçe, mobil öncelikli, statik ve çok sayfalı site. Tarayıcıda framework veya üçüncü taraf takip kodu çalışmaz. HTML, fontlar, CSS, JavaScript ve optimize görseller yerel sunulur.

Hizmet alanı: **Toroslar başta olmak üzere tüm Mersin**. Telefon ve WhatsApp: **0534 222 49 83**.

## Vercel kurulumu

Vercel'de `mssbey/-ekici` deposunu içe aktarın; kök dizin proje kökü, dal `main` olmalı. `vercel.json` dosyası kurulumu `npm ci`, derlemeyi `npm run build`, çıktı klasörünü `dist` olarak ayarlar. Framework seçimi **Other**. Ayarlar ve güvenlik başlıkları [Vercel yapılandırma belgesine](https://vercel.com/docs/project-configuration/vercel-json) göre tanımlıdır.

Ana yayın adresi **https://www.mersinuysalotokurtarma.com/** olarak tanımlıdır. Normal ve production derlemeleri Google taramasına açık çıktı üretir; Vercel Preview ve Development ortamları `noindex` kalır. Farklı bir ana adres için `SITE_URL` ortam değişkenini kullanabilirsiniz. Search Console doğrulaması, site haritası gönderimi ve Google İşletme Profili adımları [SEO-YAYIN.md](SEO-YAYIN.md) dosyasındadır.

## Çalıştırma

Node.js 22 veya üstü:

```bash
npm install
npm run dev
```

Yerel adres: **http://localhost:4321**. Port değiştirmek için `npm run dev -- --port 3000`. İçerik/CSS değişikliklerinden sonra tarayıcıyı yenileyin; şablon veya ikon değişikliğinde sunucuyu yeniden başlatın.

```bash
npm test                 # İçerik, yayın kuralları ve etkileşim kontrolleri
npm run build            # dist/ içine ortam ayarlarına göre çıktı
npm run preview          # Yerel statik sunucu
npm run build:production # Zorunlu işletme bilgilerini kontrol ederek yayın çıktısı
npm run check:seo        # Yayındaki sayfaların ve eski alan adı yönlendirmelerinin kontrolü
```

## Bilgileri nereden değiştireceğim?

**`src/site.config.mjs`** tek işletme bilgi kaynağıdır:

| Alan | İçerik |
| --- | --- |
| `siteName`, `alternateNames` | Sitenin görünen adı ve gerçek marka varyantları. Ana sayfa, Open Graph ve WebSite verileri aynı site adını kullanır. |
| `phone`, `phoneDisplay`, `whatsapp` | Telefon ve WhatsApp. Bağlantı numaraları boşluksuz `+90…` biçiminde; görünen biçim ayrı tanımlanabilir. |
| `city`, `district`, `address`, `postalCode` | İl ve ilçe: Mersin / Toroslar. Açık adres ve varsa posta kodu ayrıca eklenir. |
| `hoursLabel`, `openingHours` | Görünen çalışma saatleri ve aynı saatlerin JSON-LD karşılığı. Günler İngilizce Schema.org adları, saatler `HH:MM`. |
| `domain`, `mapUrl` | `publicationSettings` ile belirlenen ana HTTPS alan adı ve varsa doğrulanmış harita bağlantısı. `SITE_URL` ana adresi değiştirebilir. |
| `about`, `logo`, `hero` | İşletme tanıtımı, isteğe bağlı logo, ana görsel ve alt metni. |
| `services` | Gerçekten sunulan hizmetler. Metinleri kontrol edip yalnızca doğrulananlar için `verified: true` yapın. |
| `regions` | Gerçek hizmet bölgeleri ve her biri için özgün açıklama. Otomatik mahalle sayfası üretilmez. |
| `gallery` | Gerçek fotoğraflar, açıklamaları, kategori, boyutlar ve doğrulama bilgisi. |

Hizmet açıklamaları aynı dosyadadır. Genel sayfa metinleri/SSS: `src/templates.mjs`; tasarım: `src/styles.css`; menü/filtre/galeri: `src/main.js`.

Güncel görsel düzenlemeler (ana görsel çerçevesi, kartlar, galeri ve mobil stiller) `src/refinements.css` içindedir. Derleme bu dosyayı temel stille birleştirerek tek CSS dosyası sunar.

## Fotoğraf ekleme

1. İzinli, gerçek işletme fotoğraflarını `assets/originals/` içine anlamlı bir adla koyun.
2. `npm run images` çalıştırın. `public/images/` içinde WebP ve AVIF kopyaları üretilir; EXIF bilgileri çıktıya taşınmaz.
3. `src/site.config.mjs` içindeki `gallery` listesine ekleyin:

```js
{
  src: '/images/is-01.webp',
  avif: '/images/is-01.avif',
  alt: 'Fotoğrafta gerçekten görülen araç, işlem ve ortamı açıklayın',
  title: 'Operasyonun gerçek kısa açıklaması',
  category: 'Araç taşıma',
  width: 1200, // images komutunun bildirdiği gerçek çıktı boyutu
  height: 800,
  verified: true,
}
```

Kategoriler otomatik oluşur. Galeri küçük görselleri lazy load edilir; tıklayınca büyür, Escape veya kapatma butonuyla kapanır. Logo için `public/images/` içine dosya ekleyip `logo` alanını doldurun.

Mevcut ana görsel **yapay zekâ ile üretilmiş temsili yer tutucudur**; gerçek operasyon olarak sunulmaz. Ana görseli değiştirmek için `assets/originals/hero.png` dosyasını yenileyin ve `npm run images` çalıştırın; config içindeki `alt` metnini güncelleyin. Yalnızca gerçek fotoğraf kullanıldığında `hero.representative: false` yapın. Font lisansı: `public/fonts/OFL.txt`.

## Yayın öncesi

- Gerçek il/ilçe, telefon, WhatsApp, alan adı ve işletme tanıtımını doldurun. Açık adres ve çalışma saatleri biliniyorsa ekleyin; bilinmeyen alanlar boş kalabilir.
- Sunulan hizmetleri onaylayın; sunulmayanları silin veya `verified: false` bırakın. En az bir doğrulanmış hizmet ve bölge gereklidir.
- Her bölgeye gerçekten o bölgeye ait açıklama yazın. Saat metniyle yapılandırılmış saatlerin aynı olduğunu kontrol edin.
- Gerçek fotoğrafları ekleyin veya temsili görsel etiketini koruyun. Boş galeri yayın sürümünde sahte operasyon fotoğrafı göstermez.
- `/gizlilik/` metnini seçilen barındırma sağlayıcısı ve gerçek veri süreçlerine göre tamamlayın.
- Ana adres tanımlandığında indeksleme otomatik açılır; `npm test` ve `npm run build:production` çalıştırın.
- **`dist/` klasörünü** statik barındırmaya yükleyin. HTTPS ve alan adını bağlayın. Klasör URL’lerini (`/hizmetler/`) destekleyin; bulunmayan sayfalar için `404.html` dosyasını gerçek HTTP 404 koduyla sunun. SPA yönlendirmesi kullanmayın.
- HTTPS alan adında telefon/WhatsApp bağlantılarını gerçek cihazda, galeri ve menüyü mobil/masaüstünde kontrol edin. Yayın URL’sinde Lighthouse/PageSpeed çalıştırın; Core Web Vitals sonuçları barındırma ve gerçek kullanım verisine bağlıdır.

**Önizleme ortamında** tüm sayfalar `noindex, nofollow`, robots kapalı, sitemap boştur. Alan adı yokken sahte canonical üretilmez. Eksik numaralar arama başlatmak yerine açıklama açar. Yayın için alan adı, telefon, WhatsApp, il/ilçe, tanıtım, en az bir doğrulanmış hizmet ve bölge gerekir. Açık adres ve saatlerin eksik olması indekslemeyi engellemez; saatler eklenirse metin ve yapılandırılmış veri birlikte doldurulmalıdır.

Yayın çıktısında her sayfada özgün başlık/açıklama, tek H1, mutlak canonical/OG URL ve iç sayfalarda breadcrumb bulunur. İşletme verisi açık adres yoksa Organization, adres varsa AutomotiveBusiness olarak üretilir; ana sayfada WebSite, hizmet detaylarında Service JSON-LD eklenir. Yorum, puan, 7/24 veya varış süresi uydurulmaz. `_headers` dosyası destekleyen sağlayıcılarda güvenlik/cache başlıklarını uygular; diğer sunucularda eşdeğer başlıkları ayarlayın.

## Görsel kaynağı

Özel logo: `public/images/logo.svg` amblemi başlıkta ve alt bölümde kullanılır; `public/favicon.svg` sekme simgesidir. Tam yatay logonun açık/koyu zemin sürümleri `public/images/uysal-logo-light.svg` ve `uysal-logo-dark.svg` dosyalarındadır. Aynı adlarla şeffaf PNG kopyaları da bulunur. SVG yazıları vektör eğrileridir; açan cihazda font kurulumu gerekmez. Kaynak font ve isteğe bağlı yeniden üretim aracı `assets/brand/` içindedir (Python + fontTools); normal site kurulumu bunlara ihtiyaç duymaz.

İki yeni banner yerleşik Imagegen ile üretildi: `public/images/uysal-mersin-banner.webp` ve `public/images/uysal-hizmet-banner.webp`. Orijinaller `assets/originals/`, tam istemler `assets/UYSAL-BANNER-PROMPTS.md` içindedir. Galeri, kullanıcının `public/görsell/` klasöründe sağladığı üç görselin optimize kopyalarını kullanır: `arac-tasima-gece`, `arac-tasima-gunduz` ve `cekici-tanitim`.
