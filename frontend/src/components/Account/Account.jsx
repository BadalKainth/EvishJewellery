import React, { useContext, useEffect, useState } from "react";
import client from "../../api/client";
import { AuthContext } from "../../context/AuthContext";

export default function Account() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [p, o, r] = await Promise.all([
          client.get("/users/profile"),
          client.get("/users/orders", { limit: 5 }),
          client.get("/users/returns", { limit: 5 }),
        ]);
        if (p?.success) setProfile(p.data.user);
        if (o?.success) setOrders(o.data.orders);
        if (r?.success) setReturns(r.data.returns);
      } catch (e) {
        setError(e.message || "Failed to load account");
      }
    })();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Account</h1>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <section className="bg-white rounded shadow p-4">
        <h2 className="font-semibold mb-2">Profile</h2>
        {profile ? (
          <div className="text-sm">
            <div>Name: {profile.name}</div>
            <div>Email: {profile.email}</div>
            <div>Phone: {profile.phone}</div>
          </div>
        ) : (
          <div>Loading profile...</div>
        )}
      </section>

      <section className="bg-white rounded shadow p-4">
        <h2 className="font-semibold mb-2">Recent Orders</h2>
        <div className="space-y-2">
          {orders.map((o) => (
            <div key={o._id} className="border rounded p-3 flex justify-between">
              <div>
                <div className="font-medium">{o.orderNumber}</div>
                <div className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <div className="font-semibold">₹{o.pricing.total}</div>
            </div>
          ))}
          {orders.length === 0 && <div>No recent orders.</div>}
        </div>
      </section>

      <section className="bg-white rounded shadow p-4">
        <h2 className="font-semibold mb-2">Recent Returns</h2>
        <div className="space-y-2">
          {returns.map((r) => (
            <div key={r._id} className="border rounded p-3 flex justify-between">
              <div>
                <div className="font-medium">{r.returnNumber}</div>
                <div className="text-sm text-gray-600">{r.status}</div>
              </div>
              <div className="font-semibold">₹{r.refund?.amount || 0}</div>
            </div>
          ))}
          {returns.length === 0 && <div>No recent returns.</div>}
        </div>
      </section>
    </div>
  );
}


