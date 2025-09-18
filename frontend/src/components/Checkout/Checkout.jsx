import React, { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import client from "../../api/client";

export default function Checkout() {
  const { cart, refreshCart } = useContext(CartContext);
  const [shipping, setShipping] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [billingSame, setBillingSame] = useState(true);
  const [billing, setBilling] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({}); // ✅ inline field errors
  const [globalError, setGlobalError] = useState(""); // ✅ single error under Place Order

  const placeOrder = async () => {
    setProcessing(true);
    setSuccess("");
    setFieldErrors({});
    setGlobalError("");
    try {
      const items = (cart?.items || []).map((i) => ({
        product: i.product._id,
        quantity: i.quantity,
      }));

      const res = await client.post("/orders", {
        items,
        shippingAddress: shipping,
        billingAddress: billingSame ? shipping : billing,
        paymentMethod,
        paymentDetails: {},
      });

      if (res?.data?.success) {
        setSuccess(`Order placed: ${res.data.order.orderNumber}`);
        await refreshCart();
        cart.clear();
      }
    } catch (e) {
      const apiError = e.response?.data;
      if (apiError?.details?.length) {
        const mapped = {};
        apiError.details.forEach((d) => {
          mapped[d.field] = d.error;
        });
        setFieldErrors(mapped);
      } else {
        setGlobalError(
          apiError?.message || e.message || "Failed to place order"
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  const addrFields = (obj, setObj, label, prefix) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {[
        { key: "name", label: `${label} Name` },
        { key: "phone", label: `${label} Phone` },
        { key: "address", label: `${label} Address`, col: "md:col-span-2" },
        { key: "city", label: "City" },
        { key: "state", label: "State" },
        { key: "pincode", label: "Pincode" },
      ].map((f) => (
        <div key={f.key} className={f.col || ""}>
          <input
            className={`border rounded px-3 py-2 w-full ${
              fieldErrors[`${prefix}.${f.key}`] ? "border-red-500" : ""
            }`}
            placeholder={f.label}
            value={obj[f.key]}
            onChange={(e) => setObj({ ...obj, [f.key]: e.target.value })}
          />
          {fieldErrors[`${prefix}.${f.key}`] && (
            <p className="text-red-500 text-xs mt-1">
              {fieldErrors[`${prefix}.${f.key}`]}
            </p>
          )}
        </div>
      ))}
    </div>
  );

  const totals = cart?.totals || { subtotal: 0, discount: 0, total: 0 };

  return (
    <div className="p-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-3">Shipping Address</h2>
          {addrFields(shipping, setShipping, "Shipping", "shippingAddress")}
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Billing Address</h2>
            <label className="text-sm">
              <input
                type="checkbox"
                checked={billingSame}
                onChange={(e) => setBillingSame(e.target.checked)}
                className="mr-2"
              />
              Same as shipping
            </label>
          </div>
          {!billingSame &&
            addrFields(billing, setBilling, "Billing", "billingAddress")}
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-3">Payment Method</h2>
          <select
            className={`border rounded px-3 py-2 w-full ${
              fieldErrors["paymentMethod"] ? "border-red-500" : ""
            }`}
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="upi">UPI</option>
            <option value="reference">Reference</option>
            <option value="card">Card</option>
            <option value="wallet">Wallet</option>
          </select>
          {fieldErrors["paymentMethod"] && (
            <p className="text-red-500 text-xs mt-1">
              {fieldErrors["paymentMethod"]}
            </p>
          )}
        </div>
      </div>
      <div className="bg-white rounded shadow p-4 h-fit">
        <h2 className="font-semibold mb-3">Order Summary</h2>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{totals.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>- ₹{totals.discount}</span>
          </div>
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total</span>
            <span>₹{totals.total}</span>
          </div>
        </div>
        {success && (
          <div className="text-green-600 text-sm mt-3">{success}</div>
        )}
        {globalError && (
          <div className="text-red-600 text-sm mt-3">{globalError}</div>
        )}
        <button
          disabled={processing}
          onClick={placeOrder}
          className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {processing ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
