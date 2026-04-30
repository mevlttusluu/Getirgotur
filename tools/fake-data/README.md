## Sahte veri üretimi (projeden bağımsız)

Bu klasör, öğretim elemanının istediği “sahte veri üretme sınıfı + DB’ye veri basma” görevini **uygulamanın normal akışına karıştırmadan** yapmak için eklendi.

### İçerik

- `FakeDataFactory.js`: Kendi yazdığımız, seed’li (tekrarlanabilir) sahte veri üretici sınıf.
- `seedFakeData.js`: Bu sınıfı kullanarak MongoDB’ye `User`, `Product`, `Order` sahte verileri basan script.

### Çalıştırma

Backend `.env` dosyanızda `MONGODB_URI` tanımlı olmalı.

```bash
cd tools/fake-data
npm install
node seedFakeData.js --seed "deneme-1" --users 20 --products 80 --orders 40
```

Var olan verileri silip yeniden basmak (dikkat):

```bash
cd tools/fake-data
node seedFakeData.js --clean --seed "temiz-bas" --users 20 --products 80 --orders 40
```

### Notlar

- Üretilen kullanıcıların şifresi seed script’te sabittir: `Password123!` (hash’lenip kaydedilir).
- `Product.id` benzersiz olacak şekilde mevcut en büyük `id` değerinin üstünden devam edilir.
- Script, uygulama çalışmasa bile DB’ye veri basabilir (sadece `MONGODB_URI` yeterli).

