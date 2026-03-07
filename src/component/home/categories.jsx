import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getProducts } from "../../api/products";

const getCategoryVisual = (name) => {
  switch (name) {
    case "Giyim":
      return { icon: "🧥", color: "bg-rose-100" };
    case "Elektronik":
      return { icon: "💻", color: "bg-indigo-100" };
    case "Aksesuar":
      return { icon: "🎒", color: "bg-emerald-100" };
    case "Ayakkabı":
      return { icon: "👟", color: "bg-amber-100" };
    case "Ev & Yaşam":
      return { icon: "🏡", color: "bg-lime-100" };
    case "Oyun":
      return { icon: "🎮", color: "bg-purple-100" };
    case "Ofis":
      return { icon: "🖱️", color: "bg-blue-100" };
    case "Kişisel Bakım":
      return { icon: "🧴", color: "bg-pink-100" };
    default:
      return { icon: "🛒", color: "bg-slate-100" };
  }
};

const Categories = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category");

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
          setError("Kategoriler yüklenirken bir hata oluştu.");
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

  const categories = useMemo(() => {
    const map = new Map();

    for (const product of products) {
      const categoryName = product.category || "Diğer";
      const current = map.get(categoryName) ?? 0;
      map.set(categoryName, current + 1);
    }

    return Array.from(map.entries()).map(([name, count]) => {
      const { icon, color } = getCategoryVisual(name);
      return { name, count, icon, color };
    });
  }, [products]);

  return (
    <div id="categories" className="bg-white px-6 py-10 md:px-12 md:py-12">
      <h2 className="mb-2 text-lg font-bold text-slate-900">Kategoriler</h2>
      <p className="mb-5 text-xs text-slate-500">
        Ürünlere göre otomatik oluşturulmuş kategoriler
      </p>

      {loading && (
        <p className="text-xs text-slate-500">Kategoriler yükleniyor...</p>
      )}

      {error && !loading && (
        <p className="text-xs text-red-700">{error}</p>
      )}

      {!loading && !error && (
        <div className="flex items-center gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-100">
          {/* Tümü butonu */}
          <button
            type="button"
            onClick={() => navigate("/page/1")}
            className={`flex w-32 flex-none flex-col items-center gap-2 rounded-2xl border p-4 text-xs font-semibold shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
              !activeCategory
                ? "border-violet-600 bg-violet-50 text-violet-700"
                : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <span className="text-2xl">✨</span>
            </div>
            <span className="text-center leading-tight">Tümü</span>
            <span className="text-[10px] font-normal text-slate-500">
              Tüm ürünler
            </span>
          </button>

          {categories.map(({ name, icon, color, count }) => {
            const isActive = activeCategory === name;

            return (
              <button
                key={name}
                type="button"
                onClick={() =>
                  navigate(
                    `/page/1?category=${encodeURIComponent(name)}`
                  )
                }
                className={`flex w-32 flex-none flex-col items-center gap-2 rounded-2xl border p-4 text-xs font-semibold shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                  isActive
                    ? "border-violet-600 bg-violet-50 text-violet-700"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full ${color}`}
                >
                  <span className="text-2xl">{icon}</span>
                </div>
                <span className="text-center leading-tight">{name}</span>
                <span className="text-[10px] font-normal text-slate-500">
                  {count} ürün
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Categories;
