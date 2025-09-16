import React, { useEffect, useState } from "react";
import client from "../../api/client";

export default function PublicCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get("/coupons");
        if (res?.success) setCoupons(res.data.coupons);
      } catch (e) {
        setError(e.message || 'Failed to load coupons');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">Loading coupons...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-2xl font-bold">Available Coupons</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {coupons.map((c) => (
          <div key={c._id} className="border rounded p-3">
            <div className="font-semibold">{c.code} — {c.name}</div>
            <div className="text-sm text-gray-600">{c.type} {c.value}</div>
            <div className="text-xs">Minimum Order: ₹{c.minimumOrderValue || 0}</div>
            <div className="text-xs">Valid: {new Date(c.validFrom).toLocaleDateString()} - {new Date(c.validUntil).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


