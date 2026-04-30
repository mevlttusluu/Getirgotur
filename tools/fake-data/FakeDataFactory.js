export class FakeDataFactory {
  constructor({ seed = Date.now(), locale = "tr-TR" } = {}) {
    this.seed = typeof seed === "number" ? seed : FakeDataFactory.hashSeed(seed);
    this.locale = locale;
    this._rng = FakeDataFactory.mulberry32(this.seed);
    this._unique = new Map();
  }

  // --- Core RNG helpers ---
  static hashSeed(value) {
    const str = String(value ?? "");
    let h = 2166136261;
    for (let i = 0; i < str.length; i += 1) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  static mulberry32(seed) {
    let a = seed >>> 0;
    return function rng() {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  float(min = 0, max = 1) {
    return this._rng() * (max - min) + min;
  }

  int(min, max) {
    const lo = Math.ceil(min);
    const hi = Math.floor(max);
    return Math.floor(this.float(0, 1) * (hi - lo + 1)) + lo;
  }

  bool(pTrue = 0.5) {
    return this.float(0, 1) < pTrue;
  }

  pick(list) {
    if (!Array.isArray(list) || list.length === 0) return undefined;
    return list[this.int(0, list.length - 1)];
  }

  weightedPick(options) {
    // options: [{ value, weight }]
    const total = options.reduce((sum, o) => sum + (o.weight ?? 0), 0);
    if (total <= 0) return options[0]?.value;
    let r = this.float(0, total);
    for (const o of options) {
      r -= o.weight ?? 0;
      if (r <= 0) return o.value;
    }
    return options.at(-1)?.value;
  }

  unique(key, generatorFn, maxAttempts = 25) {
    const used = this._unique.get(key) ?? new Set();
    for (let i = 0; i < maxAttempts; i += 1) {
      const value = generatorFn();
      if (!used.has(value)) {
        used.add(value);
        this._unique.set(key, used);
        return value;
      }
    }
    throw new Error(`Failed to generate unique value for ${key}`);
  }

  // --- Text helpers ---
  lowerTr(value) {
    return String(value ?? "").trim().toLocaleLowerCase(this.locale);
  }

  slugifyTr(value) {
    const map = {
      ç: "c",
      ğ: "g",
      ı: "i",
      ö: "o",
      ş: "s",
      ü: "u",
    };
    return this.lowerTr(value)
      .split("")
      .map((ch) => map[ch] ?? ch)
      .join("")
      .replace(/[^a-z0-9]+/g, ".")
      .replace(/^\.+|\.+$/g, "")
      .replace(/\.+/g, ".");
  }

  // --- Person data ---
  firstName() {
    return this.pick([
      "Ahmet",
      "Mehmet",
      "Ayşe",
      "Fatma",
      "Elif",
      "Zeynep",
      "Mert",
      "Ece",
      "Can",
      "Deniz",
      "Kerem",
      "Buse",
      "Emir",
      "Yusuf",
      "Selin",
      "Seda",
      "Hakan",
      "İrem",
    ]);
  }

  lastName() {
    return this.pick([
      "Yılmaz",
      "Kaya",
      "Demir",
      "Şahin",
      "Çelik",
      "Yıldız",
      "Aydın",
      "Öztürk",
      "Arslan",
      "Doğan",
      "Kılıç",
      "Aslan",
      "Koç",
      "Kurt",
      "Özdemir",
      "Polat",
      "Aksoy",
      "Uçar",
    ]);
  }

  fullName() {
    return `${this.firstName()} ${this.lastName()}`;
  }

  phoneTR() {
    // Simple TR mobile-ish numbers: 05xx xxx xx xx
    const op = this.pick(["530", "531", "532", "533", "534", "535", "536", "537", "538", "539"]);
    const a = this.int(100, 999);
    const b = this.int(10, 99);
    const c = this.int(10, 99);
    return `0${op} ${a} ${b} ${c}`;
  }

  emailFromName(fullName) {
    const base = this.slugifyTr(fullName);
    const n = this.int(10, 999);
    const domain = this.pick(["example.com", "mail.test", "getirgotur.dev"]);
    return `${base}.${n}@${domain}`;
  }

  // --- Address data ---
  cityTR() {
    return this.pick(["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Konya", "Adana", "Gaziantep", "Kayseri", "Mersin"]);
  }

  districtTR() {
    return this.pick(["Kadıköy", "Üsküdar", "Beşiktaş", "Şişli", "Çankaya", "Keçiören", "Bornova", "Karşıyaka", "Nilüfer", "Muratpaşa"]);
  }

  streetTR() {
    return `${this.pick(["Atatürk", "Cumhuriyet", "İnönü", "Barış", "Gazi", "Fatih", "Şehitler", "Yunus Emre", "Mimar Sinan"])} ${this.pick(["Cd.", "Sk.", "Blv."])}`;
  }

  addressTR() {
    const no = this.int(1, 150);
    const apt = this.int(1, 50);
    const city = this.cityTR();
    const district = this.districtTR();
    const street = this.streetTR();
    return `${street} No:${no}, D:${apt}, ${district}/${city}`;
  }

  // --- Product data ---
  category() {
    return this.weightedPick([
      { value: "Elektronik", weight: 22 },
      { value: "Giyim", weight: 18 },
      { value: "Ayakkabı", weight: 12 },
      { value: "Aksesuar", weight: 10 },
      { value: "Ev & Yaşam", weight: 16 },
      { value: "Kişisel Bakım", weight: 12 },
      { value: "Ofis", weight: 6 },
      { value: "Oyun", weight: 4 },
    ]);
  }

  productName(category) {
    const cat = category ?? this.category();
    const adjectives = ["Premium", "Ultra", "Akıllı", "Şık", "Ergonomik", "Dayanıklı", "Hafif", "Kablosuz", "Klasik", "Modern"];
    const nounsByCategory = {
      Elektronik: ["Kulaklık", "Klavye", "Mouse", "Powerbank", "Akıllı Saat", "Bluetooth Hoparlör", "USB-C Kablo"],
      Giyim: ["Tişört", "Sweatshirt", "Ceket", "Pantolon", "Gömlek", "Mont"],
      Ayakkabı: ["Sneaker", "Koşu Ayakkabısı", "Bot", "Sandalet"],
      Aksesuar: ["Sırt Çantası", "Cüzdan", "Kemer", "Şapka", "Güneş Gözlüğü"],
      "Ev & Yaşam": ["Mum", "Nevresim", "Termos", "Kupa", "Dekoratif Yastık", "Saklama Kutusu"],
      "Kişisel Bakım": ["Şampuan", "Nemlendirici", "Diş Macunu", "Deodorant", "Yüz Temizleme Jeli"],
      Ofis: ["Ajanda", "Kalem Seti", "Masa Lambası", "Mouse Pad"],
      Oyun: ["Oyun Kolu", "Mouse Pad RGB", "Kulaklık Standı"],
    };
    const noun = this.pick(nounsByCategory[cat] ?? ["Ürün"]);
    const adj = this.pick(adjectives);
    const variant = this.pick(["S", "M", "L", "XL", "Pro", "Max", ""]);
    const maybeVariant = variant ? ` ${variant}` : "";
    return `${adj} ${noun}${maybeVariant}`.trim();
  }

  productPrice(category) {
    const cat = category ?? this.category();
    const ranges = {
      Elektronik: [399, 4999],
      Giyim: [199, 1499],
      Ayakkabı: [499, 2999],
      Aksesuar: [149, 1299],
      "Ev & Yaşam": [99, 1199],
      "Kişisel Bakım": [59, 699],
      Ofis: [49, 899],
      Oyun: [299, 3999],
    };
    const [min, max] = ranges[cat] ?? [99, 999];
    // Price endings like .90 / .99 (TRY style)
    const base = this.int(min, max);
    const ending = this.pick([0.9, 0.99, 0.5, 0.0]);
    return Math.round((base + ending) * 100) / 100;
  }

  productStock() {
    return this.weightedPick([
      { value: this.int(0, 5), weight: 10 },
      { value: this.int(6, 30), weight: 55 },
      { value: this.int(31, 120), weight: 30 },
      { value: this.int(121, 300), weight: 5 },
    ]);
  }

  productDescription(category) {
    const cat = category ?? this.category();
    const sentences = [
      "Günlük kullanım için idealdir.",
      "Kalite ve fiyat performans dengesiyle öne çıkar.",
      "Hızlı teslimat ve kolay iade avantajı sunar.",
      "Minimal tasarımıyla her ortamda uyum sağlar.",
      "Uzun ömürlü malzemelerle üretilmiştir.",
    ];
    const extras = {
      Elektronik: ["1 yıl garanti", "USB-C uyumlu", "Hızlı şarj destekli", "Bluetooth 5.3"],
      Giyim: ["Nefes alan kumaş", "Rahat kalıp", "Kolay ütülenir", "Dört mevsim kullanım"],
      Ayakkabı: ["Kaymaz taban", "Hafif yapı", "Gün boyu konfor", "Yastıklama teknolojisi"],
      Aksesuar: ["Suya dayanıklı", "Çok gözlü tasarım", "Dayanıklı fermuar", "Ayarlanabilir askı"],
      "Ev & Yaşam": ["Kolay temizlenir", "Şık dekor", "Isı yalıtımlı", "Dayanıklı seramik"],
      "Kişisel Bakım": ["Dermatolojik testli", "Hassas ciltlere uygun", "Doğal içerik", "Ferahlık hissi"],
      Ofis: ["Göz yormayan ışık", "Ergonomik tasarım", "Sessiz kullanım", "Kompakt boyut"],
      Oyun: ["Düşük gecikme", "RGB aydınlatma", "Kaydırmaz yüzey", "Uzun süreli kullanım"],
    };
    const extra = this.pick(extras[cat] ?? ["Harika bir seçenek"]);
    return `${this.pick(sentences)} ${extra}.`;
  }

  imageUrl(category) {
    const cat = category ?? "product";
    const slug = this.slugifyTr(cat || "urun");
    // Placeholder image URL (keeps seed script independent of assets)
    return `https://picsum.photos/seed/${slug}-${this.int(1, 9999)}/300/300`;
  }

  // --- Order data ---
  cardLast4() {
    return String(this.int(0, 9999)).padStart(4, "0");
  }

  orderId() {
    return this.unique("orderId", () => {
      const partA = this.int(100000, 999999);
      const partB = this.int(100000, 999999);
      return `GG-${partA}-${partB}`;
    });
  }
}

