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
              Couple Sets
            </h2>
            <p className="text-lg poppins-medium text-amber-800">
              Perfectly paired elegance for you and your partner
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

      {/* Existing Paragraphs */}
      <div className="p-10 px-5 md:px-20 text-justify poppins-regular text-xs md:text-base">
        <h1 className="font-bold text-base md:text-2xl text-amber-700 text-center p-4">
          Couple Sets – Matching Jewelry Sets for Couples in Love
        </h1>
        <p>
          Celebrate love with <b className="text-amber-700">AvishJEWELS</b>{" "}
          Couple Sets - Matching Jewelry for couples. Shop matching necklaces,
          matching bracelets and personalized jewelry gifts online. Great for
          weddings, anniversaries and more.
        </p>
        <br />
        <p>
          Love should be celebrated in every way, large and small! What better
          way to celebrate love than with{" "}
          <b className="text-amber-700">AvishJEWELS</b> Couple Sets - Matching
          Jewelry Sets for Couples in Love? Jewelry is more than just a style
          statement, it holds emotions, memories and connection. Matching Couple
          Jewelry is the newest trend for couples in love! With{" "}
          <b className="text-amber-700">AvishJEWELS</b>, couples can proudly
          wear their bond in a stylish and personal way. Whether you choose
          matching necklaces, matching bracelets, or a complete set, couples can
          carry a little of each other wherever they go.
        </p>
        <br />
        <h2 className="font-bold text-amber-700">
          Matching Couple Jewelry Sets
        </h2>
        <p>
          <b className="text-amber-700">AvishJEWELS</b> Matching Couple Jewelry
          Sets are more than just accessories; they represent togetherness and
          connection. Usually sold in pairs, they feature designs that are the
          same or complementary to each other, symbolizing two people's love for
          one another. There are lots of styles to choose from, including
          pendants, chains, charm bracelets, or rings. With
          <b className="text-amber-700"> AvishJEWELS</b>, couples get the unique
          opportunity to feel connected, even if they are miles apart.
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
