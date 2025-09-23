import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
// import Ringsdata from "./Ringsdata";
import { apiGet } from "../../api/client";
import { CartContext } from "../../context/CartContext";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CartDesign from "../CartDesignCode/CartDesign";

const Rings = () => {
  const navigate = useNavigate();

  const [rings, setRings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  const { addItem } = useContext(CartContext);

  useEffect(() => {
    const fetchRings = async () => {
      try {
        const response = await apiGet("/products", { category: "rings" });
        setRings(response.data?.products || []);
        const data = response.data?.products;
        console.log(data);
      } catch (err) {
        setError(err.message || "Failed to load rings");
      } finally {
        setLoading(false);
      }
    };
    fetchRings();
  }, []);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings = {
    dots: true,
    infinite: rings.length > 4,
    speed: 500,
    slidesToShow:
      viewportWidth < 600
        ? Math.min(1, rings.length)
        : viewportWidth < 1024
        ? Math.min(2, rings.length)
        : Math.min(3, rings.length),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, rings.length),
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: Math.min(1, rings.length),
        },
      },
    ],
  };

  if (loading) return <p className="text-center py-6">Loading rings...</p>;
  if (error) return <p className="text-center text-red-600 py-6">{error}</p>;

  return (
    <div
      id="rings"
      className="scroll-mt-24 flex flex-col md:flex-row bg-[#ECEEDF] w-full pb-10"
    >
      <div className="w-full">
        <div className="items-center text-center">
          <div className="bg-[#eceacb] py-4 rounded-md">
            <Link
              to="/rings"
              className="text-4xl poppins-semibold text-[#e28e45] uppercase hover:text-green-600 hover:underline"
            >
              Rings
            </Link>
            <p className="text-lg poppins-medium text-amber-800">
              Elegance that sparkles on your fingers
            </p>
          </div>
        </div>

        <Slider key={`cat-${viewportWidth}`} {...settings}>
          {rings.map((product) => (
            <div key={product.id}>
              <ProductCard
                product={product}
                addToCart={() => addItem(product._id)} // ✅ send productId to backend
                onClick={() => navigate(`/category/rings/${product._id}`)}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

// Product Card
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


export default Rings;
