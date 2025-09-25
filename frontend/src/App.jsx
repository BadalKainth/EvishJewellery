import React, { useEffect, useState } from "react";
import "./style.css";
import Navbar from "./Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import AllLinks from "./components/AllLinks";
import BraceletsGrid from "./components/Bracelets/BraceletsGrid";
import RingsGrid from "./components/Rings/RingsGrid";
import EarringsGrid from "./components/Earrings/EarringGrid";
import NecklacesGrid from "./components/Necklaces/NecklacesGrid";
import CoupleSetsGrid from "./components/CoupleSets/CoupleSetsGrid";
import AnkletGrid from "./components/Anklet/AnkletGrid";
import BraceletsDetails from "./components/Bracelets/BraceletsDetails";
import ProductDetails from "./components/Rings/ProductDetails";
import EarringDetails from "./components/Earrings/EarringDetils";
import NecklaceDetails from "./components/Necklaces/NecklaceDetails";
import CoupleDetails from "./components/CoupleSets/CoupleDetails";
import AnkletDetails from "./components/Anklet/AnkletDetails";
import Cart from "./components/Cart/Cart";
import Footer from "./Footer";
import AuthForm from "./AuthForm"; // ✅ Add this
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/Admin";
import ProductsList from "./components/ProductsList";
import ProductDetail from "./components/ProductDetail";
import Checkout from "./components/Checkout/Checkout";
import Account from "./components/Account/Account";
import CreateReturn from "./components/Returns/CreateReturn";
import SearchPage from "./components/Search/SearchPage";
import FeaturedProducts from "./components/Featured/FeaturedProducts";
import PublicCoupons from "./components/Coupons/PublicCoupons";
import OrderDetail from "./components/Orders/OrderDetail";
import UploadReturnMedia from "./components/Returns/UploadReturnMedia";
import Addresses from "./components/Account/Addresses";
import VerifyEmail from "./components/Auth/VerifyEmail";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import ChangePassword from "./components/Auth/ChangePassword";
import About from "./components/about/About";
import CategoryWrapper from "./components/CategoryWrapper";
import BagsGrid from "./components/Bags/BagsGrid";
import BagsDetails from "./components/Bags/BagsDetails";
import WomenDressGrid from "./components/WomenDress/WomenDressGrid";
import WomenDetails from "./components/WomenDress/WomenDetails";
import WatchGrind from "./components/Watch/WatchGrid";
import WatchDetails from "./components/Watch/WatchDetails";

function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const [cartItems, setCartItems] = useState([]);
  const addToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
  };

  // Auth is now handled via routes and ProtectedRoute

  return (
    <>
      <ScrollToTopOnRouteChange />
      <Navbar cartItems={cartItems} />

      <Routes>
        <Route
          path="/"
          element={
            <AllLinks
              cartItems={cartItems}
              setCartItems={setCartItems}
              addToCart={addToCart}
            />
          }
        />
        <Route path="/products" element={<ProductsList />} />
        <Route path="/category/:category" element={<CategoryWrapper />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/featured" element={<FeaturedProducts />} />
        <Route path="/coupons" element={<PublicCoupons />} />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/returns/:id/media"
          element={
            <ProtectedRoute>
              <UploadReturnMedia />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/addresses"
          element={
            <ProtectedRoute>
              <Addresses />
            </ProtectedRoute>
          }
        />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/returns/new"
          element={
            <ProtectedRoute>
              <CreateReturn />
            </ProtectedRoute>
          }
        />

        <Route
          path="category/bracelets"
          element={<BraceletsGrid addToCart={addToCart} />}
        />
        <Route
          path="category/bracelets/:id"
          element={<BraceletsDetails addToCart={addToCart} />}
        />
        <Route
          path="category/rings"
          element={<RingsGrid addToCart={addToCart} slider={false} />}
        />
        <Route
          path="category/rings/:id"
          element={<ProductDetails addToCart={addToCart} />}
        />
        <Route
          path="category/earrings"
          element={<EarringsGrid addToCart={addToCart} slider={false} />}
        />
        <Route
          path="category/earrings/:id"
          element={<EarringDetails addToCart={addToCart} slider={false} />}
        />
        <Route
          path="category/necklaces"
          element={<NecklacesGrid addToCart={addToCart} slider={false} />}
        />
        <Route
          path="category/necklaces/:id"
          element={<NecklaceDetails addToCart={addToCart} slider={false} />}
        />
        <Route
          path="category/couplesets"
          element={<CoupleSetsGrid addToCart={addToCart} slider={false} />}
        />
        <Route
          path="category/couplesets/:id"
          element={<CoupleDetails addToCart={addToCart} slider={false} />}
        />
        <Route
          path="category/anklets"
          element={<AnkletGrid addToCart={addToCart} slider={false} />}
        />
        <Route
          path="category/anklets/:id"
          element={<AnkletDetails addToCart={addToCart} slider={false} />}
        />
        <Route
          path="category/bags"
          element={<BagsGrid addToCart={addToCart} slider={false} />}
        />
        <Route
          path="category/bags/:id"
          element={<BagsDetails addToCart={addToCart} />}
        />
        <Route
          path="category/womendress"
          element={<WomenDressGrid addToCart={addToCart} slider={false} />}
        />
        <Route
          path="category/womendress/:id"
          element={<WomenDetails addToCart={addToCart} />}
        />
        <Route
          path="category/watch"
          element={<WatchGrind addToCart={addToCart} slider={false} />}
        />
        <Route
          path="category/watch/:id"
          element={<WatchDetails addToCart={addToCart} slider={false} />}
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/cart"
          element={<Cart cartItems={cartItems} setCartItems={setCartItems} />}
        />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout />
            </ProtectedRoute>
          }
        />

        <Route path="/authForm" element={<AuthForm />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
