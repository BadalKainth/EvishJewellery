import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Ankletdata from "./Ankletdata";

const AnkletGrid = ({ addToCart }) => {
  const navigate = useNavigate();

  return (
    <div className="scroll-mt-24 flex flex-col bg-[#ECEEDF] w-full pb-10 p-0 md:px-10">
      <div className="w-full">
        {/* Heading */}
        <div className="items-center text-center">
          <div className="bg-[#eceacb] py-4 rounded-md">
            <h2 className="text-4xl poppins-semibold text-[#e28e45] uppercase">
              Anklets
            </h2>
            <p className="text-lg poppins-medium text-amber-800">
              Elegant anklets to adorn your feet
            </p>
          </div>
        </div>

        {/* ✅ Grid Layout (PC पर 3, Tablet पर 2, Mobile पर 1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 px-4">
          {Ankletdata.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
              onClick={() => navigate(`/anklets/${product.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, addToCart, onClick }) => {
  const [showPopup, setShowPopup] = useState(false);

  const discount = product.discountPrice
    ? product.price - product.discountPrice
    : 0;
  const discountPercent = product.discountPrice
    ? Math.round((discount / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product);
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
            className="w-full h-64 object-cover cursor-pointer"
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

        <div className="py-4 px-2">
          <h3 className="flex justify-between">
            <span className="font-semibold uppercase text-lg">
              {product.name}
            </span>
            {product.size && (
              <span className="text-green-600 font-medium text-lg">
                Size: {product.size}
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-800 mt-1 line-clamp-2">
            {product.description}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Delivery: ₹ {product.deliveryCharge || 99}
          </p>

          <div className="flex justify-between items-center mt-4">
            <div className="flex flex-col text-amber-600 text-lg">
              {product.discountPrice ? (
                <>
                  <span>
                    Price:{" "}
                    <span className="line-through">₹{product.price}</span>
                  </span>
                  <span className="font-bold text-green-600 text-lg">
                    ₹{product.discountPrice}
                  </span>
                  <span className="text-sm text-gray-600">
                    🎉 You saved ₹{discount} ({discountPercent}% OFF)
                  </span>
                </>
              ) : (
                <span>₹{product.price}</span>
              )}
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

export default AnkletGrid;
