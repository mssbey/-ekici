# Uysal Oto Kurtarma — Google görünürlüğü

Ana adres: **https://www.mersinuysalotokurtarma.com/**

## Hazırlanan site düzenlemeleri

- Yayın adresi için `index, follow`; `robots.txt` taramaya açık.
- `https://www.mersinuysalotokurtarma.com/sitemap.xml` tüm site sayfalarını listeler.
- Her sayfada bu alan adını kullanan canonical ve sosyal paylaşım adresleri.
- Marka, Mersin, Toroslar, oto kurtarma ve çekici hizmetini açıklayan başlıklar.
- Oto kurtarma ve çekici için ayrı, bağlantı verilen hizmet sayfaları.
- `Organization`, `WebSite`, `Service` ve içerik yolu yapılandırılmış verileri.
- Açık adres ve saat bilgisi bilinmediği için eklenmedi. Adres doğrulandığında işletme şeması otomatik `AutomotiveBusiness` olur.
- Vercel Preview ve development çıktıları `noindex` kalır.

## Yayına alma

1. `npm test` ve `npm run build:production` çalıştırın.
2. Değişiklikleri Vercel'e bağlı Git deposuna gönderin veya `dist/` çıktısını yayınlayın.
3. Ana sayfanın HTML kaynağında `<meta name="robots" content="index, follow">` bulunduğunu kontrol edin.
4. `/robots.txt` içinde `Allow: /` ve doğru sitemap adresini kontrol edin.
5. `/sitemap.xml` dosyasında ana adresi ve iki hizmet sayfasını kontrol edin.

Vercel'de ana alan adı `www.mersinuysalotokurtarma.com` olmalı; www olmadan gelen trafik bu adrese yönlendirilmeli. Bu yönlendirme inceleme sırasında çalışıyordu.

## Google Search Console

1. [Search Console](https://search.google.com/search-console/) hesabınıza girin.
2. `mersinuysalotokurtarma.com` için **Alan adı** mülkü oluşturup Google'ın verdiği TXT kaydını alan adının DNS ayarlarına ekleyin. Doğrulama alan adını yöneten hesapla yapılır.
3. Alternatif olarak **URL ön eki** mülkünde `https://www.mersinuysalotokurtarma.com/` adresini ekleyin. HTML etiketi yöntemindeki yalnızca `content` değerini Vercel'de `GOOGLE_SITE_VERIFICATION` ortam değişkenine yazıp yeniden yayınlayın; site bu etiketi üretir.
4. **Site Haritaları** bölümüne `https://www.mersinuysalotokurtarma.com/sitemap.xml` gönderin.
5. **URL Denetimi** ile ana sayfayı, `/hizmetler/oto-kurtarma/` ve `/hizmetler/cekici/` sayfalarını kontrol edip dizine eklenmesini isteyin.

Tarama ve arama sonucuna eklenme Google'ın kararına bağlıdır; anında görünme veya belirli bir sıra garantisi yoktur. [Google'ın tarama isteği açıklaması](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl?hl=tr).

## Mersin ve Google Haritalar

[Google İşletme Profili](https://business.google.com/) kaydını oluşturun veya mevcut kaydı sahiplenip doğrulayın. Aynı işletme için ikinci bir kayıt açmayın.

- Ad: **Uysal Oto Kurtarma**; gerçek işletme adına ek anahtar kelimeler eklemeyin.
- Telefon: **0534 222 49 83**.
- Web sitesi: **https://www.mersinuysalotokurtarma.com/**.
- İşletmeyi gerçekten tanımlayan çekici kategorisini seçin.
- Toroslar ve Mersin'de gerçekten hizmet verilen alanları tanımlayın.
- Gerçek çalışma saatlerini girin. Müşteri kabul edilen iş yeri varsa doğru adresi kullanın; yalnızca müşteriye gidiliyorsa hizmet bölgesi işletmesi ayarlarını kullanın.
- İşletmeye ait gerçek araç ve çalışma fotoğrafları ekleyin; gerçek müşterilerinizden deneyimlerine ilişkin yorum isteyin ve yorumlara yanıt verin.

Doğrulanan Haritalar bağlantısını `src/site.config.mjs` içindeki `mapUrl` alanına ekleyin. Site ve işletme profilindeki telefon, ad, saatler ve adres aynı olmalı.

Google yerel sıralamada alaka düzeyi, mesafe ve bilinirliği değerlendirir; profilin tamamlanması ve yorumlar görünürlüğe yardımcı olabilir. [Google'ın yerel sıralama açıklaması](https://support.google.com/business/answer/7091?hl=tr).
