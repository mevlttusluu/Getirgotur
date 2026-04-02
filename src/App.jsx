import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./component/home/HomePage";
import ProductDetail from "./component/home/ProductDetail";
import CartPage from "./component/CartPage";
import FavoritesPage from "./component/FavoritesPage";
import UserPanelPage from "./component/UserPanelPage";
import AdminPanelPage from "./component/AdminPanelPage";
import CheckoutPage from "./component/CheckoutPage";
import CardPaymentPage from "./component/CardPaymentPage";
import OrderSuccessPage from "./component/OrderSuccessPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/page/1" replace />} />
      <Route path="/page/:page" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/checkout/kart" element={<CardPaymentPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/user-panel" element={<UserPanelPage />} />
      <Route path="/admin-panel" element={<AdminPanelPage />} />
    </Routes>
  );
}

export default App;
