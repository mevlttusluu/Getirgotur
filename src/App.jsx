import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./component/home/HomePage";
import ProductDetail from "./component/home/ProductDetail";
import CartPage from "./component/CartPage";
import FavoritesPage from "./component/FavoritesPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/page/1" replace />} />
      <Route path="/page/:page" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
    </Routes>
  );
}

export default App;
