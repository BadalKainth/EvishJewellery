import React, { useState } from 'react'

const CartDesign = ({ product, addToCart, onClick }) => {
  const [showPopup, setShowPopup] = useState(false);

  const discount = product.originalPrice - product.price;
  const discountPercent = Math.round((discount / product.originalPrice) * 100);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    addToCart(product); // ✅ calls CartContext.addItem(product.id)
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  return (
    <div>
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
                className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-0 mt-8 md:mt-0 md:px-5 md:py-4  rounded-lg text-sm md:text-base "
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default CartDesign