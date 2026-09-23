// TÜM İŞLETME BİLGİLERİNİ BU DOSYADAN DÜZENLEYİN.
// Boş alanlara tahminî bilgi yazmayın. README.md dosyasındaki yayın adımlarını izleyin.
export default {
  name: 'UYSAL OTO KURTARMA',
  published: false,
  domain: '', // https://alanadiniz.com — sonunda / olmadan
  phone: '+905342224983', // Uluslararası biçim: +90 ve 10 haneli numara
  phoneDisplay: '0534 222 49 83', // İsteğe bağlı, okunabilir gösterim
  whatsapp: '+905342224983', // Uluslararası biçim: +90 ve 10 haneli numara
  city: 'Mersin',
  district: 'Toroslar',
  serviceArea: 'Toroslar başta olmak üzere tüm Mersin',
  banner: '/images/uysal-hizmet-banner.webp',
  address: '',
  postalCode: '',
  mapUrl: '', // Doğrulanmış Google Haritalar bağlantısı
  hoursLabel: '', // Yalnızca doğrulanmış çalışma saatleri
  openingHours: [], // Örnek biçim: { days: ['Monday'], opens: '09:00', closes: '18:00' }
  logo: '/images/logo.svg', // Özel çekici amblemi. Boşsa tipografik marka kullanılır.
  hero: {
    src: '/images/uysal-mersin-banner.webp',
    avif: '/images/uysal-mersin-banner.avif',
    mobile: '/images/uysal-mersin-banner-mobile.webp',
    alt: 'Akdeniz sahilinde sarı çekiciyle araç taşıma; yapay zekâ ile oluşturulmuş temsili banner',
    width: 1672,
    height: 941,
    representative: true,
  },
  // Ana sayfadaki vitrin bölümü ve Hakkımızda sayfası görselleri.
  showcase: {
    src: '/images/cekici-tanitim.webp',
    avif: '/images/cekici-tanitim.avif',
    alt: 'Işıklarla donatılmış turuncu çekici, gün batımında sahil yolunda kasasında beyaz bir otomobille',
    width: 1661,
    height: 947,
  },
  aboutImage: {
    src: '/images/arac-tasima-gece.webp',
    avif: '/images/arac-tasima-gece.avif',
    alt: 'Farları ve kasa ışıkları yanan çekici, gece yolda otomobil taşıyor',
    width: 1680,
    height: 756,
  },
  about: 'UYSAL OTO KURTARMA olarak Mersin Toroslar başta olmak üzere tüm Mersin’de oto kurtarma ve çekici hizmeti sunuyoruz. Konumunuzu ve aracınızın durumunu dinliyor, taşıma sürecini sizinle birlikte planlıyoruz. Hizmet kapsamını, varış noktasını ve ücreti işlem öncesinde netleştiriyoruz. Bize 0534 222 49 83 numarasından ulaşabilirsiniz.', // İşletmenin geçmişi ve yaklaşımı hakkında doğrulanmış metin
  services: [
    {
      slug: 'oto-kurtarma', title: 'Oto kurtarma', icon: 'truck', verified: false,
      short: 'Hareket edemeyen aracınız için konuma ve araç durumuna uygun kurtarma planı.',
      intro: 'Yolda kalan bir araç için ilk adım, bulunduğu konumu ve aracın durumunu netleştirmektir. Oto kurtarma talebinizde aracın marka ve modelini, tekerleklerin durumunu ve ulaşılabilecek güvenli noktayı paylaşın.',
      details: ['Araç bulunduğu yerden hareket edemiyorsa konum ve erişim koşulları birlikte değerlendirilir.', 'Gerekli ekipman ve araç uygunluğu, paylaşılan bilgiler üzerinden görüşülür.', 'Kurtarma yöntemi ve aracın götürüleceği nokta işlem öncesinde netleştirilir.'],
      preparation: 'Konumunuzu, araç modelini ve mümkünse aracın bulunduğu alanın fotoğrafını hazırlayın.'
    },
    {
      slug: 'cekici', title: 'Çekici hizmeti', icon: 'tow', verified: false,
      short: 'Aracınızın bulunduğu noktadan belirlediğiniz varış noktasına taşınması.',
      intro: 'Çekici ihtiyacında aracın alınacağı ve bırakılacağı noktalar taşımanın planını belirler. Aracınızın çalışır durumda olup olmadığını ve varsa taşıma sırasında dikkat edilmesi gereken özelliklerini iletişim sırasında belirtin.',
      details: ['Alış ve teslim noktaları, mesafe ve yol erişimi açısından değerlendirilir.', 'Aracın ölçüleri, yerden yüksekliği ve hareket durumu taşıma aracının seçimini etkiler.', 'Taşıma kapsamı ve ücret, işlem öncesinde görüşülerek netleştirilir.'],
      preparation: 'Alış ve varış adreslerini, araç türünü ve aracın yürür durumda olup olmadığını paylaşın.'
    },
    {
      slug: 'yol-yardim', title: 'Yol yardım', icon: 'tool', verified: false,
      short: 'Yolda karşılaştığınız sorun için ihtiyacınızı birlikte değerlendirelim.',
      intro: 'Yol yardım talebinde yaşadığınız sorunu açıkça anlatmanız, uygun desteğin belirlenmesine yardımcı olur. Aracın verdiği uyarıları ve sorunun ne zaman başladığını paylaşın. Yerinde müdahale kapsamı ve uygunluk önceden teyit edilir.',
      details: ['Aracın belirtileri ve bulunduğu yer hakkında bilgi alınır.', 'Yerinde destek verilip verilemeyeceği hizmet kapsamına göre değerlendirilir.', 'Taşıma gerekiyorsa seçenekler ve teslim noktası sizinle görüşülür.'],
      preparation: 'Gösterge panelindeki uyarıları ve aracınızın mevcut durumunu bildirin. Destek kapsamını telefonla teyit edin.'
    },
    {
      slug: 'arac-tasima', title: 'Araç taşıma', icon: 'car', verified: false,
      short: 'Arıza veya kaza sonrasında, aracınızın durumuna göre planlanan taşıma.',
      intro: 'Arıza veya kaza sonrası taşımalarda aracın hasar durumu ve güvenli yükleme koşulları önemlidir. Araçtaki hasarı, hareketi engelleyen parçaları ve teslim edilecek servis ya da otopark bilgisini önceden paylaşın.',
      details: ['Hasar ve aracın hareket durumu, yükleme gereksinimlerini belirler.', 'Bulunulan noktadaki erişim ve teslim yerinin kabul koşulları görüşülür.', 'Taşıma uygunluğu ve kapsamı, araçla ilgili bilgiler değerlendirildikten sonra teyit edilir.'],
      preparation: 'Hasarın genel durumunu ve teslim noktasını paylaşın. Acil tehlike veya yaralanma durumunda önce 112’yi arayın.'
    }
  ],
  // Yalnızca gerçekten hizmet verilen yerleri ekleyin. Her açıklama bölgeye özgü olmalı.
  regions: [
    { name: 'Mersin Toroslar', description: 'Toroslar’ın mahallelerinde ve ana ulaşım güzergâhlarında oto kurtarma ve çekici ihtiyaçlarınız için yanınızdayız. Bulunduğunuz caddeyi, konumunuzu ve aracınızın durumunu paylaşmanız yeterli.', verified: true },
    { name: 'Tüm Mersin', description: 'Mersin genelinde, merkez ilçelerden diğer ilçelere kadar hizmet veriyoruz. Aracınızın alınacağı ve teslim edileceği noktaları iletin; mesafeye ve yol koşullarına göre taşıma planını birlikte oluşturalım.', verified: true },
  ], // { name: '...', description: '...', verified: true }
  // Gerçek fotoğrafları public/images/ içine koyun. Örnek kayıt:
  // { src: '/images/is-01.webp', avif: '/images/is-01.avif', alt: '...',
  //   title: '...', category: 'Oto kurtarma', width: 1200, height: 800, verified: true }
  gallery: [
    { src: '/images/arac-tasima-gece.webp', avif: '/images/arac-tasima-gece.avif', thumb: '/images/arac-tasima-gece-mobile.webp', alt: 'Farları ve kasa ışıkları yanan çekici, gece yolda otomobil taşıyor', title: 'Gece araç taşıma', category: 'Araç taşıma', width: 1680, height: 756, verified: true },
    { src: '/images/arac-tasima-gunduz.webp', avif: '/images/arac-tasima-gunduz.avif', thumb: '/images/arac-tasima-gunduz-mobile.webp', alt: 'Sarı kayar kasalı çekici, üzerinde beyaz bir otomobili gündüz vakti yolda taşıyor', title: 'Gündüz araç taşıma', category: 'Araç taşıma', width: 1680, height: 756, verified: true },
    { src: '/images/cekici-tanitim.webp', avif: '/images/cekici-tanitim.avif', thumb: '/images/cekici-tanitim-mobile.webp', alt: 'Işıklarla donatılmış turuncu çekici, gün batımında sahil yolunda kasasında beyaz bir otomobille', title: 'Çekicimiz', category: 'Tanıtım', width: 1661, height: 947, verified: true },
  ],
};
