import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import Ankletdata from "./Ankletdata";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { apiGet } from "../../api/client";
import { CartContext } from "../../context/CartContext";
import CartDesign from "../CartDesignCode/CartDesign";

const Anklets = () => {
  const navigate = useNavigate();

  const [anklets, setAnklets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  const { addItem } = useContext(CartContext);

  useEffect(() => {
    const fetchAnklets = async () => {
      try {
        const response = await apiGet("/products", { category: "anklets" });
        setAnklets(response.data?.products || []);
        const data = response.data?.products;
        console.log(data);
      } catch (err) {
        setError(err.message || "Failed to load Anklets");
      } finally {
        setLoading(false);
      }
    };
    fetchAnklets();
  }, []);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings = {
    dots: true,
    infinite: anklets.length > 4,
    speed: 500,
    slidesToShow:
      viewportWidth < 600
        ? Math.min(1, anklets.length)
        : viewportWidth < 1024
        ? Math.min(2, anklets.length)
        : Math.min(3, anklets.length),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, anklets.length),
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: Math.min(1, anklets.length),
        },
      },
    ],
  };

  if (loading) return <p className="text-center py-6">Loading Anklets...</p>;
  if (error) return <p className="text-center text-red-600 py-6">{error}</p>;

  return (
    <div
      id="anklets"
      className="scroll-mt-24 flex flex-col md:flex-row bg-[#ECEEDF] w-full pb-10 poppins"
    >
      <div className="w-full">
        {/* Heading */}
        <div className="items-center text-center">
          <div className="bg-[#eceacb] py-4 rounded-md">
            <Link
              to="/anklet"
              className="text-4xl poppins-semibold text-[#e28e45] uppercase hover:text-green-600 hover:underline"
            >
              Anklets
            </Link>
            <p className="text-lg poppins-medium text-amber-800">
              Elegant anklets to adorn your feet
            </p>
          </div>
        </div>
        {/* Conditional Rendering */}
        <Slider key={`cat-${viewportWidth}`} {...settings}>
          {anklets.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={() => addItem(product._id)} // ✅ send productId to backend
              onClick={() => navigate(`/category/anklets/${product._id}`)}
            />
          ))}
        </Slider>
      </div>
    </div>
  );
};

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


export default Anklets;
