import React, { useState, useContext } from "react";
import { getImageURL } from "../../api/client";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CartDesign = ({ product, addToCart, onClick }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const discount = product.originalPrice - product.price;
  const discountPercent = Math.round((discount / product.originalPrice) * 100);

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!user) {
      setPopupMessage("⚠️ Please login to add items!");
      setPopupType("error");
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
        navigate("/authForm");
      }, 1500);
      return;
    }

    addToCart(product);
    setPopupMessage("✅ Added to Cart!");
    setPopupType("success");
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  return (
    <div>
      <div className="px-1 relative poppins">
        {/* ✅ Popup */}
        {showPopup && (
          <div
            className={`absolute top-3 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-md z-50 text-white font-medium transition-all duration-500 ${
              popupType === "success"
                ? "bg-green-600 animate-bounce"
                : "bg-red-500 animate-pulse"
            }`}
          >
            {popupMessage}
          </div>
        )}

        {/* ✅ Card */}
        <div className="bg-white p-2 rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          {/* ✅ Product Image */}
          <div className="relative overflow-hidden">
            <img
              onClick={onClick}
              src={getImageURL(product.images[0]?.url || product.images[0])}
              alt={product.images[0]?.alt || product.name}
              loading="lazy"
              className="w-full h-40 md:h-64 object-cover text-base cursor-pointer hover:scale-105 transition-transform duration-300"
            />
            {product.tags && (
              <span
                className={`absolute top-3 right-3 text-white text-[8px] md:text-xs font-semibold px-1 md:px-2 py-0  md:py-1 rounded-lg shadow ${
                  product.tags === "SALE" ? "bg-red-500" : "bg-amber-500"
                }`}
              >
                {product.tags}
              </span>
            )}
          </div>

          {/* ✅ Product Details */}
          <div className="py-0 md:py-4 px-1  md:px-4 ">
            <h3 className="flex justify-between items-center">
              <span className="font-semibold uppercase text-xs md:text-lg text-gray-800 truncate block w-3/4 md:w-4/5 ">
                {product.name}
              </span>
              <span className="text-green-600 font-bold md:font-medium md:text-base text-[10px]">
                {product.size == 0 ? "Full Size" : `Size: ${product.size}`}
              </span>
            </h3>

            <p className="text-xs md:text-base text-gray-700 mt-0 md:mt-1 md:line-clamp-2 line-clamp-1">
              {product.description}
            </p>
            {/* <p className="text-gray-500 text-sm mt-1">
              Delivery: ₹ {product.deliveryCharge || 0}
            </p> */}

            {/* ✅ Price, Stock & Cart Button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-0 md:mt-4">
              {/* ✅ Left Section (Price + Discount + Stock) */}
              <div className="flex flex-col font-bold text-amber-600 text-sm md:text-lg flex-1 w-full">
                <div className="flex flex-row md:flex-col gap-2">
                  <span className="line-through whitespace-nowrap decoration-2 decoration-amber-700 text-sm md:text-xl">
                    Price: ₹ {product.originalPrice}
                  </span>

                  <span className="font-bold md:font-bold text-green-600 text-xs md:text-lg">
                    ₹{product.price}
                  </span>
                </div>

                {/* ✅ Discount + Stock (Mobile: left, Desktop: normal) */}
                <div className="flex flex-row justify-between items-center sm:flex-col sm:items-start gap-2 mt-1 w-full">
                  <div className="flex flex-col">
                    {/* Mobile पर सिर्फ % OFF */}
                    <span className="text-xs text-gray-600 animate-pulse block sm:hidden">
                      ({discountPercent}% OFF)
                    </span>

                    {/* Desktop पर पूरा text */}
                    <span className="md:text-sm text-gray-600 animate-pulse hidden sm:block">
                      🎉 You saved ₹{discount} ({discountPercent}% OFF)
                    </span>

                    {/* ✅ Stock Count */}
                    <span
                      className={`text-xs md:text-sm font-medium ${
                        product.stock > 5
                          ? "text-green-600"
                          : product.stock > 0
                          ? "text-orange-500"
                          : "text-red-600"
                      }`}
                    >
                      {product.stock > 0
                        ? `Stock: ${product.stock}`
                        : "Out of Stock"}
                    </span>
                  </div>

                  {/* ✅ Mobile पर सामने, Desktop पर अलग right side */}
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className={`${
                      product.stock <= 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-amber-500 hover:bg-amber-600"
                    } text-white px-1 py-1 md:px-4 md:py-2 text-xs rounded-lg md:text-sm shadow-md transition-all duration-300 hover:scale-105 block sm:hidden`}
                  >
                    {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>

              {/* ✅ Desktop Button (right side अलग रहे) */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`${
                  product.stock <= 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-amber-500 hover:bg-amber-600"
                } text-white px-2 py-1 md:px-4 md:py-2 text-xs rounded-lg md:text-sm shadow-md transition-all duration-300 hover:scale-105 hidden sm:block`}
              >
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDesign;
