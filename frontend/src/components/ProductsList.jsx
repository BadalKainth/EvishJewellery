import React, { useEffect, useState } from "react";
import client, { getImageURL } from "../api/client";

export default function ProductsList({ category }) {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const path = category ? `/products/category/${category}` : "/products";
        const res = await client.get(path, { limit: 12, sort: "newest" });
        if (res?.success) setProducts(res.data.products);
      } catch (e) {
        setError(e.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  }, [category]);

  if (loading) return <div className="p-6">Loading products...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map((p) => (
        <div key={p._id} className="border rounded p-3">
          <img
            src={getImageURL(p.primaryImage || p.images?.[0]?.url || p.images?.[0])}
            alt={p.name}
            className="w-full h-40 object-cover rounded"
          />
          <div className="mt-2 font-semibold truncate">{p.name}</div>
          <div className="text-sm text-gray-600 capitalize">{p.category}</div>
          <div className="mt-1 font-bold">₹{p.price}</div>
        </div>
      ))}
    </div>
  );
}


