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
          <div className="p-10 px-5 md:px-20 text-justify poppins-regular text-xs md:text-base">
            <h1 className="font-bold text-base md:text-2xl text-amber-700 text-center p-4">
              SheVerse: A Tribute to the Queen of Our Universe
            </h1>
            <p>
              Every woman is a masterpiece, strong, brilliant, and uniquely beautiful. Welcome to <b className="text-amber-700">SheVerse</b> by Avish Jewels, an exclusive realm dedicated entirely to the multifaceted modern woman. This collection is a premium curation of lifestyle products, accessories, and essentials that celebrate her grace and power.
            </p>
            <br />
            <p>
              Much like our finest solitaire diamonds, SheVerse products are crafted to stand out, empower, and add an aura of ultimate luxury to her daily life. From self-care indulgence to power-dressing essentials, celebrate yourself or the queen in your life with absolute premium perfection.
            </p>
            <br />
            <h2 className="font-bold text-amber-700">Why It's Unique</h2>
            <p>
              <b>Curated for the Modern Woman:</b> Working professional se lekar home-maker tak, har mahila ki multitasking lifestyle ko dhyan mein rakh kar banaya gaya hai.
            </p>
            <br />
            <p>
              <b>Uncompromised Luxury &amp; Comfort:</b> Chahe lifestyle accessory ho ya self-care product, har ek cheez mein premium comfort aur high-quality feel milti hai.
            </p>
            <br />
            <p>
              <b>The Ultimate Empowerment Collection:</b> Aise designs aur products jo aapke confidence ko boost karte hain aur aapki unique personality ko celebrate karte hain.
            </p>
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
