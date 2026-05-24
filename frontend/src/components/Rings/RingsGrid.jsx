import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { apiGet } from "../../api/client";
import CartDesign from "../CartDesignCode/CartDesign";

const RingsGrid = () => {
  const navigate = useNavigate(); // ✅ React Router का hook, navigation के लिए
  const { addItem } = useContext(CartContext); // ✅ CartContext से function लेकर cart में item add करना

  // ========================== State Variables ==========================
  const [rings, setRings] = useState([]); // ✅ Rings का data store करने के लिए
  const [loading, setLoading] = useState(true); // ✅ Loading state
  const [error, setError] = useState(""); // ✅ Error messages के लिए
  const [page, setPage] = useState(1); // ✅ Current page number
  const [totalPages, setTotalPages] = useState(1); // ✅ Total pages for pagination
  const limit = 12; // ✅ हर page में maximum products

  const gridRef = useRef(null); // ✅ Pagination change होने पर scroll करने के लिए ref

  // ========================== Fetch Products ==========================
  const fetchRings = async (pageNumber = 1) => {
    setLoading(true); // ✅ Fetch start होने पर loading true
    try {
      const response = await apiGet("/products", {
        category: "rings", // ✅ API call में category specify की
        page: pageNumber, // ✅ Current page
        limit, // ✅ Products per page
      });

      setRings(response.data?.products || []); // ✅ Products को state में save करना
      setTotalPages(response.data?.pagination?.totalPages || 1); // ✅ Total pages set करना API response से
    } catch (err) {
      setError(err.message || "Failed to load Rings"); // ✅ Error handling
    } finally {
      setLoading(false); // ✅ Fetch complete होने पर loading false
    }
  };

  // ========================== useEffect ==========================
  useEffect(() => {
    fetchRings(page); // ✅ हर page change पर API call

    // ✅ Scroll to top of grid on page change
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [page]);

  // ========================== Loading / Error ==========================
  if (loading) return <p className="text-center py-6">Loading rings...</p>;
  if (error) return <p className="text-center text-red-600 py-6">{error}</p>;

  // ========================== Pagination Handlers ==========================
  const handlePrev = () => page > 1 && setPage(page - 1); // ✅ Previous button click
  const handleNext = () => page < totalPages && setPage(page + 1); // ✅ Next button click

  return (
    <div
      id="rings"
      className="scroll-mt-24 flex flex-col theme-page-bg w-full"
      ref={gridRef} // ✅ Scroll reference attach किया
    >
      <div className="w-full">
        {/* ========================== Heading ========================== */}
        <div className="items-center text-center">
          <div className="theme-page-panel py-4 rounded-md">
            <h2 className="text-4xl poppins-semibold theme-page-title uppercase">
              Hydro Luxe
            </h2>
            <p className="text-lg poppins-medium theme-page-subtitle">
              Premium Water Bottles &amp; Drinkware
            </p>
          </div>
        </div>

        {/* ========================== Grid Layout ========================== */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 px-1 md:px-20 gap-2 md:gap-4 mt-6">
          {rings.map((product) => (
            <ProductCard
              key={product._id} // ✅ Unique key for React
              product={product} // ✅ Product data
              addToCart={() => addItem(product._id)} // ✅ Add to cart function
              onClick={() => navigate(`/category/rings/${product._id}`)} // ✅ Navigate to product detail page
            />
          ))}
        </div>

        {/* ========================== Pagination ========================== */}
        <div className="flex justify-center mt-8 space-x-2">
          {/* Previous Button */}
          <button
            onClick={handlePrev} // ✅ Click पर previous page
            disabled={page === 1} // ✅ पहले page पर disable
            className={`px-3 py-1 rounded ${
              page === 1
                ? "bg-gray-300 cursor-not-allowed" // ✅ Disabled styling
                : "theme-btn" // ✅ Active styling
            }`}
          >
            Prev
          </button>

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1} // ✅ Unique key
              onClick={() => setPage(idx + 1)} // ✅ Click पर page change
              className={`px-3 py-1 rounded ${
                page === idx + 1
                  ? "theme-btn-active" // ✅ Active page styling
                  : "bg-gray-200 hover:bg-gray-300" // ✅ Inactive styling
              }`}
            >
              {idx + 1}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={handleNext} // ✅ Click पर next page
            disabled={page === totalPages} // ✅ Last page पर disable
            className={`px-3 py-1 rounded ${
              page === totalPages
                ? "bg-gray-300 cursor-not-allowed" // ✅ Disabled styling
                : "theme-btn" // ✅ Active styling
            }`}
          >
            Next
          </button>
        </div>
      </div>

      <div className="p-10 md:p-20 text-justify poppins-regular text-xs md:text-base">
        <h1 className="font-bold text-base md:text-2xl theme-copy-accent mb-4">Hydro Luxe: Hydration Meets High Fashion</h1>
        Why should elegance be limited to your jewelry box? Introducing <b className="theme-copy-accent">Hydro Luxe</b> by Avish Jewels, a statement drinkware collection that redefines everyday hydration. Crafted for those who appreciate the finer things in life, these premium bottles combine sleek, modern aesthetics with top-tier functionality.
        <br />
        <br />
        Whether you are at a boardroom meeting or a high-end lounge, let your drinkware reflect your sophisticated taste. Designed to mirror the brilliant polish and durability of our finest jewels, Hydro Luxe is not just a bottle; it's an accessory for the modern connoisseur.
        <br />
        <br />
        <b className="theme-copy-accent">Why It's Unique:</b>
        <br />
        <br />
        <b>Jewel-Tone Finish &amp; Ergonomic Design:</b> Luxury metal finish aur sleek designs jo pakadne mein comfortable hain aur dikhne mein kisi mehnge accessory jaise lagte hain.
        <br />
        <br />
        <b>Advanced Thermal Insulation:</b> 24 ghante tak thanda aur 12 ghante tak garam rakhne wali advanced double-wall vacuum technology.
        <br />
        <br />
        <b>Eco-Friendly Luxury:</b> 100% BPA-free, leak-proof, aur sustainable stainless steel jo environment aur aapki health dono ka khayal rakhta hai.
      </div>
    </div>
  );
};

// ==================== PRODUCT CARD ====================
const ProductCard = ({ product, addToCart, onClick }) => {
  return (
    <CartDesign
      product={product} // ✅ Product data
      addToCart={addToCart} // ✅ Add to cart function
      onClick={onClick} // ✅ Navigate to product detail
    />
  );
};

export default RingsGrid;

