import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { apiGet } from "../../api/client";
import { CartContext } from "../../context/CartContext";
import CartDesign from "../CartDesignCode/CartDesign";

const Earrings = () => {
  const navigate = useNavigate();

  const [earrings, setEarrings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  const { addItem } = useContext(CartContext);

  useEffect(() => {
    const fetchEarrings = async () => {
      try {
        const response = await apiGet("/products", { category: "earrings" });
        setEarrings(response.data?.products || []);
        const data = response.data?.products;
        console.log(data);
      } catch (err) {
        setError(err.message || "Failed to load Earrings");
      } finally {
        setLoading(false);
      }
    };
    fetchEarrings();
  }, []);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  
  if (loading) return <p className="text-center py-6">Loading Earrings...</p>;
  if (error) return <p className="text-center text-red-600 py-6">{error}</p>;

  const settings = {
    dots: true,
    infinite: earrings.length > 4,
    speed: 500,
    slidesToShow:
      viewportWidth < 600
        ? Math.min(1, earrings.length)
        : viewportWidth < 1024
        ? Math.min(2, earrings.length)
        : Math.min(3, earrings.length),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, earrings.length),
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: Math.min(1, earrings.length),
        },
      },
    ],
  };

  return (
    <div
      id="earrings"
      className="scroll-mt-24 flex flex-col md:flex-row bg-[#ECEEDF] w-full pb-10 poppins"
    >
      <div className="w-full">
        {/* Heading */}
        <div className="items-center text-center mb-6">
          <div className="bg-[#eceacb] py-4 rounded-md">
            <Link
              to="/category/earrings"
              className="text-4xl poppins-semibold text-[#e28e45] uppercase hover:text-green-600 hover:underline"
            >
              Earrings
            </Link>
            <p className="text-lg poppins-medium text-amber-800">
              Elegance that sparkles on your ears
            </p>
          </div>
        </div>

        {/* Slider or Grid */}

        <Slider key={`cat-${viewportWidth}`} {...settings}>
          {earrings.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={() => addItem(product._id)} // ✅ send productId to backend
              onClick={() => navigate(`/category/earrings/${product._id}`)}
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


export default Earrings;
