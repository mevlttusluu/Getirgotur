import { createContext, useContext, useEffect, useMemo, useState } from "react";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  useEffect(() => {}, []);

  const isFavorite = (id) => favorites.some((item) => item.id === id);

  const addFavorite = (product) => {
    setFavorites((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price ?? 0,
          img: product.img,
          category: product.category,
          description: product.description,
        },
      ];
    });
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleFavorite = (product) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      return exists ? prev.filter((p) => p.id !== product.id) : [...prev, {
        id: product.id,
        name: product.name,
        price: product.price ?? 0,
        img: product.img,
        category: product.category,
        description: product.description,
      }];
    });
  };

  const value = useMemo(() => {
    return {
      favorites,
      favoritesCount: favorites.length,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
    };
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}

