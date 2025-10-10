import React, { useContext, useEffect, useState, useRef } from "react";
import client from "../../api/client";
import { AuthContext } from "../../context/AuthContext";
import { FaWhatsapp } from "react-icons/fa";
import avishLogo from "../../img/avishlogo.jpeg";
import sign from "../../img/sign.jpeg";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getImageURL } from "../../api/client";


function InvoiceModal({ order, onClose }) {
  const printRef = useRef();
  const fmt = (val) => `₹${(val || 0).toFixed(2)}`;

  if (!order) return null;

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice_${order.orderNumber}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50  flex items-center justify-center bg-black/50 overflow-auto p-2 sm:p-4">
      <div className="bg-white rounded-lg  mt-64 shadow-xl w-full max-w-4xl p-4 sm:p-6 relative animate-[fadeIn_0.3s_ease-out]">
        <button
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 transition text-sm sm:text-base"
          onClick={onClose}
        >
          ✕
        </button>

        <div ref={printRef} className="p-3 sm:p-6">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-3 sm:pb-4 mb-4 sm:mb-6">
            <div>
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
            <img
              src={avishLogo}
              alt="Avish Logo"
              className="h-12 sm:h-16 object-contain"
            />
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
            {order.paymentDetails?.transactionId && (
              <p>
                <strong>Transaction UTR:</strong>{" "}
                {order.paymentDetails.transactionId}
              </p>
            )}
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
                      {item.product?.name}
                    </td>
                    <td className="px-2 sm:px-3 py-1 sm:py-2 border text-right">
                      {fmt(item.price)}
                    </td>
                    <td className="px-2 sm:px-3 py-1 sm:py-2 border text-right">
                      {item.quantity}
                    </td>
                    <td className="px-2 sm:px-3 py-1 sm:py-2 border text-right">
                      {fmt(item.price * item.quantity)}
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

        {/* Buttons */}
        <div className="mt-4 flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={() => window.print()}
          >
            Print
          </button>
          <button
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
            onClick={handleDownloadPDF}
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Account() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returns, setReturns] = useState([]);
  const [error, setError] = useState("");
  const [popupImg, setPopupImg] = useState(null);

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

  const getAmounts = (order) => {
    const total = order.pricing?.total || 0;
    const tax = order.pricing?.tax || 0;
    const productAmountExclTax = total - tax;
    return { total, tax, productAmountExclTax };
  };


  const statusColors = {
      pending:   "bg-green-200",
      confirmed: "bg-green-300",
      processing:"bg-green-400",
      shipped:   "bg-green-500",
      delivered: "bg-green-600",
      cancelled: "bg-green-700",
      returned:  "bg-green-800",

  };


  const statuses = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "returned",
  ];
