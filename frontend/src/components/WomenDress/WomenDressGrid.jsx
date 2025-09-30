import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../../api/client";
import { CartContext } from "../../context/CartContext";
import CartDesign from "../CartDesignCode/CartDesign";

const WomenDressGrid = () => {
  const navigate = useNavigate();
  const { addItem } = useContext(CartContext);

  const [womendress, setWomendress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  const gridRef = useRef(null);

  const fetchWomenDress = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const response = await apiGet("/products", {
        category: "women-dress",
        page: pageNumber,
        limit,
      });
      setWomendress(response.data?.products || []);
      setTotalPages(response.data?.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || "Failed to load women dresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWomenDress(page);
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [page]);

  if (loading)
    return <p className="text-center py-6">Loading Women Dress...</p>;
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
              Women Dress
            </h2>
            <p className="text-lg poppins-medium text-amber-800">
              Elegance that elevates your style
            </p>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 px-1 md:px-20 gap-2 md:gap-4 mt-6">
          {womendress.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={() => addItem(product._id)}
              onClick={() => navigate(`/category/womendress/${product._id}`)}
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

      {/* Add Women Dress description here */}
      <div className="p-10 px-5 md:px-20 text-justify poppins-regular text-xs md:text-base">
        <h1 className="font-bold text-base md:text-2xl text-amber-700 text-center p-4">
          Women Dresses – Trendy & Elegant Dress Collection
        </h1>
        <p>
          Explore the latest collection of women’s dresses at{" "}
          <b className="text-amber-700">AvishJEWELS</b>. From casual wear to
          party-ready outfits, our dresses are designed to enhance your style
          and confidence. Choose from chic dresses, maxi dresses, ethnic wear,
          and modern fusion styles to suit every occasion and mood.
        </p>
        <br />
        <p>
          At <b className="text-amber-700">AvishJEWELS</b>, every dress is
          crafted with attention to detail and a focus on comfort, fit, and
          style. Our collection blends contemporary fashion trends with timeless
          elegance, ensuring that every outfit makes a statement while keeping
          you comfortable all day.
        </p>
        <br />
        <h2 className="font-bold text-amber-700">
          Trendy Styles for Every Occasion
        </h2>
        <p>
          Discover a variety of styles including casual dresses, party dresses,
          maxi gowns, ethnic dresses, and modern fusion wear. Each{" "}
          <b className="text-amber-700">AvishJEWELS</b>
          dress is designed to complement your personality, whether you are
          heading to work, attending a special event, or enjoying a casual
          outing. Our dresses are versatile, fashionable, and perfect for all
          seasons.
        </p>
        <br />
        <h2 className="font-bold text-amber-700">
          Why Choose AvishJEWELS Women Dresses?
        </h2>
        <p>
          Choosing <b className="text-amber-700">AvishJEWELS</b> dresses means
          choosing style, comfort, and quality. Each piece is carefully designed
          to enhance your look and make you feel confident. With a wide range of
          options, from everyday wear to festive and party dresses,{" "}
          <b className="text-amber-700">AvishJEWELS</b>
          ensures that every outfit becomes a part of your style statement.
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

export default WomenDressGrid;
