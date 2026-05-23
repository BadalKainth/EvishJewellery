import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../../api/client";
import { CartContext } from "../../context/CartContext";
import CartDesign from "../CartDesignCode/CartDesign";

const AnkletGrid = () => {
  const navigate = useNavigate();
  const { addItem } = useContext(CartContext);

  const [anklets, setAnklets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  const gridRef = useRef(null);

  const fetchAnklets = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const response = await apiGet("/products", {
        category: "anklets",
        page: pageNumber,
        limit,
      });
      setAnklets(response.data?.products || []);
      setTotalPages(response.data?.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || "Failed to load Anklets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnklets(page);
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [page]);

  if (loading) return <p className="text-center py-6">Loading anklets...</p>;
  if (error) return <p className="text-center text-red-600 py-6">{error}</p>;

  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);

  return (
    <div
      className="scroll-mt-24 flex flex-col bg-[#ECEEDF] w-full pb-10 p-0 md:px-10"
      ref={gridRef}
    >
      <div className="w-full">
        <div className="items-center text-center">
          <div className="bg-[#eceacb] py-4 rounded-md">
            <h2 className="text-4xl poppins-semibold text-[#e28e45] uppercase">
              SheVerse
            </h2>
            <p className="text-lg poppins-medium text-amber-800">
              All Women-Related Products
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 px-1 md:px-20 gap-2 md:gap-4 mt-6">
          {anklets.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={() => addItem(product._id)}
              onClick={() => navigate(`/category/anklets/${product._id}`)}
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

        <div className="text-justify">
          {/* Paragraphs for SheVerse */}
          <div className="p-10 px-5 md:px-20 text-justify poppins-regular text-xs md:text-base">
            <h1 className="font-bold text-base md:text-2xl text-amber-700 text-center p-4">
              SheVerse – All Women-Related Products Collection
            </h1>
            <p>
              Welcome to <b className="text-amber-700">SheVerse</b> at <b className="text-amber-700">Avish</b>. Celebrate womanhood with our exclusive, carefully curated catalog of apparel, lifestyle accessories, personal care items, and unique products made specifically for today's dynamic woman. Discover pieces that perfectly enhance your everyday routines, confidence, and comfort.
            </p>
            <br />
            <p>
              Every woman deserves products that are designed with her unique needs and style in mind. From elegant daily essentials to luxury self-care treats, our collection offers a diverse array of handpicked items that merge high durability with exquisite feminine aesthetics.
            </p>
            <br />
            <p>
              Whether you are pampering yourself, updating your routine, or searching for the perfect thoughtful gift for an important woman in your life, <b className="text-amber-700">SheVerse</b> provides high-quality solutions designed to delight.
            </p>
            <br />
            <div>
              <h1 className="font-bold text-amber-700 text-xl mt-4 mb-2">FAQs</h1>
              <h2 className="font-bold">1. What kind of products can I find in the SheVerse collection?</h2>
              <b>Answer:</b> The SheVerse collection features a diverse catalog of women's lifestyle essentials, fashion accessories, self-care items, apparel, and premium personal accessories.
              <h2 className="font-bold">2. Are these products suitable for all age groups?</h2>
              <b>Answer:</b> Yes, our selection includes versatile products designed to suit teenagers, young adults, professionals, and mothers alike.
              <h2 className="font-bold">3. How often do you introduce new items to SheVerse?</h2>
              <b>Answer:</b> We update our inventory with seasonal style refreshes and trendy daily additions so you can stay in tune with the latest contemporary trends.
              <h2 className="font-bold">4. Can I buy these items as gifts?</h2>
              <b>Answer:</b> Absolutely! Our premium packaging and curated products make SheVerse the ultimate destination for gifting mothers, sisters, partners, or friends on birthdays, anniversaries, and holidays.
            </div>
          </div>
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

export default AnkletGrid;
