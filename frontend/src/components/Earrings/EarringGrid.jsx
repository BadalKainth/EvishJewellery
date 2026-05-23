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
              Smart Living
            </h2>
            <p className="text-lg poppins-medium text-amber-800">
              Home &amp; Kitchen Essentials
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

      {/* Existing Paragraphs for Smart Living */}
      <div className="p-10 px-5 md:px-20 text-xs md:text-base text-justify poppins-regular">
        <h1 className="font-bold text-base md:text-2xl text-amber-700 text-center p-4">
          Smart Living – Innovative Home & Kitchen Essentials
        </h1>
        <p>
          Welcome to <b className="text-amber-700">Smart Living</b> at <b className="text-amber-700">Avish</b>, where functionality meets modern elegance. Discover our exclusive range of smart home and kitchen essentials designed to simplify your everyday chores, organize your living spaces, and elevate your cooking experience. We bring you products that combine durability, cutting-edge convenience, and elegant aesthetics.
        </p>
        <br />
        <p>
          The modern kitchen and home require modern solutions. Our curated collection focuses on high-quality kitchenware, innovative storage containers, culinary gadgets, and home organization accessories that make your daily routines smoother and highly efficient.
        </p>
        <br />
        <p>
          At <b className="text-amber-700">Avish</b>, we understand that a well-equipped home is a happy home. Whether you are upgrading your culinary tools, finding space-saving storage solutions, or searching for practical household items, our <b className="text-amber-700">Smart Living</b> products are built to perform and last, ensuring a perfect balance of utility and visual charm.
        </p>
        <br />
        <p>
          If you are looking for smart housewarming gifts or looking to elevate your own kitchen setup, our selection provides a wide variety of sleek options. From beginner cooks to seasoned homemakers, everyone will find tools that resonate with their needs.
        </p>
        <br />
        <p>
          Choose <b className="text-amber-700">Smart Living</b> to embrace a seamless, organized, and elegant lifestyle. Shop our premium collection today and transform your living and dining spaces into hubs of style and modern efficiency.
        </p>
        <br />
        <div>
          <h1 className="font-bold text-amber-700 text-xl mt-4 mb-2">FAQs</h1>
          <h2 className="font-bold">1. Are the Smart Living kitchen utensils safe for cooking?</h2>
          <b>Answer:</b> Yes, absolutely. All of our kitchen utensils and food storage accessories are made from premium, food-grade, heat-resistant, and BPA-free materials that are highly safe for hot and cold food preparation.
          <h2 className="font-bold">2. Do your products come with instructions?</h2>
          <b>Answer:</b> Yes, where applicable, our appliances and innovative kitchen gadgets come with clear, detailed user manuals to guide you through setup, usage, and maintenance.
          <h2 className="font-bold">3. How do I maintain and clean these kitchen tools?</h2>
          <b>Answer:</b> Most of our products are dishwasher-safe. For items with premium non-stick coatings or wooden elements, we recommend gentle hand-washing with a soft sponge to extend their life.
          <h2 className="font-bold">4. Can these items be gifted for housewarming ceremonies?</h2>
          <b>Answer:</b> Definitely! Our Smart Living collection features exceptionally practical, beautifully boxed items that make incredibly thoughtful and appreciated housewarming, wedding, or festival gifts.
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

export default EarringsGrid;
