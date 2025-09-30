import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../../api/client";
import { CartContext } from "../../context/CartContext";
import CartDesign from "../CartDesignCode/CartDesign";

const WatchGrind = () => {
  const navigate = useNavigate();
  const { addItem } = useContext(CartContext);

  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12; // Number of products per page

  const gridRef = useRef(null);

  const fetchWatches = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const response = await apiGet("/products", {
        category: "watch",
        page: pageNumber,
        limit,
      });
      setWatches(response.data?.products || []);
      setTotalPages(response.data?.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || "Failed to load watches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatches(page);
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [page]);

  if (loading) return <p className="text-center py-6">Loading watches...</p>;
  if (error) return <p className="text-center text-red-600 py-6">{error}</p>;

  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);

  return (
    <div
      className="scroll-mt-24 flex flex-col bg-[#ECEEDF] w-full pb-10 md:px-10"
      ref={gridRef}
    >
      <div className="w-full">
        {/* Title Section */}
        <div className="items-center text-center">
          <div className="bg-[#eceacb] py-4 rounded-md">
            <h2 className="text-4xl poppins-semibold text-[#e28e45] uppercase">
              Watch
            </h2>
            <p className="text-lg poppins-medium text-amber-800">
              Elegance that shines on your wrist
            </p>
          </div>
        </div>

        {/* ✅ Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 px-1 md:px-20 gap-2 md:gap-4 mt-6">
          {watches.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={() => addItem(product._id)}
              onClick={() => navigate(`/category/watch/${product._id}`)}
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

      {/* Add your Watch description or content here */}
      <div className="p-10 px-5 md:px-20 text-justify poppins-regular text-xs md:text-base">
        <h1 className="font-bold text-base md:text-2xl text-amber-700 text-center p-4">
          Watches – Stylish & Trendy Watches Collection Online
        </h1>
        <p>
          Discover a wide range of stylish watches at{" "}
          <b className="text-amber-700">AvishJEWELS</b>. From casual everyday
          watches to elegant timepieces for special occasions, our collection
          blends fashion with functionality. Choose from classic designs, modern
          chronographs, sleek minimalistic watches, and statement pieces to suit
          every personality and style.
        </p>
        <br />
        <p>
          At <b className="text-amber-700">AvishJEWELS</b>, watches are more
          than just accessories—they are a reflection of your personality and
          taste. Our carefully curated collection ensures that every watch adds
          sophistication, precision, and elegance to your look, whether for
          work, parties, or casual outings.
        </p>
        <br />
        <h2 className="font-bold text-amber-700">
          Trendy Watches for Every Occasion
        </h2>
        <p>
          Explore a variety of styles including analog, digital, chronograph,
          smartwatches, and designer-inspired watches. Each{" "}
          <b className="text-amber-700">AvishJEWELS</b>
          watch is crafted for comfort and durability, while keeping your look
          stylish and on-trend. Perfect for both men and women, our watches
          complement formal attire, casual wear, and even sporty outfits.
        </p>
        <br />
        <h2 className="font-bold text-amber-700">
          Why Choose AvishJEWELS Watches?
        </h2>
        <p>
          Choosing <b className="text-amber-700">AvishJEWELS</b> watches means
          opting for quality, style, and timeless elegance. Each timepiece is
          designed to offer reliable performance and a chic aesthetic. Ideal as
          a gift or a personal accessory,
          <b className="text-amber-700">AvishJEWELS</b> watches make a statement
          on every wrist and elevate your overall look.
        </p>
      </div>
    </div>
  );
};

// ==================== PRODUCT CARD ====================
const ProductCard = ({ product, addToCart, onClick }) => {
  return (
    <CartDesign product={product} addToCart={addToCart} onClick={onClick} />
  );
};

export default WatchGrind;
