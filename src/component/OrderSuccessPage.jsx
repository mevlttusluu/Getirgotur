import { Link, useLocation } from "react-router-dom";

export default function OrderSuccessPage() {
  const location = useLocation();
  const order = location.state?.order || null;

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
        <main className="flex-1 px-6 py-12">
          <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Sipariş bilgisi bulunamadı
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              Ana sayfaya dönerek tekrar sipariş verebilirsin.
            </p>
            <Link
              to="/page/1"
              className="mt-6 inline-flex items-center rounded-full bg-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-700 hover:shadow-md"
            >
              Ana sayfaya dön
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const paymentText =
    order.paymentMethod === "cash"
      ? "Kapıda ödeme"
      : order.paymentMethod === "card"
        ? `Kart ile ödeme (•••• ${order.paymentDetails?.last4 ?? "****"})`
        : "Ödeme";

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <main className="flex-1 px-6 py-10 md:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold">Siparişiniz Alındı</h1>
            <p className="mt-2 text-xs text-emerald-700 font-semibold">
              {paymentText}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-[minmax(0,1.6fr)_minmax(260px,1fr)]">
            <section className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Teslimat Bilgileri
                    </p>
                    <p className="mt-2 text-xs text-slate-600">
                      Sipariş ID:{" "}
                      <span className="font-semibold text-slate-900">
                        {order.orderId ?? "—"}
                      </span>
                    </p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 px-3 py-2">
                    <p className="text-xs font-bold text-emerald-700">Başarılı</p>
                    <p className="text-[11px] text-emerald-600">
                      Siparişiniz hazırlanıyor
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-[11px] font-semibold text-slate-500">
                      Ad Soyad
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {order.customer?.name ?? "—"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-[11px] font-semibold text-slate-500">
                      Telefon
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {order.customer?.phone ?? "—"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3 md:col-span-2">
                    <p className="text-[11px] font-semibold text-slate-500">
                      Adres
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {order.customer?.address ?? "—"}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      {order.customer?.email ?? ""}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <aside className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-3 text-sm font-bold text-slate-900">
                  Sipariş Özeti
                </h2>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Ürün Adedi</span>
                    <span className="font-semibold">{order.itemCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Toplam</span>
                    <span className="font-semibold">
                      {order.totalPrice.toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Gönderim Ücreti</span>
                    <span className="font-semibold text-emerald-600">
                      Ücretsiz
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                  <Link
                    to="/page/1"
                    className="inline-flex w-full items-center justify-center rounded-full bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-700 hover:shadow-md"
                  >
                    Alışverişe Devam Et
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

