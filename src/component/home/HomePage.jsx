import Footer from "./footer";
import Header from "./Header";
import Categories from "./categories";
import ProductsSection from "./products";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative grid gap-10 overflow-hidden bg-linear-to-br from-violet-700 via-violet-500 to-indigo-500 px-6 py-14 text-white md:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] md:px-12 md:py-16">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[160%] w-1/2 rounded-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_70%)]" />

          <div className="relative z-10">
            <div className="mb-4 flex items-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-yellow-400 shadow-xl shadow-black/40">
                <img
                  src="/logo.jpeg"
                  alt=""
                  className="h-16 w-16 rounded-full object-cover"
                />
              </div>
            </div>
            <p className="mb-2 text-lg font-semibold text-white/90">
              bi mutluluk
            </p>
            <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
              Dakikalar içinde kapında
            </h1>
            <p className="max-w-md text-sm md:text-base text-white/90">
              Market, restoran, atıştırmalık — hepsi tek uygulamada.
              Bölgenizdeki en iyi işletmelerle çalışıyoruz.
            </p>
          </div>

          <div className="relative z-10 flex justify-end">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl shadow-black/30">
              <div className="mb-4 text-[17px] font-bold text-slate-900">
                Giriş yap veya kayıt ol
              </div>
              <form
                className="flex flex-col gap-3"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="grid grid-cols-[auto,minmax(0,1fr)] gap-2.5">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-100"
                  >
                    <span className="text-lg">🇹🇷</span>
                    <span>+90</span>
                  </button>
                  <input
                    type="tel"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-600 focus:bg-white focus:ring-2 focus:ring-violet-500/20"
                    placeholder="Telefon Numarası"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-1 inline-flex w-full items-center justify-center rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-slate-900 shadow-md shadow-yellow-400/40 transition hover:brightness-105 hover:shadow-lg"
                >
                  Telefon numarası ile devam et
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Categories */}
        <Categories />

        {/* Products */}
        <ProductsSection />

        {/* How it works */}
        <section
          id="how-it-works"
          className="bg-slate-50 px-6 pb-14 md:px-12 md:pb-16"
        >
          <h2 className="mb-8 text-center text-2xl font-extrabold text-slate-900">
            Nasıl Çalışır?
          </h2>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-700 to-indigo-500 text-lg font-bold text-white">
                1
              </span>
              <h3 className="mb-2 text-sm font-semibold text-slate-900">
                Adresini gir
              </h3>
              <p className="text-xs text-slate-500">
                Konumunu seç, yakındaki işletmeleri keşfet.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-700 to-indigo-500 text-lg font-bold text-white">
                2
              </span>
              <h3 className="mb-2 text-sm font-semibold text-slate-900">
                Ürünleri seç
              </h3>
              <p className="text-xs text-slate-500">
                Binlerce ürün arasından sepetini oluştur.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-700 to-indigo-500 text-lg font-bold text-white">
                3
              </span>
              <h3 className="mb-2 text-sm font-semibold text-slate-900">
                Siparişini takip et
              </h3>
              <p className="text-xs text-slate-500">
                Anlık takip ile siparişin dakikalar içinde kapında.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="px-6 pb-14 md:px-12 md:pb-16">
            <div className="mx-auto max-w-xl rounded-3xl bg-linear-to-br from-violet-700 to-indigo-500 px-8 py-10 text-center text-white shadow-2xl">
            <h2 className="mb-3 text-2xl font-extrabold">
              İş ortağımız olmak ister misin?
            </h2>
            <p className="mb-6 text-sm text-white/90">
              Restoranın, marketin veya kurye ekibin mi var? Getirgötür ile daha
              fazla müşteriye ulaş.
            </p>
            <button
              className="inline-flex items-center justify-center rounded-2xl border border-white/80 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white hover:text-violet-700"
              type="button"
            >
              Başvuru Yap
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
