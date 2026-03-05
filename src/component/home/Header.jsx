import React from "react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-black/5 bg-white/90 px-6 py-3 backdrop-blur-xl md:px-12">
      <div className="flex items-center gap-3">
        <img
          src="/logo.jpeg"
          alt="Getirgötür"
          className="h-11 w-11 rounded-xl object-cover shadow-md shadow-violet-500/40"
        />
        <span className="bg-gradient-to-r from-violet-700 to-indigo-500 bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
          Getirgötür
        </span>
      </div>
    </header>
  );
};

export default Header;
