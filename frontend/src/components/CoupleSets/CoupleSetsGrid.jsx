import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../../api/client";
import { CartContext } from "../../context/CartContext";
import CartDesign from "../CartDesignCode/CartDesign";

const CoupleSetsGrid = () => {
  const navigate = useNavigate();
  const { addItem } = useContext(CartContext);

  const [coupleSets, setCoupleSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12; // Number of products per page

  const gridRef = useRef(null);

  const fetchCoupleSets = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const response = await apiGet("/products", {
        category: "couple-sets",
        page: pageNumber,
        limit,
      });
      setCoupleSets(response.data?.products || []);
      setTotalPages(response.data?.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || "Failed to load Couple Sets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupleSets(page);
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [page]);

  if (loading)
    return <p className="text-center py-6">Loading Couple Sets...</p>;
  if (error) return <p className="text-center text-red-600 py-6">{error}</p>;

  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);

  return (
    <div
      id="couple_sets"
      className="scroll-mt-24 flex flex-col bg-[#ECEEDF] w-full poppins"
      ref={gridRef}
    >
      <div className="w-full">
        {/* Heading */}
        <div className="items-center text-center mb-6">
          <div className="bg-[#eceacb] py-4 rounded-md">
            <h2 className="text-4xl poppins-semibold text-[#e28e45] uppercase">
              New Launches
            </h2>
            <p className="text-lg poppins-medium text-amber-800">
              Fresh Arrivals Just In
            </p>
          </div>
        </div>

        {/* ✅ Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 px-1 md:px-20 gap-2 md:gap-4 mt-6">
          {coupleSets.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={() => addItem(product._id)}
              onClick={() => navigate(`/category/couple-sets/${product._id}`)}
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

      {/* Existing Paragraphs for New Launches */}
      <div className="p-10 px-5 md:px-20 text-justify poppins-regular text-xs md:text-base">
        <h1 className="font-bold text-base md:text-2xl text-amber-700 text-center p-4">
          New Launches – Discover the Fresh Arrivals Just In
        </h1>
        <p>
          Be the first to explore the latest trends and hot additions at <b className="text-amber-700">Avish</b>. Our <b className="text-amber-700">New Launches</b> section showcases our newest high-quality products across all collections, featuring innovative designs, curated aesthetics, and smart solutions freshly added to our store.
        </p>
        <br />
        <p>
          We constantly update our inventory to bring you state-of-the-art products that make daily life easier, more beautiful, and incredibly stylish. From unique kids' items and premium drinkware to sophisticated kitchenware and gorgeous home decor accessories, our new releases represent the absolute pinnacle of our craftsmanship and quality.
        </p>
        <br />
        <p>
          Stay ahead of the curve and treat yourself or your loved ones to our latest releases. Whether you are redecorating your lifestyle or finding advanced tools for parenting or cooking, our newly launched items are designed to exceed your expectations.
        </p>
        <br />
        <div>
          <h1 className="font-bold text-amber-700 text-xl mt-4 mb-2">FAQs</h1>
          <h2 className="font-bold">1. How often are new products launched?</h2>
          <b>Answer:</b> We introduce new items and fresh collections weekly to ensure you always have access to the latest global trends and innovative lifestyle solutions.
          <h2 className="font-bold">2. Are New Launches available in limited quantities?</h2>
          <b>Answer:</b> Yes, some of our fresh arrivals are introduced in limited boutique batches. We recommend purchasing your favorites early to avoid missing out when they sell out!
          <h2 className="font-bold">3. Can I find discounts on newly launched items?</h2>
          <b>Answer:</b> We occasionally run special introductory launch offers and early-bird discounts. Make sure to check our coupons section and product pages for active deals.
          <h2 className="font-bold">4. Can I request or suggest products for future launches?</h2>
          <b>Answer:</b> Absolutely! We love hearing from our community. You can share your feedback and suggestions with us via our contact email, and we will do our best to bring them in future updates.
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, addToCart, onClick }) => {
  return (
    <CartDesign product={product} addToCart={addToCart} onClick={onClick} />
  );
};

export default CoupleSetsGrid;
