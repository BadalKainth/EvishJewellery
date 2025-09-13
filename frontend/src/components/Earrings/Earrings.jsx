import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import Earringsdata from "./Earringsdata";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Earrings = ({ slider = true, addToCart }) => {
  const navigate = useNavigate();

  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
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
              to="/earringsgrid"
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
        {slider ? (
          <Slider {...settings}>
            {Earringsdata.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
                onClick={() => navigate(`/earrings/${product.id}`)}
              />
            ))}
          </Slider>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-5 md:px-20 gap-4 mt-6">
            {Earringsdata.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
                onClick={() => navigate(`/earrings/${product.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== PRODUCT CARD ====================
const ProductCard = ({ product, addToCart, onClick }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  // Discount calculation
  const discount = product.discountPrice
    ? product.price - product.discountPrice
    : 0;
  const discountPercent = product.discountPrice
    ? Math.round((discount / product.price) * 100)
    : 0;

  return (
    <div className="px-2 relative">
      {/* Popup */}
      {showPopup && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-md shadow-lg text-sm z-10 animate-bounce">
          ✅ Added to Cart
        </div>
      )}

      <div className="product-card bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        {/* Image & Badge */}
        <div className="relative overflow-hidden">
          <img
            onClick={onClick}
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-64 object-cover transform hover:scale-110 transition duration-500 cursor-pointer"
          />
          {product.badge && (
            <span
              className={`absolute top-3 right-3 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow ${
                product.badge === "SALE" ? "bg-red-500" : "bg-amber-500"
              }`}
            >
              {product.badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="py-4 px-2 md:px-32">
          <h3 className="flex items-center justify-between">
            <span className="font-semibold text-gray-900 uppercase poppins-semibold text-lg">
              {product.name}
            </span>

            {/* Size  */}
            {/* {product.size && (
              <span className="text-green-600 font-medium text-lg">
                Size No: {product.size}
              </span>
            )} */}
          </h3>

          <p className="text-sm text-gray-800 poppins-medium mt-1 line-clamp-2">
            {product.description}
          </p>

          <p className="text-gray-500 text-sm mt-1">
            Delivery: ₹
            {product.deliveryCharge !== null ? product.deliveryCharge : 0}
          </p>

          {/* Price & Add to Cart */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex flex-col font-bold text-amber-600 text-lg">
              {product.discountPrice ? (
                <>
                  <span>
                    Price:{" "}
                    <span className="line-through decoration-2 decoration-black">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                  </span>
                  <span className="font-bold text-green-600 text-lg">
                    Discount Price: ₹
                    {product.discountPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm text-gray-600 animate-pulse">
                    🎉 You saved ₹{discount} ({discountPercent}% OFF)
                  </span>
                </>
              ) : (
                <span>₹{product.price.toLocaleString("en-IN")}</span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== CUSTOM ARROWS ====================
function SampleNextArrow(props) {
  const { className, onClick } = props;
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

function SamplePrevArrow(props) {
  const { className, onClick } = props;
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

export default Earrings;
