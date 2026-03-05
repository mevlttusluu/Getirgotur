import { useEffect, useState } from "react";
import { getProducts } from "../../api/products";

export default function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        if (isMounted) {
          setProducts(data);
        }
      } catch (err) {
        if (isMounted) {
          setError("Ürünler yüklenirken bir hata oluştu.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="bg-slate-50 px-6 pb-12 pt-8 md:px-12">
        <h2 className="mb-4 text-lg font-extrabold text-slate-900">
          Öne Çıkan Ürünler
        </h2>
        <p className="text-sm text-slate-500">Yükleniyor...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-slate-50 px-6 pb-12 pt-8 md:px-12">
        <h2 className="mb-4 text-lg font-extrabold text-slate-900">
          Öne Çıkan Ürünler
        </h2>
        <p className="text-sm text-red-700">{error}</p>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 px-9 pb-12 pt-8 md:px-12">
      <h2 className="mb-4 text-lg font-extrabold text-slate-900">
        Öne Çıkan Ürünler
      </h2>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 mx-15">
        {products.map((product) => (
          <article
            key={product.id}
            className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                {product.img ? (
                  <img
                    src={product.img}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-extrabold text-slate-700">
                    !
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                {product.category}
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                {product.name}
              </h3>
              <p className="text-xs text-slate-500">{product.description}</p>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">
                {product.price?.toLocaleString("tr-TR", {
                  style: "currency",
                  currency: "TRY",
                  maximumFractionDigits: 2,
                })}
              </span>
              <button
                type="button"
                className="inline-flex items-center rounded-full bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-700 hover:shadow-md"
              >
                Sepete Ekle
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
