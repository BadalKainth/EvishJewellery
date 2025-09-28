import React, { useEffect, useState, useRef } from "react";
import client, { getImageURL } from "../../api/client";
import { FaWhatsapp } from "react-icons/fa";
import avishLogo from "../../img/avishlogo.jpeg";
import sign from "../../img/sign.jpeg";

function InvoiceModal({ order, onClose }) {
  const printRef = useRef();
  const fmt = (val) => `₹${(val || 0).toFixed(2)}`;

  return (
    <div className="fixed inset-0 z-50 flex poppins-regular items-center justify-center bg-black/50 overflow-auto p-2 sm:p-4">
      <div className="bg-white rounded-lg mt-20 sm:mt-40 shadow-xl w-full max-w-full sm:max-w-4xl p-4 sm:p-6 relative animate-[fadeIn_0.3s_ease-out]">
        <button
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 transition text-sm sm:text-base"
          onClick={onClose}
        >
          ✕
        </button>

        <div ref={printRef} className="p-3 sm:p-6">
          {/* Header */}
          <div className="flex flex-row justify-between items-center sm:items-start border-b pb-3 sm:pb-4 mb-4 sm:mb-6">
            <div className="text-left">
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">
                Avish Jewels
              </h1>
              <p className="text-xs sm:text-sm">
                35 I-Block first floor Arya Samaj Road, Uttam Nagar
              </p>
              <p className="text-xs sm:text-sm">New Delhi, Delhi - 110059</p>
              <p className="text-xs sm:text-sm">Phone: +91 8882825761</p>
              <p className="text-xs sm:text-sm">
                Email: info.avishjewels@gmail.com
              </p>
            </div>

            <div className="flex-shrink-0 flex items-center justify-center">
              <img
                src={avishLogo}
                alt="Avish Jewels"
                className="h-12 sm:h-16 object-contain"
              />
            </div>
          </div>

          {/* Invoice Info */}
          <div className="text-center sm:text-right text-sm sm:text-base mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-2xl font-semibold">Invoice</h2>
            <p>
              <strong>No:</strong> {order.orderNumber}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Payment:</strong> {order.paymentDetails?.paymentStatus}
            </p>
          </div>

          {/* Billing & Shipping */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6 text-xs sm:text-sm">
            <div>
              <p className="font-semibold text-gray-700 mb-1">Bill To:</p>
              <p>{order.billingAddress?.name}</p>
              <p>{order.billingAddress?.address}</p>
              <p>
                {order.billingAddress?.city}, {order.billingAddress?.state}
              </p>
              <p>{order.billingAddress?.phone}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-1">Ship To:</p>
              <p>{order.shippingAddress?.name}</p>
              <p>{order.shippingAddress?.address}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state}
              </p>
              <p>{order.shippingAddress?.phone}</p>
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-2 sm:px-3 py-1 sm:py-2 border">
                    Product
                  </th>
                  <th className="text-right px-2 sm:px-3 py-1 sm:py-2 border">
                    Price
                  </th>
                  <th className="text-right px-2 sm:px-3 py-1 sm:py-2 border">
                    Qty
                  </th>
                  <th className="text-right px-2 sm:px-3 py-1 sm:py-2 border">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, i) => (
                  <tr key={i} className="even:bg-gray-50">
                    <td className="px-2 sm:px-3 py-1 sm:py-2 border">
                      {item.name}
                    </td>
                    <td className="px-2 sm:px-3 py-1 sm:py-2 border text-right">
                      {fmt(item.price)}
                    </td>
                    <td className="px-2 sm:px-3 py-1 sm:py-2 border text-right">
                      {item.quantity}
                    </td>
                    <td className="px-2 sm:px-3 py-1 sm:py-2 border text-right">
                      {fmt(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-4 flex justify-end">
            <div className="w-full sm:w-1/2 max-w-sm text-xs sm:text-sm">
              {order.pricing.discount && (
                <div className="flex justify-between px-2 sm:px-3 py-1 sm:py-2 border-b">
                  <span>Discount:</span>
                  <span>-{fmt(order.pricing.discount)}</span>
                </div>
              )}
              <div className="flex justify-between px-2 sm:px-3 py-1 sm:py-2 border-t border-b">
                <span>Subtotal:</span>
                <span>{fmt(order.pricing.total - order.pricing.tax)}</span>
              </div>
              {order.pricing.tax != null && (
                <div className="flex justify-between px-2 sm:px-3 py-1 sm:py-2 border-b">
                  <span>Tax:</span>
                  <span>{fmt(order.pricing.tax)}</span>
                </div>
              )}
              <div className="flex justify-between px-2 sm:px-3 py-2 sm:py-3 border-t font-semibold text-base sm:text-lg">
                <span>Total:</span>
                <span>{fmt(order.pricing.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4">
            <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
              Thank you for shopping with Avish Jewels!
            </p>
            <div className="text-center">
              <img
                src={sign}
                alt="Signature"
                className="h-12 sm:h-16 mx-auto"
              />
              <p className="font-medium text-xs sm:text-sm">
                Authorized Signatory
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderRow({ o }) {
  const [showModal, setShowModal] = useState(false);
  const [statusForm, setStatusForm] = useState({
    status: o.status,
    message: "Updated by admin",
  });
  const [paymentForm, setPaymentForm] = useState({
    paymentStatus: o.paymentDetails?.paymentStatus || "completed",
    transactionId: o.paymentDetails?.transactionId || "",
  });
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);

  const handleUpdate = async (type) => {
    if (type === "status") setUpdatingStatus(true);
    if (type === "payment") setUpdatingPayment(true);

    try {
      if (type === "status") {
        await client.patch(`/orders/${o._id}/status`, statusForm);
      } else if (type === "payment") {
        await client.patch(`/orders/${o._id}/payment`, paymentForm);
      }
    } finally {
      window.location.reload(); // hard refresh after update
    }
  };

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
          <div>
            {o.user?.name}{" "}
            <span className="text-gray-500 text-sm">({o.user?.email})</span>
          </div>
          {o.user?.phone && (
            <a
              href={`https://wa.me/${o.user.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-1 px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              <FaWhatsapp /> {o.user.phone}
            </a>
          )}
        </td>

        <td className="p-3 font-semibold text-green-700">₹{o.pricing.total}</td>
        <td className="p-3 capitalize font-medium">{o.status}</td>
        <td className="p-3">
          <div className="flex flex-col gap-3">
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
                disabled={updatingStatus}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50"
                onClick={() => handleUpdate("status")}
              >
                {updatingStatus ? "Updating..." : "Update"}
              </button>
            </div>

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
                disabled={updatingPayment}
                className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition disabled:opacity-50"
                onClick={() => handleUpdate("payment")}
              >
                {updatingPayment ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </td>

        <td className="p-3 text-gray-500 text-sm">
          {new Date(o.createdAt).toLocaleString()}
        </td>
      </tr>

      {showModal && (
        <InvoiceModal order={o} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await client.get("/orders/admin/all", { limit: 50 });
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
              <OrderRow key={o._id} o={o} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
