import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getProducts } from "../../api/products";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";

export default function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { page } = useParams();
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const itemsPerPage = 12;

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

  const pagination = useMemo(() => {
    const sourceProducts = selectedCategory
      ? products.filter((p) => p.category === selectedCategory)
      : products;

    if (!sourceProducts.length) {
      return {
        currentPage: 1,
        totalPages: 1,
        paginatedProducts: [],
      };
    }

    const rawPage = Number(page);
    let currentPage = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

    const totalPages = Math.max(
      1,
      Math.ceil(sourceProducts.length / itemsPerPage)
    );

    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = sourceProducts.slice(startIndex, endIndex);

    return { currentPage, totalPages, paginatedProducts };
  }, [page, products, selectedCategory]);

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
        {pagination.paginatedProducts.map((product) => (
          <article
            key={product.id}
            className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <Link to={`/product/${product.id}`} className="block">
              <div className="flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
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
              <div className="mt-3 flex flex-col gap-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {product.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {product.description}
                </p>
              </div>
            </Link>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">
                {product.price?.toLocaleString("tr-TR", {
                  style: "currency",
                  currency: "TRY",
                  maximumFractionDigits: 2,
                })}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleFavorite(product)}
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-semibold shadow-sm transition ${
                    isFavorite(product.id)
                      ? "border-rose-400 bg-rose-50 text-rose-600 hover:bg-rose-100"
                      : "border-slate-200 bg-white text-slate-700 hover:border-rose-300 hover:bg-rose-50"
                  }`}
                >
                  <span>{isFavorite(product.id) ? "♥" : "♡"}</span>
                  <span>Favori</span>
                </button>
                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="inline-flex items-center gap-1 rounded-full bg-violet-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-violet-700 hover:shadow-md"
                >
                  <span>Sepete Ekle</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Link
            to={`/page/${Math.max(1, pagination.currentPage - 1)}`}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border ${
              pagination.currentPage === 1
                ? "cursor-not-allowed border-slate-200 text-slate-300"
                : "border-slate-300 text-slate-700 hover:bg-slate-100"
            }`}
            aria-disabled={pagination.currentPage === 1}
          >
            Önceki
          </Link>

          {Array.from({ length: pagination.totalPages }, (_, index) => {
            const pageNumber = index + 1;
            const isActive = pageNumber === pagination.currentPage;

            return (
              <Link
                key={pageNumber}
                to={`/page/${pageNumber}`}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full border ${
                  isActive
                    ? "border-violet-600 bg-violet-600 text-white"
                    : "border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {pageNumber}
              </Link>
            );
          })}

          <Link
            to={`/page/${Math.min(
              pagination.totalPages,
              pagination.currentPage + 1
            )}`}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border ${
              pagination.currentPage === pagination.totalPages
                ? "cursor-not-allowed border-slate-200 text-slate-300"
                : "border-slate-300 text-slate-700 hover:bg-slate-100"
            }`}
            aria-disabled={pagination.currentPage === pagination.totalPages}
          >
            Sonraki
          </Link>
        </div>
      )}
    </section>
  );
}
