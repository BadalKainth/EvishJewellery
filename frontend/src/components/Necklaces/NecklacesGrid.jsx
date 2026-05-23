import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { apiGet } from "../../api/client";
import CartDesign from "../CartDesignCode/CartDesign";

const NecklacesGrid = () => {
  const navigate = useNavigate();
  const { addItem } = useContext(CartContext);

  const [necklaces, setNecklaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12; // 12 products per page

  const gridRef = useRef(null); // ✅ Reference for scrolling

  const fetchNecklaces = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const response = await apiGet("/products", {
        category: "necklaces",
        page: pageNumber,
        limit,
      });
      setNecklaces(response.data?.products || []);
      setTotalPages(response.data?.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || "Failed to load Necklaces");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNecklaces(page);

    // ✅ Scroll to grid when page changes
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [page]);

  if (loading) return <p className="text-center py-6">Loading necklaces...</p>;
  if (error) return <p className="text-center text-red-600 py-6">{error}</p>;

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div
      id="necklaces"
      className="scroll-mt-24 flex flex-col bg-[#ECEEDF] w-full pb-10 poppins"
      ref={gridRef} // ✅ attach ref here
    >
      <div className="w-full">
        {/* Heading */}
        <div className="items-center text-center mb-6">
          <div className="bg-[#eceacb] py-4 rounded-md">
            <h2 className="text-4xl poppins-semibold text-[#e28e45] uppercase">
              Aura Decor
            </h2>
            <p className="text-lg poppins-medium text-amber-800">
              Premium Home Decor Collection
            </p>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 px-1 md:px-20 gap-2 md:gap-4 mt-6">
          {necklaces.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={() => addItem(product._id)}
              onClick={() => navigate(`/category/necklaces/${product._id}`)}
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

      {/* Paragraph content for Aura Decor */}
      <div className="p-10 text-xs md:text-base px-6 md:px-20 text-justify poppins-regular">
        <h1 className="font-bold text-base md:text-2xl text-amber-700 text-center p-4">
          Aura Decor – Premium Home Decor Collection
        </h1>
        <p>
          Transform your living spaces into sanctuaries of elegance and warmth with our <b className="text-amber-700">Aura Decor</b> premium home decor collection at <b className="text-amber-700">Avish</b>. Explore sophisticated designs that reflect your personality, elevate your mood, and add a signature touch of aesthetic premium luxury to every corner of your home.
        </p>
        <br />
        <p>
          Every home tells a story through the details. Our collection curated by design experts spans from minimalist table accents and statement wall art to artistic vases, premium cushions, and ambient lighting solutions that effortlessly breathe life and style into modern apartments and houses alike.
        </p>
        <br />
        <p>
          At <b className="text-amber-700">Avish</b>, we blend excellent craftsmanship with high-quality materials to ensure that each piece is not only visually stunning but also built to endure. Whether you are redecorating your cozy living room, upgrading your office desk styling, or searching for the ultimate artistic gift, our home decor pieces offer a perfect balance of contemporary beauty and enduring charm.
        </p>
        <br />
        <p>
          Explore exclusive styles that are modern, elegant, and designed to leave a lasting impression on your guests. Shop the <b className="text-amber-700">Aura Decor</b> collection today and elevate your surrounding environment with the timeless elegance and beauty only <b className="text-amber-700">Avish</b> can bring.
        </p>
        <br />
        <div>
          <h1 className="font-bold text-amber-700 text-xl mt-4 mb-2">FAQs</h1>
          <h2 className="font-bold">1. What materials are used in the Aura Decor collection?</h2>
          <b>Answer:</b> We source premium materials, including handcrafted ceramics, polished metals, mouth-blown glassware, and sustainable natural textiles to construct high-quality, durable home accents.
          <h2 className="font-bold">2. How can I style these items for a minimalist look?</h2>
          <b>Answer:</b> Focus on a few standout pieces, such as our geometric vases or elegant metal accents, and pair them with neutral-toned background colors to let their exquisite craftsmanship shine.
          <h2 className="font-bold">3. Do you offer seasonal home decor collections?</h2>
          <b>Answer:</b> Yes, we frequently update our collection with seasonal launches and limited-edition items designed to match holiday aesthetics, festive vibes, and changing styling trends.
          <h2 className="font-bold">4. What is the best way to clean these delicate decor pieces?</h2>
          <b>Answer:</b> We recommend dusting gently with a clean micro-fiber cloth or using a slightly damp soft cloth for ceramics. Avoid using harsh chemical cleaners to preserve their premium finishes.
        </div>
      </div>
    </div>
  );
};

// ProductCard remains same
const ProductCard = ({ product, addToCart, onClick }) => {
  return (
    <CartDesign 
    product={product} 
    addToCart={addToCart} 
    onClick={onClick} />
  );
};

export default NecklacesGrid;
