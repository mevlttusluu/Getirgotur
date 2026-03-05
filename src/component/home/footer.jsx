import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 pb-8 pt-12 text-sm text-slate-600 md:px-12">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-3 font-semibold text-slate-900">
            <img
              src="/logo.jpeg"
              alt="Getirgötür"
              className="h-10 w-10 rounded-xl object-cover"
            />
            <span>Getirgötür</span>
          </div>
          <p className="mb-5 max-w-xs leading-relaxed">
            Dakikalar içinde kapında. Market, restoran ve daha fazlası tek
            uygulamada.
          </p>
          <div className="flex gap-3">
            <a
              href="#"
              className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-base transition hover:bg-violet-600 hover:text-white"
            >
              📘
            </a>
            <a
              href="#"
              className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-base transition hover:bg-violet-600 hover:text-white"
            >
              📸
            </a>
            <a
              href="#"
              className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-base transition hover:bg-violet-600 hover:text-white"
            >
              🐦
            </a>
            <a
              href="#"
              className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-base transition hover:bg-violet-600 hover:text-white"
            >
              🎥
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-900">
            Kurumsal
          </h4>
          <nav className="space-y-2">
            <a href="#" className="block transition hover:text-violet-600">
              Hakkımızda
            </a>
            <a href="#" className="block transition hover:text-violet-600">
              Kariyer
            </a>
            <a href="#" className="block transition hover:text-violet-600">
              Blog
            </a>
            <a href="#" className="block transition hover:text-violet-600">
              İletişim
            </a>
          </nav>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-900">Yardım</h4>
          <nav className="space-y-2">
            <a href="#" className="block transition hover:text-violet-600">
              Sık Sorulan Sorular
            </a>
            <a href="#" className="block transition hover:text-violet-600">
              Gizlilik Politikası
            </a>
            <a href="#" className="block transition hover:text-violet-600">
              Kullanım Şartları
            </a>
            <a href="#" className="block transition hover:text-violet-600">
              Çerez Politikası
            </a>
          </nav>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-900">
            İş Ortağı
          </h4>
          <nav className="space-y-2">
            <a href="#" className="block transition hover:text-violet-600">
              Restoran Ol
            </a>
            <a href="#" className="block transition hover:text-violet-600">
              Market Ol
            </a>
            <a href="#" className="block transition hover:text-violet-600">
              Kurye Ol
            </a>
          </nav>

          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 transition hover:border-slate-300 hover:bg-slate-100"
            >
               App Store
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 transition hover:border-slate-300 hover:bg-slate-100"
            >
              ▶ Google Play
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-4 text-xs text-slate-500 md:flex-row">
        <p>© 2026 Getirgötür. Tüm hakları saklıdır.</p>
        <div className="flex gap-4">
          <span>🔒 Güvenli Ödeme</span>
          <span>✔ 256bit SSL</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
