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
              Necklaces
            </h2>
            <p className="text-lg poppins-medium text-amber-800">
              Elegance that sparkles around your neck
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

      {/* Paragraph content (unchanged) */}
      <div className="p-10 text-xs md:text-base px-6 md:px-20 text-justify poppins-regular">
        <b>Necklaces – Modern & Traditional Necklace Designs Online</b>
        <br />
        Find traditional and modern necklace designs online. Shop designer, best
        necklaces for weddings, occasions, every day.
        <br />
        <br />
        Necklaces are one of the most beloved pieces of jewelry, representing
        elegance, beauty and individuality. Whether it is a simple modern
        necklace for daily wear or a comprehensive traditional necklace for
        weddings, cultural events or festival occasions, necklaces lend charm
        and purpose to every outfit. In our online store, you will discover an
        exquisite variety of designer necklaces for sale in an array of styles,
        including necklaces, diamond necklaces, statement chokers or layered
        necklaces that can be worn as trendy or contemporary necklaces. Each
        necklace is designed with meticulous precision, bringing together
        classic tradition with modern style. You will discover more than just
        necklaces, you will find necklaces that embrace your style and make
        moments more memorable! A necklace is more than just an accessory, it is
        a timeless piece of jewelry to finish any look or reflect your
        creativity. Whether you are gazing at intricate traditional necklaces,
        wearing simple modern and diamond link necklaces, there are a world of
        necklaces and styles that have the ability to unlock your outfit or
        special occasion. Whether you are looking for elegance in daily wear, a
        gift for a loved one, or bridal jewelry that makes a statement, you will
        find an exclusive private collection of necklaces for every style and
        occasion.
        <br />
        <br />
        {/* … rest of paragraph content unchanged … */}
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
