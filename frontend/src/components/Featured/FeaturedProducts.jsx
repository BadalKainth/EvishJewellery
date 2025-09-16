import React, { useEffect, useState } from "react";
import client from "../../api/client";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get("/products/featured/products", { limit: 8 });
        if (res?.success) setProducts(res.data.products);
      } catch (e) {
        setError(e.message || 'Failed to fetch featured');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">Loading featured...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-3">Featured</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <div key={p._id} className="border rounded p-3">
            <img src={p.primaryImage || p.images?.[0]?.url} alt={p.name} className="w-full h-32 object-cover rounded" />
            <div className="mt-1 font-medium truncate">{p.name}</div>
            <div className="text-sm">₹{p.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


