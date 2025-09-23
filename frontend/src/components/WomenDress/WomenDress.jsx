import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
// import braceletsdata from "./BraceletsData";
import { apiGet } from "../../api/client";
import { CartContext } from "../../context/CartContext";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CartDesign from "../CartDesignCode/CartDesign";

const WomenDress = () => {
  const navigate = useNavigate();

  const [womendress, setwomendress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  const { addItem } = useContext(CartContext);

  useEffect(() => {
    const fetchwomendress = async () => {
      try {
        const response = await apiGet("/products", { category: "women-dress" });
        setwomendress(response.data?.products || []);
        const data = response.data?.products;
        console.log(data);
      } catch (err) {
        setError(err.message || "Failed to load womendress");
      } finally {
        setLoading(false);
      }
    };
    fetchwomendress();
  }, []);
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) return <p className="text-center py-6">Loading Women Dress...</p>;
  if (error) return <p className="text-center text-red-600 py-6">{error}</p>;

  const settings = {
    dots: true,
    infinite: womendress.length > 4,
    speed: 500,
    slidesToShow:
      viewportWidth < 600
        ? Math.min(1, womendress.length)
        : viewportWidth < 1024
        ? Math.min(2, womendress.length)
        : Math.min(3, womendress.length),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, womendress.length),
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: Math.min(1, womendress.length),
        },
      },
    ],
  };

  return (
    <div
      id="womendress"
      className="scroll-mt-24 flex flex-col md:flex-row bg-[#ECEEDF] w-full pb-10"
    >
      <div className="w-full">
        <div className="items-center text-center">
          <div className="bg-[#eceacb] py-4 rounded-md">
            <Link
              to="/bracelets"
              className="text-4xl poppins-semibold text-[#e28e45] uppercase hover:text-green-600 hover:underline"
            >
              Women Dress
            </Link>
            <p className="text-lg poppins-medium text-amber-800">
              Elegance that shines on your wrist
            </p>
          </div>
        </div>

        <Slider key={`cat-${viewportWidth}`} {...settings}>
          {womendress.map((product) => (
            <div key={product.id}>
              <ProductCard
                product={product}
                addToCart={() => addItem(product._id)} // ✅ send productId to backend
                onClick={() => navigate(`/category/womendress/${product._id}`)}
              />
            </div>
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

export default WomenDress