const [imgStatus, setImgStatus] = useState({});

  return (
    <div className="p-1 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Account</h1>
      {error && <div className="text-red-600 text-sm">{error}</div>}

      {/* Profile Section */}
      <section className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-2">Profile</h2>
        {profile ? (
          <div className="text-sm space-y-1">
            <div>
              <span className="font-medium">Name:</span> {profile.name}
            </div>
            <div>
              <span className="font-medium">Email:</span> {profile.email}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {profile.phone}
            </div>
            <div>
              <span className="font-medium">Account Created:</span>{" "}
              {new Date(profile.createdAt).toLocaleString()}
            </div>
          </div>
        ) : (
          <div>Loading profile...</div>
        )}
      </section>

      {/* Orders Section */}
      <section className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-4">Recent Orders</h2>
        <div className="space-y-6">
          {orders.length === 0 && <div>No recent orders.</div>}
          {orders.map((order) => {
            const { total, tax, productAmountExclTax } = getAmounts(order);

            
            return (
              <div
                key={order._id}
                className="border rounded-xl p-4 shadow-sm bg-gray-50"
              >
                {/* Order Header */}
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="font-medium text-lg">
                      Order #{order.orderNumber}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Status:</span>{" "}
                      <span className="capitalize">{order.status}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Payment:</span>{" "}
                      {order.paymentDetails?.paymentStatus || "N/A"}
                    </div>
                    {order.paymentDetails?.transactionId && (
                      <div className="text-sm">
                        <span className="font-medium">Transaction UTR ID:</span>{" "}
                        <b>{order.paymentDetails.transactionId}</b>
                      </div>
                    )}
                  </div>
                  <div className="text-xl font-bold text-green-600">
                    ₹{total.toLocaleString("en-IN")}
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 border-b pb-2 last:border-none"
                    >
                      {/* <img
                        src={item.image || item.product?.primaryImage}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded cursor-pointer"
                        onClick={() =>
                          setPopupImg(item.image || item.product?.primaryImage)
                        }
                      /> */}

                      <img
                        src={getImageURL(
                          item.image || item.product?.primaryImage
                        )}
                        alt={item.product?.name}
                        className="w-16 h-16 object-cover rounded cursor-pointer"
                        onClick={() =>
                          setPopupImg(
                            getImageURL(
                              item.image || item.product?.primaryImage
                            )
                          )
                        }
                        onLoad={() =>
                          setImgStatus((prev) => ({
                            ...prev,
                            [item._id]: "Yes Image",
                          }))
                        }
                        onError={() =>
                          setImgStatus((prev) => ({
                            ...prev,
                            [item._id]: "No Image",
                          }))
                        }
                      />

                      <div className="flex-1">
                        <div className="font-medium">{item.product?.name}</div>
                        <div className="text-sm text-gray-600">
                          Qty: {item.quantity} × ₹{item.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping & Billing Address */}
                <div className="mt-4 flex flex-col gap-4">
                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-medium">Shipping Address</h3>
                    <div className="text-sm text-gray-700 text-left">
                      {order.shippingAddress?.name},{" "}
                      {order.shippingAddress?.address},{" "}
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state} -{" "}
                      {order.shippingAddress?.pincode}
                      <br />
                      Phone: {order.shippingAddress?.phone}
                    </div>
                  </div>

                  {/* Billing Address with Button */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Billing Address</h3>
                      <div className="text-sm text-gray-700 text-left">
                        {order.billingAddress?.name},{" "}
                        {order.billingAddress?.address},{" "}
                        {order.billingAddress?.city},{" "}
                        {order.billingAddress?.state} -{" "}
                        {order.billingAddress?.pincode}
                        <br />
                        Phone: {order.billingAddress?.phone}
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button
                        className="px-2 py-1 text-xs md:text-xl bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowModal(true);
                        }}
                      >
                        View Invoice
                      </button>
                    </div>
                  </div>
                </div>

                {/* Payment & Summary */}
                {/* Payment & Summary Responsive */}
                <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  {/* Left: Status + Progress */}
                  <div className="flex flex-col gap-2 sm:flex-1">
                    {/* Status Text */}
                    <div className="flex justify-between items-center text-base text-green-700 font-bold">
                      <span>Status:</span>
                      <span className="capitalize">{order.status}</span>
                    </div>

                    {/* Progress Line */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center w-full h-2 rounded-full overflow-hidden bg-gray-200">
                        {statuses.map((status, index) => {
                          const currentIndex = statuses.indexOf(order.status);
                          const isActive = index <= currentIndex;

                          return (
                            <div
                              key={status}
                              className={`h-2 flex-1 transition-all duration-500 ${
                                isActive ? statusColors[status] : "bg-gray-200"
                              }`}
                            />
                          );
                        })}
                      </div>

                      {/* Status Labels */}
                      <div className="flex flex-col sm:flex-row justify-between w-full text-sm mt-1 gap-1">
                        {statuses.map((status) => (
                          <span
                            key={status}
                            className={`capitalize font-semibold ${
                              order.status === status
                                ? "font-bold text-green-800"
                                : "text-gray-500"
                            }`}
                          >
                            {status}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Product Amount & Total Paid */}
                  <div className="flex flex-col gap-4 sm:items-end text-sm font-bold">
                    <div>
                      Product Amount (Excl. Tax): ₹
                      {productAmountExclTax.toLocaleString("en-IN")}
                    </div>
                    <div>Tax: ₹{tax.toLocaleString("en-IN")}</div>
                    <div className="text-green-700 text-xl font-bold">Total Paid: ₹{total.toLocaleString("en-IN")}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Invoice Modal */}
      {showModal && selectedOrder && (
        <InvoiceModal
          order={selectedOrder}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Returns Section */}
      <section className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-2">Recent Returns</h2>
        <div className="space-y-2">
          {returns.length === 0 && <div>No recent returns.</div>}
          {returns.map((r) => (
            <div
              key={r._id}
              className="border rounded-xl p-3 flex justify-between bg-gray-50"
            >
              <div>
                <div className="font-medium">Return #{r.returnNumber}</div>
                <div className="text-sm text-gray-600">{r.status}</div>
              </div>
              <div className="font-semibold">₹{r.refund?.amount || 0}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Image Popup Modal */}
      {popupImg && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative">
            <img
              src={popupImg}
              alt="Full view"
              className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg"
            />
            <button
              onClick={() => setPopupImg(null)}
              className="absolute top-2 right-2 bg-white text-black px-2 py-1 rounded-full font-bold hover:bg-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
