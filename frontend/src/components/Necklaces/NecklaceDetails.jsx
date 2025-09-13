import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Necklacesdata from "./Necklacesdata";

const NecklaceDetails = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);

  const product = Necklacesdata.find((p) => p.id.toString() === id);

  if (!product) {
    return (
      <div className="text-center text-red-500 mt-20">Product not found</div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  // ✅ Discount Calculation
  const discount = product.discountPrice
    ? product.price - product.discountPrice
    : 0;
  const discountPercent = product.discountPrice
    ? Math.round((discount / product.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#f9f9f9] pb-10 px-5 md:px-20 relative poppins">
      {/* ✅ Popup */}
      {showPopup && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          ✅ Added to Cart!
        </div>
      )}

      <button
        onClick={() => navigate(-1)}
        className="mt-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 rounded-xl shadow-lg">
        {/* ✅ Left: Image + Video Slider */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={10}
            slidesPerView={1}
            className="rounded-xl w-full h-[400px] md:h-[500px] lg:h-[700px]"
          >
            {/* ✅ Images */}
            {product.images?.map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={img}
                  alt={`${product.name}-${index}`}
                  className="w-full h-full object-cover rounded-xl"
                />
              </SwiperSlide>
            ))}

            {/* ✅ Videos */}
            {product.videos?.map((vid, index) => (
              <SwiperSlide key={`vid-${index}`}>
                <video
                  controls
                  autoPlay
                  muted
                  loop
                  className="w-full h-full rounded-xl object-cover"
                >
                  <source src={vid} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* ✅ Badge */}
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

        {/* ✅ Right Info */}
        <div>
          <h3 className="flex items-center justify-between">
            <span className="font-semibold text-gray-900 uppercase poppins-semibold text-lg">
              {product.name}
            </span>
            {product.size && (
              <span className="text-green-600 font-medium text-lg">
                Size No: {product.size}
              </span>
            )}
          </h3>
          <p className="text-gray-600 mt-4">{product.description}</p>

          {/* ✅ Price Section */}
          <div className="flex flex-col font-bold text-amber-600 text-lg mt-4">
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
                <span className="text-sm text-gray-600 mt-1">
                  🎉 You saved ₹{discount} ({discountPercent}% OFF)
                </span>
              </>
            ) : (
              <span>₹{product.price.toLocaleString("en-IN")}</span>
            )}
            <p className="text-gray-500 text-sm mt-1">
              Delivery: ₹
              {product.deliveryCharge !== null ? product.deliveryCharge : 0}
            </p>
          </div>

          {/* ✅ Extra Info */}
          <div className="mt-4 text-sm text-gray-700 space-y-2">
            <p>✅ 7 Days Easy Return</p>
            <p>✅ Free Packaging</p>
            <p>⭐ 4.5/5 (120 reviews)</p>
          </div>

          {/* ✅ Action */}
          <button
            onClick={handleAddToCart}
            className="mt-6 bg-amber-500 hover:bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default NecklaceDetails;
