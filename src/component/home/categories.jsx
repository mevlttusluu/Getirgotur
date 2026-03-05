import React from "react";

const CATEGORIES = [
  { name: "Atıştırmalık", icon: "🥜", color: "bg-amber-100" },
  { name: "Su & İçecek", icon: "🥤", color: "bg-sky-100" },
  { name: "Meyve & Sebze", icon: "🥬", color: "bg-emerald-100" },
  { name: "Süt Ürünleri", icon: "🥛", color: "bg-yellow-100" },
  { name: "Kahvaltılık", icon: "🍳", color: "bg-pink-100" },
  { name: "Dondurma", icon: "🍦", color: "bg-indigo-100" },
  { name: "Temel Gıda", icon: "🛒", color: "bg-violet-100" },
  { name: "Pratik Yemek", icon: "🍱", color: "bg-orange-100" },
  { name: "Et, Tavuk & Balık", icon: "🍗", color: "bg-rose-100" },
];

const Categories = () => {
  return (
    <div id="categories" className="bg-white px-6 py-10 md:px-12 md:py-12">
      <h2 className="mb-5 text-lg font-bold text-slate-900">Kategoriler</h2>
      <div className="flex items-center px-20 gap-15 overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-100">
        {CATEGORIES.map(({ name, icon, color }) => (
          <button
            key={name}
            type="button"
            className="flex w-32 flex-none flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full ${color}`}
            >
              <span className="text-2xl">{icon}</span>
            </div>
            <span className="text-center leading-tight">{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
