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
      className="scroll-mt-24 flex flex-col bg-[#ECEEDF] w-full"
      ref={gridRef} // ✅ Scroll reference attach किया
    >
      <div className="w-full">
        {/* ========================== Heading ========================== */}
        <div className="items-center text-center">
          <div className="bg-[#eceacb] py-4 rounded-md">
            <h2 className="text-4xl poppins-semibold text-[#e28e45] uppercase">
              Hydro Luxe
            </h2>
            <p className="text-lg poppins-medium text-amber-800">
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
                : "bg-amber-500 hover:bg-amber-600 text-white" // ✅ Active styling
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
                  ? "bg-amber-600 text-white" // ✅ Active page styling
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
                : "bg-amber-500 hover:bg-amber-600 text-white" // ✅ Active styling
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* ========================== Paragraph Content for Hydro Luxe ========================== */}
      <div className="p-10 md:p-20 text-justify poppins-regular text-xs md:text-base">
        <h1 className="font-bold text-base md:text-2xl text-amber-700 mb-4">Hydro Luxe – Premium Water Bottles & Drinkware</h1>
        Elevate your hydration game with our <b className="text-amber-700">Hydro Luxe</b> premium drinkware collection. More than just containers, our bottles are statements of style, durability, and health. Designed to keep your favorite beverages at the perfect temperature all day long, they are the ideal companion for the gym, office, outdoor adventures, or daily commutes.
        <br />
        <br />
        At <b className="text-amber-700">Avish</b>, we combine aesthetic elegance with high-performance insulation technology. Crafted from food-grade stainless steel and completely free of BPA, toxins, and odors, our bottles ensure your water stays ice-cold for up to 24 hours or your morning coffee stays piping hot for up to 12 hours.
        <br />
        <br />
        Available in a gorgeous range of curated colors, sleek shapes, and robust matte finishes, the <b className="text-amber-700">Hydro Luxe</b> collection is engineered to prevent condensation and leakage. Each bottle is a blend of environmental sustainability, daily reliability, and premium craftsmanship, helping you reduce single-use plastic waste while looking exceptionally sophisticated.
        <br />
        <br />
        Whether you are looking for a reliable thermal flask, a sleek gym bottle, or a stylish lifestyle tumbler, our <b className="text-amber-700">Hydro Luxe</b> collection offers unparalleled functionality and modern design to refresh your lifestyle.
        <br />
        <br />
        <div>
          <h1 className="font-bold text-amber-700 text-xl mt-4 mb-2">FAQs</h1>
          <h2 className="font-bold">1. How long do Hydro Luxe bottles keep drinks cold or hot?</h2>
          <b>Answer:</b> Our premium double-wall vacuum-insulated bottles keep cold beverages chilled for up to 24 hours and hot beverages warm for up to 12 hours.
          <h2 className="font-bold">2. Are Hydro Luxe bottles BPA-free?</h2>
          <b>Answer:</b> Yes, absolutely! All of our drinkware items are made from premium 18/8 food-grade stainless steel and are 100% BPA-free, non-toxic, and safe for all types of drinks.
          <h2 className="font-bold">3. Are these bottles leak-proof and sweat-proof?</h2>
          <b>Answer:</b> Yes. The leak-proof lid design prevents any accidental spills, and the advanced vacuum insulation ensures the outer surface remains dry and condensation-free.
          <h2 className="font-bold">4. Can I wash these bottles in a dishwasher?</h2>
          <b>Answer:</b> We recommend hand-washing with a soft bottle brush and warm, soapy water to preserve the premium exterior powder coat and thermal efficiency of the vacuum seal.
        </div>
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
