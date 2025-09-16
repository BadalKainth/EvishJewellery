import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../../api/client";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get(`/orders/${id}`);
        if (res?.success) setOrder(res.data.order);
      } catch (e) {
        setError(e.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-6">Loading order...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!order) return <div className="p-6">Order not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
      <div className="bg-white rounded shadow p-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Status: <span className="capitalize font-semibold">{order.status}</span></div>
          <div>Total: <span className="font-semibold">₹{order.pricing.total}</span></div>
          <div>Payment: <span className="capitalize">{order.paymentDetails?.paymentStatus}</span></div>
          <div>Created: {new Date(order.createdAt).toLocaleString()}</div>
        </div>
      </div>
      <div className="bg-white rounded shadow p-4">
        <h2 className="font-semibold mb-2">Items</h2>
        <div className="space-y-2">
          {order.items.map((it, idx) => (
            <div key={idx} className="flex justify-between border-b pb-2">
              <div>{it.name} x {it.quantity}</div>
              <div>₹{it.total}</div>
            </div>
          ))}
        </div>
      </div>
      {order.timeline?.length > 0 && (
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">Timeline</h2>
          <div className="space-y-2">
            {order.timeline.map((t, i) => (
              <div key={i} className="text-sm">
                <span className="capitalize font-medium">{t.status}</span>: {t.message} — {new Date(t.timestamp).toLocaleString()}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


