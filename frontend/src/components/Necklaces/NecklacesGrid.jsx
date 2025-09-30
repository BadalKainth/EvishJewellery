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
        <h1 className="font-bold text-base md:text-2xl text-amber-700 text-center p-4">
          Necklaces – Modern & Traditional Necklace Designs Online
        </h1>
        <p>
          At <b className="text-amber-700">AvishJEWELS</b>, necklaces are not
          just accessories—they are timeless pieces that represent elegance,
          beauty, and individuality. Whether it is a simple modern necklace for
          daily wear or a traditional necklace for weddings, festivals, and
          cultural occasions, every design from{" "}
          <b className="text-amber-700">AvishJEWELS</b> adds charm and
          sophistication to your style.
        </p>
        <br />
        <p>
          The <b className="text-amber-700">AvishJEWELS</b> necklace collection
          brings together modern trends with classic traditions. From statement
          chokers to layered designs, from minimal everyday wear to grand
          occasion pieces, each necklace is crafted with precision and passion.
          Every creation from
          <b className="text-amber-700"> AvishJEWELS</b> is made to highlight
          your personality and make every moment memorable.
        </p>
        <br />
        <p>
          A necklace from <b className="text-amber-700">AvishJEWELS</b> is more
          than just a piece of jewelry—it is an expression of your creativity
          and individuality. Whether you are choosing a design for daily wear,
          gifting a loved one, or selecting something unique for bridal and
          festive occasions, our necklaces bring a perfect balance of beauty and
          versatility.
        </p>
        <br />
        <p>
          Explore exclusive collections only at{" "}
          <b className="text-amber-700">AvishJEWELS</b>. Our wide range ensures
          you can always find the perfect piece to match your outfit, occasion,
          and personality. Choose <b className="text-amber-700">AvishJEWELS</b>
          necklaces to elevate your look with timeless elegance and unmatched
          charm.
        </p>
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
