import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../../api/client";
import { CartContext } from "../../context/CartContext";
import CartDesign from "../CartDesignCode/CartDesign";
import {
  getCategoryLabel,
  getCategorySubtitle,
} from "../../constants/categories";

const RoyalCrunchGrid = () => {
  const navigate = useNavigate();
  const { addItem } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  const gridRef = useRef(null);

  const fetchProducts = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const response = await apiGet("/products", {
        category: "royal-crunch",
        page: pageNumber,
        limit,
      });
      setProducts(response.data?.products || []);
      setTotalPages(response.data?.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || "Failed to load Royal Crunch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [page]);

  if (loading) return <p className="text-center py-6">Loading products...</p>;
  if (error) return <p className="text-center text-red-600 py-6">{error}</p>;

  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);

  return (
    <div
      className="scroll-mt-24 flex flex-col theme-page-bg w-full pb-10 md:px-10"
      ref={gridRef}
    >
      <div className="w-full">
        <div className="items-center text-center">
          <div className="theme-page-panel py-4 rounded-md">
            <h2 className="text-4xl poppins-semibold theme-page-title uppercase">
              {getCategoryLabel("royal-crunch")}
            </h2>
            <p className="text-lg poppins-medium theme-page-subtitle">
              {getCategorySubtitle("royal-crunch")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 px-1 md:px-20 gap-2 md:gap-4 mt-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={() => addItem(product._id)}
              onClick={() =>
                navigate(`/category/royal-crunch/${product._id}`)
              }
            />
          ))}
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className={`px-3 py-1 rounded ${
              page === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "theme-btn"
            }`}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setPage(idx + 1)}
              className={`px-3 py-1 rounded ${
                page === idx + 1
                  ? "theme-btn-active"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className={`px-3 py-1 rounded ${
              page === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "theme-btn"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      <div className="p-10 text-justify poppins-regular text-xs md:text-base">
        <h1 className="font-bold text-base md:text-2xl theme-copy-accent">
          Royal Crunch: Nature's Finest Jewels for Wealth &amp; Wellness
        </h1>
        <p>
          True luxury is built on the foundation of good health. At
          <b className="theme-copy-accent"> AVISH PREMIUM</b>, we present Royal
          Crunch, a handpicked selection of premium dry fruits and nuts that
          are as rich in nutrients as they are in taste. Sourced from the
          finest orchards globally, each nut is selected for its supreme size,
          flawless texture, and rich flavor.
        </p>
        <br />
        <p>
          Think of them as nature&apos;s own edible gemstones, packaged with
          sophistication and crafted for those who compromise on nothing but
          the best. Elevate your gifting traditions or indulge in daily royal
          nourishment with the golden standard of wellness.
        </p>
        <br />
        <h2 className="font-bold theme-copy-accent">Why It&apos;s Unique</h2>
        <p>
          <b>Gourmet Standard &amp; Hand-Sorted:</b> Har ek badam, kaju, aur
          pista ko manually select kiya jata hai taaki aapko sirf uniform size
          aur premium quality hi mile.
        </p>
        <br />
        <p>
          <b>Vacuum-Packed Freshness:</b> Hamari luxury packaging crunchiness
          aur natural nutrients ko lock rakhti hai, bina kisi artificial
          preservatives ke.
        </p>
        <br />
        <p>
          <b>Elite Festive &amp; Wellness Gifting:</b> Premium boxes aur royal
          aesthetics ke sath, ye collection festivals aur corporate gifting ke
          liye ek complete luxury statement hai.
        </p>
      </div>
    </div>
  );
};

const ProductCard = ({ product, addToCart, onClick }) => {
  return (
    <CartDesign product={product} addToCart={addToCart} onClick={onClick} />
  );
};

export default RoyalCrunchGrid;
