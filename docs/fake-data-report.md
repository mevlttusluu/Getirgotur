## Sahte veri (fake data) üretme kütüphaneleri ve çalışma prensipleri

Bu bölüm, test/ geliştirme sırasında gerçek kullanıcı verisi kullanmadan; **anlamlı, tutarlı ve tekrarlanabilir** (seed’li) sahte veri üretmenin neden gerekli olduğunu ve yaygın kütüphanelerin nasıl çalıştığını özetler.

### 1 Yaygın kütüphaneler

- **Faker (JavaScript/Node)**: `@faker-js/faker` pek çok kategori için (kişi, adres, ticaret, tarih vb.) gerçekçi veri üretir ve çok sayıda locale desteği sağlar. Kaynak/dokümantasyon: `https://fakerjs.dev/`, `https://github.com/faker-js/faker`.
- **Chance.js (JavaScript)**: Minimal bir random helper’dır; string/number gibi temel üretimlerin yanında isim, adres gibi alanlar da üretebilir. PRNG tabanlı olduğu için seed ile tekrarlanabilir veri üretimi hedeflenebilir. Kaynak: `https://chancejs.com/`, `https://github.com/chancejs/chancejs`.
- **Mockaroo (No-code + API)**: CSV/JSON/SQL gibi formatlarda dataset üretir; ayrıca “mock API” gibi kullanılabilir. Kaynak: `https://www.mockaroo.com/`.

Diğer örnekler (genel bilgi): Python dünyasında `faker` paketi, Java’da “Java Faker” gibi kütüphaneler benzer yaklaşımla alan bazlı üreticiler sunar.

### 2 Çalışma prensibi (genel yaklaşım)

Fake data kütüphanelerinin çoğu aşağıdaki bileşenleri birleştirir:

- **Pseudo-Random Number Generator (PRNG)**: Üretimin temeli rastgele sayılardır. “Seed” verilirse aynı seed ile **aynı veri** tekrar üretilebilir (tekrarlanabilir test).
- **Alan üreticileri (generators)**: `name()`, `email()`, `address()` gibi fonksiyonlar; veri alanına özgü kurallarla (format, uzunluk, locale) üretim yapar.
- **Şablonlama ve kompozisyon**: Basit alanlar birleşerek daha anlamlı kayıtlar oluşturur (ör. ad + soyad → e‑posta).
- **Kısıtlar ve dağılımlar**:
  - Aralık kısıtları: fiyat \(>=0\), stok \(>=0\) gibi.
  - Dağılım: bazı kategorilerin daha sık gelmesi (weighted random).
  - Benzersizlik: `email` veya `product.id` gibi unique alanlarda tekrarların önlenmesi.
- **Tutarlılık / ilişkisel bütünlük**:
  - Sipariş kalemleri ürünlerle eşleşmeli,
  - toplam fiyat kalemlerden hesaplanmalı,
  - user–order ilişkisi doğru kurulmalı.

### 3 Bu proje için “kendi yazdığımız” sahte veri sınıfı

Bu projede (Node.js + MongoDB/Mongoose) sahte veri üretimi için **dış kütüphane kullanmadan** kendi sınıfımız yazıldı:

- **Sınıf adı**: `FakeDataFactory`
- **Konum**: `tools/fake-data/FakeDataFactory.js`
- **Amaç**: Locale’a (TR) uygun, anlamlı ve seed’li sahte veri üretmek; ardından DB koleksiyonlarına toplu ekleme yapmak.

#### Özellikler

- **Seed’li üretim**: Aynı seed ile aynı üretim akışı (tekrarlanabilirlik).
- **Weighted seçim**: Kategori dağılımı ve sipariş ürün adedi gibi alanlarda gerçekçiliği artırır.
- **Unique üretim**: `email`, `orderId`, `productName` gibi alanlarda tekrarları engeller.
- **TR’ye uygun metin işlemleri**: Türkçe küçük harf/slug dönüşümleri.
- **Anlamlı kompozisyon**:
  - Kullanıcı: ad/soyad → e‑posta,
  - Ürün: kategori → isim/fiyat/ açıklama,
  - Sipariş: kalemlerden `itemCount` ve `totalPrice` hesaplama.

### 4 Kullanım kılavuzu (DB’ye sahte veri ekleme)

Script:

- **Konum**: `tools/fake-data/seedFakeData.js`
- **Ne yapar**: `User`, `Product`, `Order` koleksiyonlarına sahte veri ekler.
- **Gereksinim**: `backend/.env` dosyasında `MONGODB_URI`.

Örnek çalıştırma:

```bash
node tools/fake-data/seedFakeData.js --seed "deneme-1" --users 20 --products 80 --orders 40
```

Temizle + yeniden bas (dikkat):

```bash
node tools/fake-data/seedFakeData.js --clean --seed "temiz-bas" --users 20 --products 80 --orders 40
```

> Not: Bu görev “projeye karışmasın” diye `tools/` altında tutulmuştur; uygulamanın runtime akışına eklenmemiştir. İstenirse script ayrı olarak çalıştırılır.
