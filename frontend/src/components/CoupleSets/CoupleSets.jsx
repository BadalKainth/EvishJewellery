import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CartContext } from "../../context/CartContext";
import { apiGet } from "../../api/client";
import CartDesign from "../CartDesignCode/CartDesign";

const CoupleSets = () => {
  const navigate = useNavigate();

  const [coupleSets, setCoupleSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  const { addItem } = useContext(CartContext);

  useEffect(() => {
    const fetchCoupleSets = async () => {
      try {
        const response = await apiGet("/products", {
          category: "couple-sets",
        });
        setCoupleSets(response.data?.products || []);
        const data = response.data?.products;
        console.log(data);
      } catch (err) {
        setError(err.message || "Failed to load CoupleSets");
      } finally {
        setLoading(false);
      }
    };
    fetchCoupleSets();
  }, []);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings = {
    dots: true,
    infinite: coupleSets.length > 4,
    speed: 500,
    slidesToShow:
      viewportWidth < 600
        ? Math.min(1, coupleSets.length)
        : viewportWidth < 1024
        ? Math.min(2, coupleSets.length)
        : Math.min(3, coupleSets.length),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, coupleSets.length),
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: Math.min(1, coupleSets.length),
        },
      },
    ],
  };

  if (loading) return <p className="text-center py-6">Loading Couple Sets...</p>;
  if (error) return <p className="text-center text-red-600 py-6">{error}</p>;

  return (
    <div
      id="couple_sets"
      className="scroll-mt-24 flex flex-col md:flex-row bg-[#ECEEDF] w-full pb-10"
    >
      <div className="w-full">
        {/* Heading */}
        <div className="items-center text-center">
          <div className="bg-[#eceacb] py-4 rounded-md">
            <Link
              to="/category/couplesets"
              className="text-4xl poppins-semibold text-[#e28e45] uppercase hover:text-green-600 hover:underline"
            >
              Couple Sets
            </Link>
            <p className="text-lg poppins-medium text-amber-800">
              Perfectly paired elegance for you and your partner
            </p>
          </div>
        </div>

        {/* Conditional Rendering */}

        <Slider key={`cat-${viewportWidth}`} {...settings}>
          {coupleSets.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={() => addItem(product._id)} // ✅ send productId to backend
              onClick={() => navigate(`/category/couplesets/${product._id}`)}
            />
          ))}
        </Slider>
      </div>
    </div>
  );
};

// ==================== PRODUCT CARD ====================
const ProductCard = ({ product, addToCart, onClick }) => {

  return (
    <>
    <CartDesign
    product={product} 
      addToCart={addToCart} 
      onClick={onClick}
      />
    </>
  );
};


export default CoupleSets;
