import React, { useContext, useEffect, useState } from "react";
import client, { getImageURL } from "../../api/client";
import { CartContext } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function SearchPage({ product, addToCart, onClick }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { addItem } = useContext(CartContext);
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  const doSearch = async () => {
    if (!q || q.trim().length < 2) return;
    setLoading(true);
    setError("");
    try {
      const res = await client.get("/products/search/query", { q, limit: 12 });
      if (res?.success) {
        // map through each product to calculate discount and discountPercent
        const productsWithDiscount = res.data.products.map((p) => {
          const discount = p.originalPrice - p.price;
          const discountPercent = p.originalPrice
            ? Math.round((discount / p.originalPrice) * 100)
            : 0; // avoid division by zero
          return {
            ...p,
            discount,
            discountPercent,
          };
        });

        setResults(productsWithDiscount);
        // console.log(productsWithDiscount);
        navigate("/search", {
          state: { query: q, results: productsWithDiscount },
        });
      }
    } catch (e) {
      setError(e.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  // const handleAddToCart = async (e) => {
  //   e.stopPropagation();
  //   await addToCart(); // ✅ calls CartContext.addItem(product.id)
  //   setShowPopup(true);
  //   setTimeout(() => setShowPopup(false), 1500);
  // };
  const handleAddToCart = async (productId, e) => {
    e.stopPropagation();
    try {
      addItem(productId); // ✅ CartContext function
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      {showPopup && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md z-50">
          Added to Cart!
        </div>
      )}
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Search products"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && doSearch()}
        />
        <button
          className="px-4 py-2 bg-black text-white rounded"
          onClick={doSearch}
        >
          Search
        </button>
      </div>
      {loading && <div>Searching...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((p) => (
          <div key={p._id} className="border rounded p-3">
            <img
              src={getImageURL(p.primaryImage || p.images?.[0]?.url || p.images?.[0])}
              alt={p.name}
              className="w-full h-40 object-cover rounded"
            />
            {/* ✅ Badge */}
            {p.tags && (
              <span
                className={`absolute top-3 right-3 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow ${
                  p.tags === "SALE" ? "bg-red-500" : "bg-amber-500"
                }`}
              >
                {p.tags}
              </span>
            )}
            <div className="py-4 px-2">
              <h3 className="flex justify-between">
                <span className="font-semibold uppercase text-lg">
                  {p.name}
                </span>
                <span className="text-green-600 font-medium text-lg">
                  Size No: {p.size}
                </span>
              </h3>
              <p className="text-sm text-gray-800 mt-1 line-clamp-2">
                {p.description}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Delivery: ₹ {p.deliveryCharge || 99}
              </p>

              {/* ✅ Price + Discount */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex flex-col text-amber-600 text-xl font-bold">
                  <>
                    <span>
                      Price:{" "}
                      <span className="line-through decoration-2 decoration-amber-700 text-2xl">
                        ₹{p.originalPrice}
                      </span>
                    </span>
                    <span className="font-bold text-green-600 text-lg">
                      Discounted price : ₹{p.price}
                    </span>
                    <span className="text-sm text-gray-600">
                      🎉 You saved ₹{p.discount} ({p.discountPercent}% OFF)
                    </span>
                  </>
                </div>

                {/* ✅ Add to Cart Button */}
                <button
                  onClick={(e) => handleAddToCart(p._id, e)}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600 capitalize">{p.category}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
