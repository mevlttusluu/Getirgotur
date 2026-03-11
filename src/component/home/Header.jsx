import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import AuthControl from "./AuthControl";
import { useFavorites } from "../../context/FavoritesContext";

const Header = () => {
  const { itemCount } = useCart();
  const { favoritesCount } = useFavorites();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-black/5 bg-white/90 px-6 py-3 backdrop-blur-xl md:px-12">
      <Link to="/page/1" className="flex items-center gap-3">
        <img
          src="/logo.jpeg"
          alt="Getirgötür"
          className="h-11 w-11 rounded-xl object-cover shadow-md shadow-violet-500/40"
        />
        <span className="x from-violet-700 to-indigo-500 bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
          Getirgötür
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <AuthControl />
        <Link
          to="/favorites"
          className="relative inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-rose-400 hover:bg-rose-50"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-rose-500 to-pink-500 text-[13px] font-bold text-white">
            ❤
          </span>
          <span>Favorilerim</span>
          {favoritesCount > 0 && (
            <span className="ml-1 inline-flex min-w-6 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
              {favoritesCount}
            </span>
          )}
        </Link>
        <Link
          to="/cart"
          className="relative inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-violet-500 hover:bg-violet-50"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-violet-600 to-indigo-500 text-[13px] font-bold text-white">
            🛒
          </span>
          <span>Sepetim</span>
          {itemCount > 0 && (
            <span className="ml-1 inline-flex min-w-6 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white">
              {itemCount}
            </span>
          )}
        </Link>
      </div>

    </header>
  );
};

export default Header;
