# Tanıtım Videosu Senaryosu

[Anlatım](./part_1.mp4)
[Anlatım](./part-2.mp4.)

Bu senaryo, ders gereksinimindeki _"projenin var olan bütün özellikleri"_.

## Hazırlık

1. Uygulamayı başlatın: `npm run dev:all`
2. Tarayıcıyı tam ekran yapın; gereksiz sekmeleri kapatın.
3. Ekran kaydı aracını açın (macOS: Cmd+Shift+5, Windows: Xbox Game Bar veya OBS).
4. İsteğe bağlı: mikrofonla kısa açıklamalar yapın.

## Senaryo Sırası

### Bölüm 1 — Giriş (30 sn)

- Proje adını söyleyin: **Getir Götür — Online Market Uygulaması**
- Kullanılan teknolojileri kısaca belirtin: React, Node.js, Express, MongoDB

### Bölüm 2 — Misafir Kullanıcı (3–4 dk)

1. Ana sayfayı gösterin (`http://localhost:5173`)
2. Kategori filtrelemesini deneyin
3. Sayfalama ile ilerleyin
4. Bir ürünün detay sayfasına girin
5. Sepete ürün ekleyin (miktar değiştirin)
6. Favorilere ekleyin
7. Sepet sayfasına gidin — ürünleri ve toplamı gösterin
8. Ödemeye geçin, teslimat bilgilerini doldurun
9. **Kapıda ödeme** ile sipariş verin
10. Sipariş onay sayfasını gösterin

### Bölüm 3 — Kayıtlı Kullanıcı (2–3 dk)

1. Yeni kullanıcı kaydı oluşturun (Kayıt Ol)
2. Çıkış yapıp tekrar giriş yapın
3. Kullanıcı paneline gidin (`/user-panel`)
4. Profil bilgilerini güncelleyin
5. Sipariş geçmişinde az önce verdiğiniz siparişi gösterin
6. İkinci bir sipariş verin — bu sefer **kredi kartı** (simülasyon) ile

### Bölüm 4 — Admin Paneli (3–4 dk)

1. Çıkış yapın
2. Admin ile giriş: `admin@gmail.com` / `admin123`
3. Admin paneline gidin (`/admin-panel`)
4. **Yeni ürün ekleyin** (ad, kategori, fiyat, stok, açıklama)
5. Eklenen ürünü ana sayfada bulun
6. Mevcut bir ürünü **düzenleyin**
7. Stok takibi bölümünü gösterin (kritik stok uyarıları)
8. Tüm siparişler tablosunu gösterin (az önce verilen siparişler görünmeli)
9. Kayıtlı kullanıcılar listesini gösterin
10. (Opsiyonel) Test amaçlı bir ürünü silin

### Bölüm 5 — Kapanış (30 sn)

- Veritabanının MongoDB'de çalıştığını, rollerin farklı yetkilere sahip olduğunu özetleyin
- Teşekkür edin

## Kontrol Listesi (videoda mutlaka görünmeli)

| Özellik                   | Gösterildi mi? |
| ------------------------- | -------------- |
| Ürün listeleme            | ☐              |
| Kategori filtreleme       | ☐              |
| Ürün detayı               | ☐              |
| Sepete ekleme             | ☐              |
| Favoriler                 | ☐              |
| Kapıda ödeme siparişi     | ☐              |
| Kredi kartı siparişi      | ☐              |
| Kayıt olma                | ☐              |
| Giriş yapma               | ☐              |
| Profil güncelleme         | ☐              |
| Sipariş geçmişi           | ☐              |
| Admin — ürün ekleme       | ☐              |
| Admin — ürün düzenleme    | ☐              |
| Admin — stok takibi       | ☐              |
| Admin — sipariş listesi   | ☐              |
| Admin — kullanıcı listesi | ☐              |

## İpuçları

- Her işlemden sonra kısa bir bekleme bırakın; izleyici takip edebilsin.
- Hata mesajı çıkarsa panik yapmayın; düzeltip devam edin veya kesip tekrar çekin.
- Admin paneline geçmeden önce normal kullanıcıdan çıkış yapmayı unutmayın.
