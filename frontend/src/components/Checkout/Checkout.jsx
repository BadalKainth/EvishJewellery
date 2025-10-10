// Checkout.jsx
import React, { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import client from "../../api/client";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react"; // ✅ Named import

import { FaGooglePay, FaWhatsapp } from "react-icons/fa";
import { SiPaytm, SiPhonepe } from "react-icons/si";

export default function Checkout() {
  const { cart, refreshCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

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
  const [fieldErrors, setFieldErrors] = useState({});
  const [globalError, setGlobalError] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [transactionId, setUtrNumber] = useState("");
  const [utrError, setUtrError] = useState("");
  const [upiString, setUpiString] = useState("");

  const navigate = useNavigate();

  // ----------------- Form Validation -----------------
  const validateForm = () => {
    const errors = {};
    const fields = ["name", "phone", "address", "city", "state", "pincode"];

    fields.forEach((f) => {
      if (!shipping[f]?.trim())
        errors[`shippingAddress.${f}`] = `${f} is required`;
    });
    if (shipping.phone && !/^\d{10}$/.test(shipping.phone))
      errors["shippingAddress.phone"] = "Phone must be 10 digits";
    if (shipping.pincode && !/^\d+$/.test(shipping.pincode))
      errors["shippingAddress.pincode"] = "Pincode must be numeric";

    if (!billingSame) {
      fields.forEach((f) => {
        if (!billing[f]?.trim())
          errors[`billingAddress.${f}`] = `${f} is required`;
      });
      if (billing.phone && !/^\d{10}$/.test(billing.phone))
        errors["billingAddress.phone"] = "Phone must be 10 digits";
      if (billing.pincode && !/^\d+$/.test(billing.pincode))
        errors["billingAddress.pincode"] = "Pincode must be numeric";
    }

    if (!paymentMethod) errors["paymentMethod"] = "Payment method required";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ----------------- Open Popup -----------------
  const openPaymentPopup = () => {
    if (!validateForm()) {
      setGlobalError("Please fill all required details correctly.");
      return;
    }
    setGlobalError("");

    // Generate UPI string for QR dynamically
    const totalAmount = cart?.totals?.total || 0;
    const upi = `upi://pay?pa=paytmqr1vw6ypkkhx@paytm&pn=NehaGupta&am=${totalAmount}&cu=INR`;
    setUpiString(upi);

    setShowPopup(true);
  };

  // ----------------- Confirm Order -----------------
  const confirmOrder = async () => {
    if (!transactionId.trim()) {
      setUtrError("Transaction ID required");
      return;
    }

    setProcessing(true);
    setUtrError("");
    setSuccess("");
    setFieldErrors({});
    setGlobalError("");

    try {
      const items = (cart?.items || []).map((i) => ({
        product: i.product._id,
        name: i.product.name,
        image: i.product.image,
        price: i.product.price,
        quantity: i.quantity,
        total: i.quantity * i.product.price,
      }));

      const payload = {
        user: user?._id,
        items,
        shippingAddress: shipping,
        billingAddress: billingSame ? shipping : billing,
        paymentMethod,
        paymentDetails: {
          transactionId,
          paymentStatus: "pending",
        },
        pricing: {
          subtotal: cart.totals.subtotal,
          discount:
            (cart.totals.discount || 0) + (cart.totals.coupon?.discount || 0),
          shipping: 0,
          tax: 0,
          total: cart.totals.total,
        },
        coupon: cart.totals.coupon
          ? JSON.stringify({
              code: cart.totals.coupon.code,
              discount: cart.totals.coupon.discount,
              type: cart.totals.coupon.type || "fixed",
            })
          : null,
      };

      const res = await client.post("/orders", payload);

      if (res?.data?.order) {
        setSuccess(`Order placed: ${res.data.order.orderNumber}`);
        await refreshCart();
        setShowPopup(false);
        setTimeout(() => navigate("/account"), 800);
      } else {
        setGlobalError(res?.data?.message || "Failed to place order");
      }
    } catch (e) {
      setGlobalError(e.message || "Failed to place order");
    } finally {
      setProcessing(false);
    }
  };

  // ----------------- Address Fields -----------------
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
            type={f.key === "phone" ? "tel" : "text"}
            maxLength={f.key === "phone" ? 10 : undefined}
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
  const couponDiscount = cart?.totals?.coupon?.discount || 0;
  const subtotal = totals.subtotal;
  const discount = (totals.discount || 0) + couponDiscount;
  const total = subtotal - discount;

  // ----------------- JSX -----------------
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
      </div>

      <div className="bg-white rounded shadow p-4 h-fit">
        <h2 className="font-semibold mb-3">Order Summary</h2>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          {/* <div className="flex justify-between">
            <span>Discount</span>
            <span>- ₹{discount.toLocaleString("en-IN")}</span>
          </div> */}
          {couponDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Coupon Discount</span>
              <span>- ₹{couponDiscount.toLocaleString("en-IN")}</span>
            </div>
          )}
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
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
          onClick={openPaymentPopup}
          className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {processing ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-2/5 relative">
            <div>
              <h1 className="text-2xl font-bold ">Use UPI to pay</h1>
              <p>1. Open tha app linked to your UPI</p>
              <p>2. Scan tha QR code</p>
              <p>3. Write down your UTR Id to Complete transaction</p>
            </div>
            <h2 className="text-lg font-semibold mb-4">Complete Payment</h2>

            <div className="flex justify-center">
              {upiString ? (
                <QRCodeCanvas value={upiString} size={288} />
              ) : (
                <p className="text-gray-500">Generating QR...</p>
              )}
            </div>

            {/* *************************************** */}
            <div className="flex flex-wrap items-center justify-center gap-4 p-6">
              {/* BHIM */}
              <div className="flex flex-col items-center">
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA9UlEQVR4AWNAB////2eHsZ/ka3WAGRqi/AzB2nYMpIAwLQEtoAH/wZxIvQqGRucfxOlE2N4GMgCIZwM1XwXi/wxuKjmkGPAaasBb1kannyADgPgmKQb8h+HaclOQZgjWENUjqLncSgzsfyQM0gzDHwkacCtL4xC6AXNLjRCGROtHE3L+H5AmPK64hVOziSQXPzbNRwv1kA1YiNOALmfJQnTNq0oMkDVnEXL+JWTNy0sMUTSTFH19ZSbImn0IanZX5pWGae4vM36ApNmD2MQzCWpAD1DTM6hmG1JTXzGIDdasLKRNUgaa6yNbBqKBGgWBSdaIGD0A213NGQgHQY4AAAAASUVORK5CYII="
                  alt="BHIM"
                  className="h-8 w-auto object-contain cursor-pointer hover:scale-105"
                />
              </div>

              {/* GPay */}
              <div className="flex flex-col items-center">
                <img
                  src="https://lh6.ggpht.com/rGCJgNVPB-osrt52EGg4XM2njJLtrtfCEom7eqq0hKIf9e2gziiHWrXtLqBRGq-t95tJzFJgRA"
                  alt="GPay"
                  className="h-8 w-auto object-contain cursor-pointer hover:scale-105"
                />
              </div>

              {/* Paytm */}
              <div className="flex flex-col items-center">
                <img
                  src="https://play-lh.googleusercontent.com/IWU8HM1uQuW8wVrp6XpyOOJXvb_1tDPUDAOfkrl83RZPG9Ww3dCY9X1AV6T1atSvgXc=s64-rw"
                  alt="Paytm"
                  className="h-8 w-auto object-contain cursor-pointer hover:scale-105"
                />
              </div>

              {/* PhonePe */}
              <div className="flex flex-col items-center">
                <img
                  src="https://play-lh.googleusercontent.com/6iyA2zVz5PyyMjK5SIxdUhrb7oh9cYVXJ93q6DZkmx07Er1o90PXYeo6mzL4VC2Gj9s=s64-rw"
                  alt="PhonePe"
                  className="h-8 w-auto object-contain cursor-pointer hover:scale-105"
                />
              </div>

              {/* WhatsApp Pay */}
              <div className="flex flex-col items-center">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5e/WhatsApp_icon.png"
                  alt="WhatsApp Pay"
                  className="h-8 w-auto object-contain cursor-pointer hover:scale-105"
                />
              </div>
            </div>

            <input
              type="text"
              maxLength={16}
              placeholder="Enter Transaction ID"
              value={transactionId}
              onChange={(e) =>
                setUtrNumber(e.target.value.replace(/[^0-9A-Za-z]/g, ""))
              }
              className={`border rounded px-3 py-2 w-full ${
                utrError ? "border-red-500" : ""
              }`}
            />
            {utrError && (
              <p className="text-red-500 text-xs mt-1">{utrError}</p>
            )}

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                disabled={processing}
                onClick={confirmOrder}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
              >
                {processing ? "Confirming..." : "Confirm Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
