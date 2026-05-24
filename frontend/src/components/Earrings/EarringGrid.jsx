import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../../api/client";
import { CartContext } from "../../context/CartContext";
import CartDesign from "../CartDesignCode/CartDesign";

const EarringsGrid = () => {
  const navigate = useNavigate();
  const { addItem } = useContext(CartContext);

  const [earrings, setEarrings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12; // Number of products per page

  const gridRef = useRef(null);

  const fetchEarrings = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const response = await apiGet("/products", {
        category: "earrings",
        page: pageNumber,
        limit,
      });
      setEarrings(response.data?.products || []);
      setTotalPages(response.data?.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || "Failed to load Earrings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarrings(page);
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [page]);

  if (loading) return <p className="text-center py-6">Loading earrings...</p>;
  if (error) return <p className="text-center text-red-600 py-6">{error}</p>;

  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);

  return (
    <div
      id="earrings"
      className="scroll-mt-24 flex flex-col bg-[#ECEEDF] w-full pb-10"
      ref={gridRef}
    >
      <div className="w-full">
        {/* Heading */}
        <div className="items-center text-center">
          <div className="bg-[#eceacb] py-4 rounded-md">
            <h2 className="text-4xl poppins-semibold text-[#e28e45] uppercase">
              Smart Living
            </h2>
            <p className="text-lg poppins-medium text-amber-800">
              Home &amp; Kitchen Essentials
            </p>
          </div>
        </div>

        {/* ✅ Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 px-1 md:px-20 gap-2 md:gap-4 mt-6">
          {earrings.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={() => addItem(product._id)}
              onClick={() => navigate(`/category/earrings/${product._id}`)}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className={`px-3 py-1 rounded ${
              page === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-600 text-white"
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
                  ? "bg-amber-600 text-white"
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
                : "bg-amber-500 hover:bg-amber-600 text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      <div className="p-10 px-5 md:px-20 text-xs md:text-base text-justify poppins-regular">
        <h1 className="font-bold text-base md:text-2xl text-amber-700 text-center p-4">
          Smart Living: Where Functionality Meets Finery
        </h1>
        <p>
          True luxury is an everyday experience. With the <b className="text-amber-700">Smart Living</b> collection, Avish Jewels brings its signature touch of premium craftsmanship into the heart of your home. We believe that your kitchen and daily essentials should gleam with the same sophistication as a diamond necklace.
        </p>
        <br />
        <p>
          This curated range of premium home and kitchen essentials blends cutting-edge utility with exquisite design. Elevate your daily rituals, host with unmatched grace, and transform your living space into a sanctuary of modern luxury.
        </p>
        <br />
        <h2 className="font-bold text-amber-700">Why It's Unique</h2>
        <p>
          <b>Effortless Elegance:</b> Minimalist aur modern designs jo aapke kitchen aur dining area ko instant luxury look dete hain.
        </p>
        <br />
        <p>
          <b>Smart &amp; Time-Saving Functionality:</b> Har ek tool aur essential ko ergonomically design kiya gaya hai taaki aapka kaam aasan aur jaldi ho.
        </p>
        <br />
        <p>
          <b>Built to Last:</b> Premium rust-free aur scratch-resistant materials se nirmit, jo daily use ke baad bhi naye jaise chamakte hain.
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

export default EarringsGrid;
