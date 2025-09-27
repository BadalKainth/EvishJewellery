import React, { useEffect, useState, useRef } from "react";
import client from "../../api/client";
import { FaWhatsapp } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";

// ✅ add your logo + signature inside assets folder
import avishLogo from "../../img/avishlogo.jpeg";
import sign from "../../img/sign.jpeg";

function InvoiceModal({ order, onClose }) {
  const printRef = useRef();

  // const handlePrint = useReactToPrint({
  //   content: () => printRef.current,
  // });

  // const priceWithoutTax = order.pricing.subtotal - order.pricing.tax;

  const fmt = (val) => `₹${(val || 0).toFixed(2)}`;

  return (
    <div className="fixed inset-0 z-50 flex poppins-regular items-center justify-center bg-black/50 overflow-auto p-4">
      <div className="bg-white rounded-lg mt-40 shadow-xl max-w-4xl w-full p-6 relative animate-[fadeIn_0.3s_ease-out]">
        {/* Close */}
        <button
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 transition"
          onClick={onClose}
        >
          ✕
        </button>
        {/* Invoice Content */}
        <div ref={printRef} className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b pb-4 mb-6">
            {/* Logo + Company */}
            <div>
              <img src={avishLogo} alt="Avish Jewels" className="h-16 mb-2" />
              <h1 className="text-xl font-bold text-gray-800">Avish Jewels</h1>
              <p>35 I-Block first floor Arya Samaj Road, Uttam Nagar</p>
              <p>New Delhi, Delhi - 110059</p>
              <p>Phone: +91 8882825761</p>
              <p>Email: info.avishjewels@gmail.com</p>
              {/* <p>GSTIN: 09ABCDE1234F1Z5</p> */}
            </div>

            {/* Invoice Info */}
            <div className="text-right">
              <h2 className="text-2xl font-semibold">Invoice</h2>
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
          </div>

          {/* Billing & Shipping */}
          <div className="grid grid-cols-2 gap-6 mb-6">
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
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-3 py-2 border">Product</th>
                  <th className="text-right px-3 py-2 border">Price</th>
                  <th className="text-right px-3 py-2 border">Qty</th>
                  <th className="text-right px-3 py-2 border">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, i) => (
                  <tr key={i} className="even:bg-gray-50">
                    <td className="px-3 py-2 border">{item.name}</td>
                    <td className="px-3 py-2 border text-right">
                      {fmt(item.price)}
                    </td>
                    <td className="px-3 py-2 border text-right">
                      {item.quantity}
                    </td>
                    <td className="px-3 py-2 border text-right">
                      {fmt(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-4 flex justify-end">
            <div className="w-1/2 max-w-sm">
              {order.pricing.discount && (
                <div className="flex justify-between px-3 py-2 border-b">
                  <span>Discount:</span>
                  <span>-{fmt(order.pricing.discount)}</span>
                </div>
              )}
              <div className="flex justify-between px-3 py-2 border-t border-b">
                <span>Subtotal:</span>
                <span>{fmt(order.pricing.total - order.pricing.tax)}</span>
              </div>
              {order.pricing.tax != null && (
                <div className="flex justify-between px-3 py-2 border-b">
                  <span>Tax:</span>
                  <span>{fmt(order.pricing.tax)}</span>
                </div>
              )}
              <div className="flex justify-between px-3 py-3 border-t font-semibold text-lg">
                <span>Total:</span>
                <span>{fmt(order.pricing.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="mt-10 flex justify-between items-end">
            <p className="text-sm text-gray-500">
              Thank you for shopping with Avish Jewels!
            </p>
            <div className="text-center">
              <img src={sign} alt="Signature" className="h-16 mx-auto" />
              <p className="font-medium">Authorized Signatory</p>
            </div>
          </div>
        </div>
        {/* Modal Buttons */}
        {/* <div className="flex justify-end mt-4 gap-3">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Close
          </button>
          {/* <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handlePrint}
          >
            Print / Download
          </button>*/}
        {/* </div>  */}
      </div>
    </div>
  );
}

function OrderRow({ o, load, updatingId, setUpdatingId }) {
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

        {/* Customer */}
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
              <th className="p-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <OrderRow key={o._id} o={o} load={load} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
