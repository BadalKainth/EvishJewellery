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
import About from "./components/about/about";

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

  const token = localStorage.getItem("token"); // ✅ check login

  if (!token) {
    return <AuthForm />; // ✅ agar login nahi hai toh signup/signin form dikhao
  }

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
        <Route
          path="/bracelets"
          element={<BraceletsGrid addToCart={addToCart} />}
        />
        <Route
          path="/bracelets/:id"
          element={<BraceletsDetails addToCart={addToCart} />}
        />
        <Route
          path="/rings"
          element={<RingsGrid addToCart={addToCart} slider={false} />}
        />
        <Route
          path="/rings/:id"
          element={<ProductDetails addToCart={addToCart} />}
        />
        <Route
          path="/earrings"
          element={<EarringsGrid addToCart={addToCart} slider={false} />}
        />
        <Route
          path="/earrings/:id"
          element={<EarringDetails addToCart={addToCart} slider={false} />}
        />
        <Route
          path="/necklaces"
          element={<NecklacesGrid addToCart={addToCart} slider={false} />}
        />
        <Route
          path="/necklaces/:id"
          element={<NecklaceDetails addToCart={addToCart} slider={false} />}
        />
        <Route
          path="/couplesets"
          element={<CoupleSetsGrid addToCart={addToCart} slider={false} />}
        />
        <Route
          path="/couplesets/:id"
          element={<CoupleDetails addToCart={addToCart} slider={false} />}
        />
        <Route
          path="/anklet"
          element={<AnkletGrid addToCart={addToCart} slider={false} />}
        />
        <Route
          path="/anklets/:id"
          element={<AnkletDetails addToCart={addToCart} slider={false} />}
        />
        <Route
          path="/about"
          element={ <About/>}
        />
        <Route
          path="/cart"
          element={<Cart cartItems={cartItems} setCartItems={setCartItems} />}
        />

        <Route path="/authForm" element={<AuthForm />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
