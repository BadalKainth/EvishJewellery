import React, { useEffect, useState } from "react";
import client from "../api/client";

export default function CartCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get("/coupons/admin/all", { limit: 50 });
        if (res?.success) {
          // Only show active & public coupons
          const activeCoupons = res.data.coupons.filter(
            (c) => c.isActive && c.isPublic
          );
          setCoupons(activeCoupons);
        }
      } catch (e) {
        setError(e.message || "Failed to load coupons");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Loading coupons...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-4 space-y-2 bg-white rounded-lg">
      <h2 className="text-base font-semibold border-b pb-2">
        Available Coupons
      </h2>

      {coupons.length === 0 && (
        <div className="text-gray-500 text-sm">No coupons available</div>
      )}

      {coupons.map((c) => (
        <div key={c._id} className="text-sm">
          <div className="font-medium">
            <span className="text-green-500">{c.code}</span> —{" "}
            {c.type === "percentage" ? c.value + "%" : "₹" + c.value}
          </div>
          {/* <div className="text-gray-600">{c.name}</div> */}
        </div>
      ))}
    </div>
  );
}
