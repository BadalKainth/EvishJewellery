import React, { useContext, useEffect, useState } from "react";
import client from "../../api/client";
import { AuthContext } from "../../context/AuthContext";

export default function Account() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
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

  // Helper function to calculate product amount excl tax
  const getAmounts = (order) => {
    const total = order.pricing?.total || 0;
    const tax = order.pricing?.tax || 0;
    const productAmountExclTax = total - tax;
    return { total, tax, productAmountExclTax };
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
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
                      <img
                        src={item.image || item.product?.primaryImage}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded cursor-pointer"
                        onClick={() =>
                          setPopupImg(item.image || item.product?.primaryImage)
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
                <div className="mt-4">
                  <h3 className="font-medium">Shipping Address</h3>
                  <div className="text-sm text-gray-700">
                    {order.shippingAddress?.name},{" "}
                    {order.shippingAddress?.address},{" "}
                    {order.shippingAddress?.city},{" "}
                    {order.shippingAddress?.state} -{" "}
                    {order.shippingAddress?.pincode}
                    <br />
                    Phone: {order.shippingAddress?.phone}
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="font-medium">Billing Address</h3>
                  <div className="text-sm text-gray-700">
                    {order.billingAddress?.name},{" "}
                    {order.billingAddress?.address},{" "}
                    {order.billingAddress?.city}, {order.billingAddress?.state}{" "}
                    - {order.billingAddress?.pincode}
                    <br />
                    Phone: {order.billingAddress?.phone}
                  </div>
                </div>

                {/* Payment & Summary */}
                <div className="mt-4 border-t pt-3 flex justify-between text-sm">
                  <div>
                    <div>
                      Product Amount (Excl. Tax): ₹
                      {productAmountExclTax.toLocaleString("en-IN")}
                    </div>
                    <div>Tax: ₹{tax.toLocaleString("en-IN")}</div>
                  </div>
                  <div className="text-right font-bold text-lg">
                    Total Paid: ₹{total.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

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
