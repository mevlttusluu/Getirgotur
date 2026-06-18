# Teslim Arşivi Hazırlık Kontrol Listesi

Video ve GitHub'u siz halledeceksiniz; aşağıdaki maddelerin arşivde (ZIP) yer aldığından emin olun.

## Arşivde Olması Gerekenler

- [ ] **Kaynak kodlar** — Tüm proje klasörü (`Getirgotur/`)
- [ ] **Proje raporu** — `teslim/PROJE_RAPORU.md` (Word/PDF'e dönüştürülmüş hali de eklenebilir)
- [ ] **Veritabanı yedeği** — `teslim/veritabani_yedegi/` klasörü
- [ ] **Tanıtım videosu** — `.mp4` veya `.mov` (siz çekeceksiniz)

## Raporu Word/PDF'e Çevirme

1. `teslim/PROJE_RAPORU.md` dosyasını VS Code veya bir Markdown editöründe açın.
2. İçeriği kopyalayıp Word'e yapıştırın **veya** Pandoc kullanın:

```bash
# Pandoc yüklüyse:
pandoc teslim/PROJE_RAPORU.md -o teslim/PROJE_RAPORU.docx
```

3. Word'de mermaid diyagramları görünmezse:
   - [mermaid.live](https://mermaid.live) sitesinde diyagramları PNG olarak dışa aktarın
   - Raporun 5. ve 6. bölümlerine görselleri ekleyin
   - Alternatif: projedeki mevcut görselleri kullanın (`veri_tabanı.png`, `kullanım_kılavuzu/GETİRGÖTÜR.png`)

## ZIP Oluşturma (macOS)

```bash
cd /Users/a1/Desktop
zip -r Getirgotur_TESLIM.zip Getirgotur \
  -x "Getirgotur/node_modules/*" \
  -x "Getirgotur/backend/node_modules/*" \
  -x "Getirgotur/tools/*/node_modules/*" \
  -x "Getirgotur/.git/*"
```

> `node_modules` klasörlerini ZIP'e dahil etmeyin; alıcı `npm install` ile yükleyecektir.

## Son Kontrol

Alıcı bilgisayarda şu adımların çalıştığını doğrulayın:

1. `npm install` + `npm --prefix backend install`
2. `cp backend/.env.example backend/.env` ve MongoDB URI ayarı
3. `cd tools/db-backup && npm install && node importDb.js --clean`
4. `npm run dev:all`
5. http://localhost:5173 açılıyor mu?
6. Admin girişi çalışıyor mu? (`admin@gmail.com` / `admin123`)
