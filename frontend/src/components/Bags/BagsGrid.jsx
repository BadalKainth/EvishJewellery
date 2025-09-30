import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../../api/client";
import { CartContext } from "../../context/CartContext";
import CartDesign from "../CartDesignCode/CartDesign";

const BagsGrid = () => {
  const navigate = useNavigate();
  const { addItem } = useContext(CartContext);

  const [bags, setBags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  const gridRef = useRef(null);

  const fetchBags = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const response = await apiGet("/products", {
        category: "bags",
        page: pageNumber,
        limit,
      });
      setBags(response.data?.products || []);
      setTotalPages(response.data?.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || "Failed to load bags");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBags(page);
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [page]);

  if (loading) return <p className="text-center py-6">Loading bags...</p>;
  if (error) return <p className="text-center text-red-600 py-6">{error}</p>;

  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);

  return (
    <div
      className="scroll-mt-24 flex flex-col bg-[#ECEEDF] w-full pb-10 md:px-10"
      ref={gridRef}
    >
      <div className="w-full">
        <div className="items-center text-center">
          <div className="bg-[#eceacb] py-4 rounded-md">
            <h2 className="text-4xl poppins-semibold text-[#e28e45] uppercase">
              Bags
            </h2>
            <p className="text-lg poppins-medium text-amber-800">
              Elegance that shines on your wrist
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 px-1 md:px-20 gap-2 md:gap-4 mt-6">
          {bags.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={() => addItem(product._id)}
              onClick={() => navigate(`/category/bags/${product._id}`)}
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

        {/* Add your Bags description or content here */}
        <div className="p-10 px-5 md:px-20 text-justify poppins-regular text-xs md:text-base">
          <h1 className="font-bold text-base md:text-2xl text-amber-700 text-center p-4">
            Bags – Stylish & Trendy Bags Collection Online
          </h1>
          <p>
            Complete your look with{" "}
            <b className="text-amber-700">AvishJEWELS</b> Bags – a perfect
            combination of fashion, utility, and elegance. From chic handbags to
            classy clutches and spacious totes,{" "}
            <b className="text-amber-700">AvishJEWELS</b>
            brings you a stylish range of bags designed to suit every mood and
            occasion.
          </p>
          <br />
          <p>
            At <b className="text-amber-700">AvishJEWELS</b>, we believe bags
            are more than just accessories – they are a reflection of your
            lifestyle and personality. Whether you’re heading to work, attending
            a party, or enjoying a casual outing, our carefully curated bag
            collection ensures you always make a style statement.
          </p>
          <br />
          <h2 className="font-bold text-amber-700">
            Trendy Bags for Every Occasion
          </h2>
          <p>
            Discover the latest designs in handbags, clutches, slings,
            backpacks, and more. Each{" "}
            <b className="text-amber-700">AvishJEWELS</b> bag is designed to
            balance comfort with style, offering enough space while still being
            trendy. Our collection fits perfectly with both traditional and
            modern outfits, making them a versatile choice for every woman.
          </p>
          <br />
          <h2 className="font-bold text-amber-700">
            Why Choose AvishJEWELS Bags?
          </h2>
          <p>
            Choosing <b className="text-amber-700">AvishJEWELS</b> bags means
            adding a timeless accessory to your wardrobe. From high-quality
            materials to stylish detailing, every bag is made to last while
            keeping you on-trend. Perfect as daily essentials or as gifts,{" "}
            <b className="text-amber-700">AvishJEWELS</b>
            bags redefine fashion with practicality.
          </p>
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

export default BagsGrid;
