import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { items, itemCount, totalPrice, removeFromCart, updateQuantity, clearCart } =
    useCart();

  const hasItems = items.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <main className="flex-1 px-6 py-10 md:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Sepetim
            </h1>
            <Link
              to="/page/1"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Alışverişe Devam Et
            </Link>
          </div>

          {!hasItems && (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="mb-3 text-sm font-semibold text-slate-900">
                Sepetin şu anda boş
              </p>
              <p className="mb-5 text-xs text-slate-500">
                Ürünlere göz at ve sepetine eklemeye başla.
              </p>
              <Link
                to="/page/1"
                className="inline-flex items-center rounded-full bg-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-700 hover:shadow-md"
              >
                Ürünleri Gör
              </Link>
            </div>
          )}

          {hasItems && (
            <div className="grid gap-6 md:grid-cols-[minmax(0,1.7fr)_minmax(260px,1fr)]">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                      {item.img ? (
                        <img
                          src={item.img}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-extrabold text-slate-700">
                          !
                        </span>
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                        {item.category}
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {item.name}
                      </p>
                      <p className="text-xs font-medium text-slate-700">
                        {item.price?.toLocaleString("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-1 py-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-slate-700 hover:bg-slate-200"
                        >
                          -
                        </button>
                        <span className="min-w-[2rem] text-center text-xs font-semibold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-slate-700 hover:bg-slate-200"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-[11px] font-semibold text-red-500 hover:text-red-600"
                      >
                        Kaldır
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="mb-3 text-sm font-bold text-slate-900">
                    Sipariş Özeti
                  </h2>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>Ürün Adedi</span>
                      <span className="font-semibold">{itemCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Ara Toplam</span>
                      <span className="font-semibold">
                        {totalPrice.toLocaleString("tr-TR", {
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
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-xs font-semibold text-slate-900">
                      Toplam
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      {totalPrice.toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={!hasItems}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                  >
                    Siparişi Tamamla
                  </button>
                  {hasItems && (
                    <button
                      type="button"
                      onClick={clearCart}
                      className="mt-2 w-full text-[11px] font-semibold text-slate-500 hover:text-slate-700"
                    >
                      Sepeti Temizle
                    </button>
                  )}
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

