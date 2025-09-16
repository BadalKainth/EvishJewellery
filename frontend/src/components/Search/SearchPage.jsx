import React, { useEffect, useState } from "react";
import client from "../../api/client";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const doSearch = async () => {
    if (!q || q.trim().length < 2) return;
    setLoading(true); setError("");
    try {
      const res = await client.get("/products/search/query", { q, limit: 12 });
      if (res?.success) setResults(res.data.products);
    } catch (e) {
      setError(e.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex gap-2 mb-4">
        <input className="flex-1 border rounded px-3 py-2" placeholder="Search products" value={q} onChange={(e)=> setQ(e.target.value)} onKeyDown={(e)=> e.key==='Enter' && doSearch()} />
        <button className="px-4 py-2 bg-black text-white rounded" onClick={doSearch}>Search</button>
      </div>
      {loading && <div>Searching...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((p) => (
          <div key={p._id} className="border rounded p-3">
            <img src={p.primaryImage || p.images?.[0]?.url} alt={p.name} className="w-full h-40 object-cover rounded" />
            <div className="mt-2 font-semibold truncate">{p.name}</div>
            <div className="text-sm text-gray-600 capitalize">{p.category}</div>
            <div className="mt-1 font-bold">₹{p.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


