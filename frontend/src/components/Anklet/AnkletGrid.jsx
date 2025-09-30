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
              Anklets
            </h2>
            <p className="text-lg poppins-medium text-amber-800">
              Elegant anklets to adorn your feet
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
          {/* Your long anklets paragraph content remains unchanged */}
          <div className="p-10 px-5 md:px-20 text-justify poppins-regular text-xs md:text-base">
            <h1 className="font-bold text-base md:text-2xl text-amber-700 text-center p-4">
              Anklets – Stylish Anklets Collection for Every Occasion
            </h1>
            <p>
              Add charm to your steps with{" "}
              <b className="text-amber-700">AvishJEWELS</b> Anklets. Discover a
              wide variety of trendy anklets designed to enhance your style and
              personality. Whether you are dressing up for a festive occasion, a
              casual outing, or simply want to add a touch of elegance to your
              everyday look, <b className="text-amber-700">AvishJEWELS</b>{" "}
              anklets are the perfect choice.
            </p>
            <br />
            <p>
              At <b className="text-amber-700">AvishJEWELS</b>, every anklet is
              crafted with care to bring out the beauty of simplicity and
              sophistication. From minimalistic chain anklets to elegant charm
              anklets, we have designs that match every personality. These
              anklets are lightweight, comfortable to wear, and add a graceful
              finishing touch to your look.
            </p>
            <br />
            <h2 className="font-bold text-amber-700">Trendy Anklet Styles</h2>
            <p>
              Explore <b className="text-amber-700">AvishJEWELS</b> trendy
              anklet styles that perfectly blend fashion with comfort. Whether
              you prefer delicate single-chain anklets, multi-layer anklets, or
              anklets with quirky charms,
              <b className="text-amber-700"> AvishJEWELS</b> has something
              special for you. Each anklet is designed to make your every step
              more stylish and confident.
            </p>
            <br />
            <h2 className="font-bold text-amber-700">
              Why Choose AvishJEWELS Anklets?
            </h2>
            <p>
              Choosing <b className="text-amber-700">AvishJEWELS</b> anklets
              means choosing timeless style, comfort, and durability. Our
              collection is made keeping today’s fashion trends in mind, while
              still providing versatile pieces that never go out of style.
              Perfect as a gift or for personal use,
              <b className="text-amber-700"> AvishJEWELS</b> anklets let you
              express your individuality with elegance.
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
