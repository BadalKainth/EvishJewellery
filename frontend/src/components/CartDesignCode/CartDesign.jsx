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
      <div className="px-2 relative poppins">
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
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          {/* ✅ Product Image */}
          <div className="relative overflow-hidden">
            <img
              onClick={onClick}
              src={getImageURL(product.images[0]?.url || product.images[0])}
              alt={product.images[0]?.alt || product.name}
              loading="lazy"
              className="w-full h-64 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
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

          {/* ✅ Product Details */}
          <div className="py-4 px-4">
            <h3 className="flex justify-between items-center">
              <span className="font-semibold uppercase text-lg text-gray-800">
                {product.name}
              </span>
              <span className="text-green-600 font-medium text-base">
                Size: {product.size}
              </span>
            </h3>

            <p className="text-sm text-gray-700 mt-1 line-clamp-2">
              {product.description}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Delivery: ₹ {product.deliveryCharge || 0}
            </p>

            {/* ✅ Price, Stock & Cart Button */}
            <div className="flex justify-between items-center mt-4">
              <div className="flex flex-col font-bold text-amber-600 text-lg">
                <span>
                  Price:{" "}
                  <span className="line-through decoration-2 decoration-amber-700 text-xl">
                    ₹{product.originalPrice}
                  </span>
                </span>
                <span className="font-bold text-green-600 text-lg">
                  ₹{product.price}
                </span>
                <span className="text-sm text-gray-600 animate-pulse">
                  🎉 You saved ₹{discount} ({discountPercent}% OFF)
                </span>

                {/* ✅ Stock Count */}
                <span
                  className={`text-sm font-medium mt-1 ${
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

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`${
                  product.stock <= 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-amber-500 hover:bg-amber-600"
                } text-white px-4 py-2 rounded-lg text-sm shadow-md transition-all duration-300 hover:scale-105`}
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
