import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
// import braceletsdata from "./BraceletsData";
import { apiGet, getImageURL } from "../../api/client";
import { CartContext } from "../../context/CartContext";


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CartDesign from "../CartDesignCode/CartDesign";

const Watch = () => {
  const navigate = useNavigate();

  const [watch, setwatch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  const { addItem } = useContext(CartContext);

  useEffect(() => {
    const fetchwatch = async () => {
      try {
        const response = await apiGet("/products", { category: "watch" });
        setwatch(response.data?.products || []);
        const data = response.data?.products;
        console.log(data);
      } catch (err) {
        setError(err.message || "Failed to load watch");
      } finally {
        setLoading(false);
      }
    };
    fetchwatch();
  }, []);
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  
  if (loading) return <p className="text-center py-6">Loading watch...</p>;
  if (error) return <p className="text-center text-red-600 py-6">{error}</p>;

  const settings = {
    dots: true,
    infinite: watch.length > 4,
    speed: 500,
    slidesToShow:
      viewportWidth < 600
        ? Math.min(1, watch.length)
        : viewportWidth < 1024
        ? Math.min(2, watch.length)
        : Math.min(3, watch.length),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, watch.length),
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: Math.min(1, watch.length),
        },
      },
    ],
  };

  return (
    <div
      id="watch"
      className="scroll-mt-24 flex flex-col md:flex-row bg-[#ECEEDF] w-full pb-10"
    >
      <div className="w-full">
        <div className="items-center text-center">
          <div className="bg-[#eceacb] py-4 rounded-md">
            <Link
              to="/category/watch"
              className="text-4xl poppins-semibold text-[#e28e45] uppercase hover:text-green-600 hover:underline"
            >
              Watch
            </Link>
            <p className="text-lg poppins-medium text-amber-800">
              Elegance that shines on your wrist
            </p>
          </div>
        </div>

        <Slider key={`cat-${viewportWidth}`} {...settings}>
          {watch.map((product) => (
            <div key={product.id}>
              <ProductCard
                product={product}
                addToCart={() => addItem(product._id)} // ✅ send productId to backend
                onClick={() => navigate(`/category/watch/${product._id}`)}
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

      {/* <div className="px-2 relative poppins">
      {showPopup && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md z-50">
          Added to Cart!
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="relative overflow-hidden">
          <img
            onClick={onClick}
            src={getImageURL(product.images[0]?.url || product.images[0])}
            alt={product.images[0]?.alt || product.name}
            loading="lazy"
            className="w-full h-64 object-cover cursor-pointer"
          />
          {product.tags && (
            <span
              className={`absolute top-3 right-3 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow ${
                product.tags === "SALE" ? "bg-red-500" : "bg-amber-500"
              }`}
            >
              {product.tags}
            </span>
          )}
        </div>

        <div className="py-4 px-4">
          <h3 className="flex justify-between">
            <span className="font-semibold uppercase text-lg">
              {product.name}
            </span>
            <span className="text-green-600 font-medium text-lg">
              Size No: {product.size}
            </span>
          </h3>
          <p className="text-sm text-gray-800 mt-1 line-clamp-2">
            {product.description}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Delivery: ₹ {product.deliveryCharge || 99}
          </p>

          <div className="flex justify-between items-center mt-4">
            <div className="flex flex-col font-bold text-amber-600 text-lg">
              <span>
                Price:{" "}
                <span className="line-through decoration-2 decoration-amber-700 text-2xl">
                  ₹{product.originalPrice}
                </span>
              </span>
              <span className="font-bold text-green-600 text-lg">
                Discounted price : ₹{product.price}
              </span>
              <span className="text-sm text-gray-600 line-clamp-1 animate-pulse">
                🎉 You saved ₹{discount} ({discountPercent}% OFF)
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div> */}
    </>
  );
};

// Custom Arrows
function SampleNextArrow({ className, onClick }) {
  return (
    <div
      className={`${className} !right-2`}
      style={{
        display: "block",
        background: "white",
        borderRadius: "50%",
        width: "25px",
        height: "25px",
        zIndex: 2,
      }}
      onClick={onClick}
    />
  );
}
function SamplePrevArrow({ className, onClick }) {
  return (
    <div
      className={`${className} !left-2`}
      style={{
        display: "block",
        background: "white",
        borderRadius: "50%",
        width: "25px",
        height: "25px",
        zIndex: 2,
      }}
      onClick={onClick}
    />
  );
}

export default Watch;
