import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
// import braceletsdata from "./BraceletsData";
import { apiGet } from "../../api/client";
import { CartContext } from "../../context/CartContext";


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Bracelets = () => {
  const navigate = useNavigate();
  
    const [bracelets, setbracelets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
  
    const { addItem } = useContext(CartContext);
  
    useEffect(() => {
      const fetchbracelets = async () => {
        try {
          const response = await apiGet("/products", { category: "bracelets" });
          setbracelets(response.data?.products || []);
          const data = response.data?.products;
          console.log(data);
        } catch (err) {
          setError(err.message || "Failed to load Bracelets");
        } finally {
          setLoading(false);
        }
      };
      fetchbracelets();
    }, []);
  

  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    accessibility: false,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div
      id="bracelets"
      className="scroll-mt-24 flex flex-col md:flex-row bg-[#ECEEDF] w-full pb-10"
    >
      <div className="w-full">
        <div className="items-center text-center">
          <div className="bg-[#eceacb] py-4 rounded-md">
            <Link
              to="/bracelets"
              className="text-4xl poppins-semibold text-[#e28e45] uppercase hover:text-green-600 hover:underline"
            >
              Bracelet
            </Link>
            <p className="text-lg poppins-medium text-amber-800">
              Elegance that shines on your wrist
            </p>
          </div>
        </div>

        <Slider {...settings}>
          {bracelets.map((product) => (
            <div key={product.id}>
              <ProductCard
                product={product}
                addToCart={() => addItem(product._id)} // ✅ send productId to backend
                onClick={() => navigate(`/category/bracelets/${product._id}`)}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

const ProductCard = ({ product, addToCart, onClick }) => {
  const [showPopup, setShowPopup] = useState(false);

  const discount = product.originalPrice - product.price;
  const discountPercent = Math.round((discount / product.originalPrice) * 100);

 const handleAddToCart = async (e) => {
   e.stopPropagation();
   await addToCart(); // ✅ calls CartContext.addItem(product.id)
   setShowPopup(true);
   setTimeout(() => setShowPopup(false), 1500);
 };

  return (
    <div className="px-2 relative poppins">
      {showPopup && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md z-50">
          Added to Cart!
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="relative overflow-hidden">
          <img
            onClick={onClick}
            src={product.images[0]}
            alt={product.name}
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

        <div className="py-4 px-2 md:px-32">
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
    </div>
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

export default Bracelets;
