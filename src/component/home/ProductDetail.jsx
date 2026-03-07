import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProducts } from "../../api/products";
import { useCart } from "../../context/CartContext";
import Header from "./Header";
import Footer from "./footer";

const TABS = ["Detaylar", "İçindekiler", "Kullanım", "Ek Bilgiler"];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Detaylar");
  const { addToCart } = useCart();

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        const data = await getProducts();
        if (!isMounted) return;

        const found = data.find(
          (item) => String(item.id) === String(id)
        );

        if (!found) {
          setError("Ürün bulunamadı.");
        } else {
          setProduct(found);
        }
      } catch (err) {
        if (isMounted) {
          setError("Ürün yüklenirken bir hata oluştu.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
        <Header />
        <main className="flex-1 px-6 py-10 md:px-12">
          <p className="text-sm text-slate-500">Ürün yükleniyor...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
        <Header />
        <main className="flex-1 px-6 py-10 md:px-12">
          <p className="mb-4 text-sm text-red-700">
            {error || "Ürün bulunamadı."}
          </p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-700 hover:shadow-md"
          >
            Geri Dön
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-1 px-4 py-8 md:px-12">
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)] items-start">
            {/* Sol: büyük görsel + küçük görseller */}
            <div>
              <div className="flex items-center justify-center rounded-3xl border border-slate-100 bg-slate-50 px-6 py-8">
                <div className="flex h-72 w-72 items-center justify-center overflow-hidden rounded-2xl bg-white">
                  {product.img ? (
                    <img
                      src={product.img}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-5xl font-extrabold text-slate-700">
                      !
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                  >
                    {product.img ? (
                      <img
                        src={product.img}
                        alt={product.name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="text-xl font-extrabold text-slate-700">
                        !
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sağ: başlık, fiyat, butonlar, sekmeler */}
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 md:text-3xl">
                    {product.name}
                  </h1>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {product.category}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold text-slate-400 hover:text-rose-500"
                >
                  ❤ Favorilere Ekle
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-2xl font-extrabold text-slate-900">
                  {product.price?.toLocaleString("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                    maximumFractionDigits: 2,
                  })}
                </p>
                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="inline-flex items-center rounded-full bg-violet-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 hover:shadow-md"
                >
                  Sepete Ekle
                </button>
              </div>

              <div className="mt-4 border-b border-slate-200 text-xs font-semibold text-slate-500">
                <nav className="flex gap-4">
                  {TABS.map((tab) => {
                    const isActive = tab === activeTab;
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`border-b-2 px-1 pb-3 ${
                          isActive
                            ? "border-violet-600 text-violet-700"
                            : "border-transparent hover:text-slate-700"
                        }`}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700 md:px-5 md:py-4">
                {activeTab === "Detaylar" && (
                  <p className="leading-relaxed">{product.description}</p>
                )}
                {activeTab === "İçindekiler" && (
                  <p className="leading-relaxed">
                    Bu alanı ürünün içerik bilgileri için kullanabilirsin.
                    Şu an için örnek metin gösteriliyor.
                  </p>
                )}
                {activeTab === "Kullanım" && (
                  <p className="leading-relaxed">
                    Ürünün nasıl kullanılacağına dair açıklamalar burada
                    yer alabilir.
                  </p>
                )}
                {activeTab === "Ek Bilgiler" && (
                  <p className="leading-relaxed">
                    Son kullanma tarihi, saklama koşulları ve diğer ek
                    bilgiler için bu alanı kullanabilirsin.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

