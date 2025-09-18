import React, { useEffect, useState } from "react";
import client from "../../api/client";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get("/admin/dashboard");
        if (res?.success) setData(res.data);
      } catch (e) {
        setError(e.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  const { overview, monthlySales, topProducts, categoryStats } = data || {};

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Products" value={overview?.products?.totalProducts} />
        <StatCard title="Orders" value={overview?.orders?.totalOrders} />
        <StatCard
          title="Revenue"
          value={`₹${overview?.orders?.totalRevenue || 0}`}
        />
        <StatCard title="Users" value={overview?.users?.totalUsers} />
      </div>

      <section>
        <h2 className="font-semibold mb-2">Top Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {topProducts?.map((p) => (
            <div
              key={p._id}
              className="border rounded p-3 flex items-center gap-3"
            >
              <img
                src={p.primaryImage || p.images?.[0]?.url}
                alt={p.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-gray-600">Sales: {p.sales}</div>
              </div>
              <div className="font-semibold">₹{p.price}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-2">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categoryStats?.map((c) => (
            <div key={c._id} className="border rounded p-3">
              <div className="font-medium capitalize">{c._id}</div>
              <div className="text-sm text-gray-600">Products: {c.count}</div>
              <div className="text-sm">Sales: {c.totalSales}</div>
              <div className="text-sm">Revenue: ₹{c.totalRevenue}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="border rounded p-4">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-xl font-bold">{value ?? 0}</div>
    </div>
  );
}
