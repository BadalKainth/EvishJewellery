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
      className="scroll-mt-24 flex flex-col theme-page-bg w-full poppins"
      ref={gridRef}
    >
      <div className="w-full">
        {/* Heading */}
        <div className="items-center text-center mb-6">
          <div className="theme-page-panel py-4 rounded-md">
            <h2 className="text-4xl poppins-semibold theme-page-title uppercase">
              New Launches
            </h2>
            <p className="text-lg poppins-medium theme-page-subtitle">
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

      <div className="p-10 px-5 md:px-20 text-justify poppins-regular text-xs md:text-base">
        <h1 className="font-bold text-base md:text-2xl theme-copy-accent text-center p-4">
          New Launches: The Next Chapter of Brilliance
        </h1>
        <p>
          Innovation, elegance, and exclusivity come together in our latest reveal. The <b className="theme-copy-accent">New Launches</b> section at Avish Jewels is where tomorrow's trends meet today's craftsmanship. We are constantly pushing the boundaries of luxury to bring you fresh, unique, and breathtaking designs before anyone else.
        </p>
        <br />
        <p>
          Be the trendsetter and explore our newest arrivals, ranging from cutting-edge lifestyle products to premium statements. Don't just follow the trend; wear the future of luxury first.
        </p>
        <br />
        <h2 className="font-bold theme-copy-accent">Why It's Unique</h2>
        <p>
          <b>Trendsetter Collection:</b> Sabse pehle market mein aane wale latest global designs jo aapko hamesha bheed se alag rakhte hain.
        </p>
        <br />
        <p>
          <b>Limited Edition Pieces:</b> Is category ke kayi products limited stock mein aate hain, jo aapko ek exclusive owner banate hain.
        </p>
        <br />
        <p>
          <b>Upgraded Innovation:</b> Purane designs se behtar, zyada durable aur modern features ke sath har hafte naye additions.
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

export default CoupleSetsGrid;
