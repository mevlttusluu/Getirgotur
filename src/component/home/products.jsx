import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { getProducts } from "../../api/products";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";

function normalizeTr(value) {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase("tr-TR");
}

export default function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { page } = useParams();
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const qParam = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(qParam);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const itemsPerPage = 12;

  useEffect(() => {
    setQuery(qParam);
  }, [qParam]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      const trimmed = query.trim();

      if (trimmed) {
        next.set("q", trimmed);
      } else {
        next.delete("q");
      }

      const nextQueryString = next.toString();
      const currentQueryString = searchParams.toString();

      if (nextQueryString !== currentQueryString) {
        navigate(`/page/1${nextQueryString ? `?${nextQueryString}` : ""}`);
      }
    }, 250);

    return () => window.clearTimeout(handle);
  }, [navigate, query, searchParams]);

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
    const byCategory = selectedCategory
      ? products.filter((p) => p.category === selectedCategory)
      : products;

    const normalizedQuery = normalizeTr(qParam);
    const sourceProducts = normalizedQuery
      ? byCategory.filter((p) => {
          const haystack = `${p.name ?? ""} ${p.description ?? ""} ${
            p.category ?? ""
          }`;
          return normalizeTr(haystack).includes(normalizedQuery);
        })
      : byCategory;

    if (!sourceProducts.length) {
      return {
        currentPage: 1,
        totalPages: 1,
        paginatedProducts: [],
        filteredCount: 0,
      };
    }

    const rawPage = Number(page);
    let currentPage = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

    const totalPages = Math.max(
      1,
      Math.ceil(sourceProducts.length / itemsPerPage),
    );

    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = sourceProducts.slice(startIndex, endIndex);

    return {
      currentPage,
      totalPages,
      paginatedProducts,
      filteredCount: sourceProducts.length,
    };
  }, [page, products, qParam, selectedCategory]);

  const pageHref = useMemo(() => {
    const queryString = searchParams.toString();
    return (pageNumber) =>
      `/page/${pageNumber}${queryString ? `?${queryString}` : ""}`;
  }, [searchParams]);

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
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <div className="w-full max-w-xl">
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 transition group-focus-within:text-violet-600">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 21l-4.35-4.35" />
                <circle cx="11" cy="11" r="7" />
              </svg>
            </div>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ürün ara (ör. ‘kulaklık’, ‘ayakkabı’)"
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-600 focus:ring-4 focus:ring-violet-500/15"
              type="search"
            />

            {query.trim().length > 0 && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute inset-y-0 right-2 inline-flex items-center justify-center rounded-xl px-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Aramayı temizle"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

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

      {!pagination.paginatedProducts.length && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="text-sm font-bold text-slate-900">
            Sonuç bulunamadı
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {qParam.trim()
              ? "Farklı bir arama yapmayı dene veya filtreleri temizle."
              : "Bu filtrelerle ürün bulunamadı."}
          </div>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Link
            to={pageHref(Math.max(1, pagination.currentPage - 1))}
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
                to={pageHref(pageNumber)}
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
            to={pageHref(
              Math.min(pagination.totalPages, pagination.currentPage + 1),
            )}
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
