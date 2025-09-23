import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";
import { CartContext } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addItem } = useContext(CartContext);

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get(`/products/${id}`);
        if (res?.success) setProduct(res.data.product);
      } catch (e) {
        setError(e.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-6">Loading product...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!product) return <div className="p-6">Product not found</div>;

  const primary = product.primaryImage || product.images?.[0]?.url;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <img src={primary} alt={product.name} className="w-full rounded" />
      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <div className="mt-2 text-gray-600 capitalize">{product.category}</div>
        <div className="mt-4 text-2xl font-bold">₹{product.price}</div>
        {product.originalPrice && (
          <div className="text-sm text-gray-500 line-through">
            ₹{product.originalPrice}
          </div>
        )}
        <p className="mt-4 text-gray-800 whitespace-pre-line">
          {product.description}
        </p>

        <div className="mt-6 flex items-center gap-3">
          <input
            type="number"
            min={1}
            max={10}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-16 border rounded px-2 py-1"
          />
          <button
            onClick={() => addItem(product._id, qty)}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
