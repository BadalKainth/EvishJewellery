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
              Earrings
            </h2>
            <p className="text-lg poppins-medium text-amber-800">
              Elegance that completes your style
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

      {/* Existing Paragraphs */}
      <div className="p-10 px-5 md:px-20 text-xs md:text-base text-justify poppins-regular">
        <h1 className="font-bold text-base md:text-2xl text-amber-700 text-center p-4">
          Earrings – Beautiful Earrings Collection to Elevate Your Style
        </h1>
        <p>
          At <b className="text-amber-700">AvishJEWELS</b>, we believe earrings
          are more than just accessories—they are timeless pieces that define
          your style and personality. From minimal everyday studs to elegant
          designs perfect for parties and weddings, our earrings are crafted to
          bring out your inner charm. Each piece from{" "}
          <b className="text-amber-700">AvishJEWELS</b> adds confidence,
          elegance, and sophistication to your overall look.
        </p>
        <br />
        <p>
          The <b className="text-amber-700">AvishJEWELS</b> earring collection
          is designed for every mood and every occasion. If you love simple
          elegance, our minimalistic styles are the perfect choice for daily
          wear. For those who want to make a bold statement,{" "}
          <b className="text-amber-700">AvishJEWELS</b>
          offers unique and trendy designs that stand out effortlessly. Each
          pair is carefully created with attention to detail, ensuring unmatched
          style and comfort.
        </p>
        <br />
        <p>
          Earrings from <b className="text-amber-700">AvishJEWELS</b> are
          versatile enough to complement both casual outfits and special
          occasion looks. Whether you are dressing up for a festive celebration,
          a wedding, or simply want to add sparkle to your everyday attire, our
          collection offers something for everyone. With{" "}
          <b className="text-amber-700">AvishJEWELS</b>, you don’t just wear
          earrings—you wear a story of beauty, grace, and individuality.
        </p>
        <br />
        <p>
          If you’re looking for the perfect gift,{" "}
          <b className="text-amber-700">AvishJEWELS</b>
          earrings are a thoughtful choice that symbolizes love and
          appreciation. Our wide variety of designs ensures that every woman can
          find a pair that resonates with her personality and complements her
          unique style.
        </p>
        <br />
        <p>
          Choose <b className="text-amber-700">AvishJEWELS</b> to discover
          earrings that are modern, elegant, and designed to leave a lasting
          impression. Shop our exclusive earring collection today and elevate
          your look with the beauty and charm only{" "}
          <b className="text-amber-700">AvishJEWELS</b> can bring.
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
