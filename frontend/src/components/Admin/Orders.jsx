import React, { useEffect, useState } from "react";
import client, { getImageURL } from "../../api/client";

function OrderRow({ o, load, updatingId, setUpdatingId }) {
  const [statusForm, setStatusForm] = useState({
    status: o.status,
    message: "Updated by admin",
  });

  const [paymentForm, setPaymentForm] = useState({
    paymentStatus: o.paymentDetails?.paymentStatus || "completed",
    transactionId: o.paymentDetails?.transactionId || "",
  });

  const [trackingForm, setTrackingForm] = useState({
    carrier: "",
    trackingNumber: "",
    estimatedDelivery: "",
  });

  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <tr className="border-b hover:bg-gray-50 transition duration-150">
        <td className="p-3 font-medium flex items-center gap-2">
          {o.orderNumber}
          <button
            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={() => setShowModal(true)}
          >
            View
          </button>
        </td>
        <td className="p-3">
          {o.user?.name}{" "}
          <span className="text-gray-500 text-sm">({o.user?.email})</span>
        </td>
        <td className="p-3 font-semibold text-green-700">₹{o.pricing.total}</td>
        <td className="p-3 capitalize font-medium">{o.status}</td>
        <td className="p-3">
          <div className="flex flex-col gap-3">
            {/* Status Update */}
            <div className="flex gap-2 items-center">
              <select
                className="border rounded px-2 py-1 focus:ring-1 focus:ring-blue-400"
                value={statusForm.status}
                onChange={(e) =>
                  setStatusForm({ ...statusForm, status: e.target.value })
                }
              >
                {[
                  "pending",
                  "confirmed",
                  "processing",
                  "shipped",
                  "delivered",
                  "cancelled",
                  "returned",
                ].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <input
                className="border rounded px-2 py-1 flex-1"
                placeholder="Message"
                value={statusForm.message}
                onChange={(e) =>
                  setStatusForm({ ...statusForm, message: e.target.value })
                }
              />
              <button
                disabled={updatingId === o._id}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50"
                onClick={async () => {
                  try {
                    setUpdatingId(o._id);
                    await client.patch(`/orders/${o._id}/status`, statusForm);
                    await load();
                  } catch (e) {
                    alert(e.message || "Failed to update status");
                  } finally {
                    setUpdatingId(null);
                  }
                }}
              >
                {updatingId === o._id ? "Updating..." : "Update"}
              </button>
            </div>

            {/* Payment Update */}
            <div className="flex gap-2 items-center">
              <select
                className="border rounded px-2 py-1 focus:ring-1 focus:ring-blue-400"
                value={paymentForm.paymentStatus}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    paymentStatus: e.target.value,
                  })
                }
              >
                {[
                  "pending",
                  "completed",
                  "failed",
                  "refunded",
                  "partial_refund",
                ].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <input
                className="border rounded px-2 py-1 flex-1"
                placeholder="Transaction ID"
                value={paymentForm.transactionId}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    transactionId: e.target.value,
                  })
                }
              />
              <button
                disabled={updatingId === o._id}
                className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition disabled:opacity-50"
                onClick={async () => {
                  try {
                    setUpdatingId(o._id);
                    await client.patch(`/orders/${o._id}/payment`, paymentForm);
                    await load();
                  } catch (e) {
                    alert(e.message || "Failed to update payment");
                  } finally {
                    setUpdatingId(null);
                  }
                }}
              >
                {updatingId === o._id ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </td>
        <td className="p-3 text-gray-500 text-sm">
          {new Date(o.createdAt).toLocaleString()}
        </td>
      </tr>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-600 font-bold text-lg hover:text-black"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Order Details
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>Order Number:</strong> {o.orderNumber}
                </p>
                <p>
                  <strong>Status:</strong> {o.status}
                </p>
                <p>
                  <strong>Payment Status:</strong>{" "}
                  {o.paymentDetails?.paymentStatus}
                </p>
                <p>
                  <strong>Payment Method:</strong> {o.paymentMethod}
                </p>
                <p>
                  <strong>Total:</strong> ₹{o.pricing.total}
                </p>
              </div>
              <div>
                <p>
                  <strong>Billing:</strong> {o.billingAddress?.name},{" "}
                  {o.billingAddress?.address}, {o.billingAddress?.city},{" "}
                  {o.billingAddress?.state}, {o.billingAddress?.phone}
                </p>
                <p className="mt-2">
                  <strong>Shipping:</strong> {o.shippingAddress?.name},{" "}
                  {o.shippingAddress?.address}, {o.shippingAddress?.city},{" "}
                  {o.shippingAddress?.state}, {o.shippingAddress?.phone}
                </p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-4 mb-2">Products</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {o.items?.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 border p-3 rounded shadow-sm"
                >
                  <img
                    src={getImageURL(item.product?.images?.[0]?.url || item.product?.images?.[0] || item.image)}
                    alt={item.product?.images?.[0]?.alt || item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-600">
                      Price: ₹{item.price} × {item.quantity} = ₹{item.total}
                    </p>
                    {item.product?.stockStatus && (
                      <p className="text-gray-500 text-sm">
                        Stock: {item.product.stockStatus}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await client.get("/orders/admin/all", { limit: 20 });
      if (res?.success) setOrders(res.data.orders);
    } catch (e) {
      setError(e.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading orders...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Orders</h1>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-700">
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
              <th className="p-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <OrderRow
                key={o._id}
                o={o}
                load={load}
                updatingId={updatingId}
                setUpdatingId={setUpdatingId}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
