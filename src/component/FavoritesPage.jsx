import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";
import Header from "./home/Header";
import Footer from "./home/footer";

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();
  const { addToCart } = useCart();

  const hasItems = favorites.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-1 px-6 py-10 md:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Favorilerim
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
                Henüz favori ürünün yok
              </p>
              <p className="mb-5 text-xs text-slate-500">
                Ürünlerden kalp ikonuna tıklayarak favorilerine ekleyebilirsin.
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
            <div className="space-y-4">
              {favorites.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <Link
                    to={`/product/${item.id}`}
                    className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-slate-100"
                  >
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
                  </Link>

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
                    <button
                      type="button"
                      onClick={() => addToCart(item)}
                      className="inline-flex items-center rounded-full bg-violet-600 px-4 py-2 text-[11px] font-semibold text-white shadow-sm transition hover:bg-violet-700 hover:shadow-md"
                    >
                      Sepete Ekle
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFavorite(item.id)}
                      className="text-[11px] font-semibold text-rose-500 hover:text-rose-600"
                    >
                      Favorilerden kaldır
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

