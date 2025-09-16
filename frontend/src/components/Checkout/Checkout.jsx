import React, { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import client from "../../api/client";

export default function Checkout() {
  const { cart, refreshCart } = useContext(CartContext);
  const [shipping, setShipping] = useState({ name: "", phone: "", address: "", city: "", state: "", pincode: "" });
  const [billingSame, setBillingSame] = useState(true);
  const [billing, setBilling] = useState({ name: "", phone: "", address: "", city: "", state: "", pincode: "" });
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const placeOrder = async () => {
    setProcessing(true);
    setError("");
    setSuccess("");
    try {
      const items = (cart?.items || []).map(i => ({ product: i.product._id, quantity: i.quantity }));
      const res = await client.post("/orders", {
        items,
        shippingAddress: shipping,
        billingAddress: billingSame ? shipping : billing,
        paymentMethod,
        paymentDetails: {},
      });
      if (res?.success) {
        setSuccess(`Order placed: ${res.data.order.orderNumber}`);
        await refreshCart();
      }
    } catch (e) {
      setError(e.message || "Failed to place order");
    } finally {
      setProcessing(false);
    }
  };

  const addrFields = (obj, setObj, label) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <input className="border rounded px-3 py-2" placeholder={`${label} Name`} value={obj.name} onChange={(e)=> setObj({ ...obj, name: e.target.value })} />
      <input className="border rounded px-3 py-2" placeholder={`${label} Phone`} value={obj.phone} onChange={(e)=> setObj({ ...obj, phone: e.target.value })} />
      <input className="border rounded px-3 py-2 md:col-span-2" placeholder={`${label} Address`} value={obj.address} onChange={(e)=> setObj({ ...obj, address: e.target.value })} />
      <input className="border rounded px-3 py-2" placeholder="City" value={obj.city} onChange={(e)=> setObj({ ...obj, city: e.target.value })} />
      <input className="border rounded px-3 py-2" placeholder="State" value={obj.state} onChange={(e)=> setObj({ ...obj, state: e.target.value })} />
      <input className="border rounded px-3 py-2" placeholder="Pincode" value={obj.pincode} onChange={(e)=> setObj({ ...obj, pincode: e.target.value })} />
    </div>
  );

  const totals = cart?.totals || { subtotal: 0, discount: 0, total: 0 };

  return (
    <div className="p-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-3">Shipping Address</h2>
          {addrFields(shipping, setShipping, "Shipping")}
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Billing Address</h2>
            <label className="text-sm"><input type="checkbox" checked={billingSame} onChange={(e)=> setBillingSame(e.target.checked)} className="mr-2"/>Same as shipping</label>
          </div>
          {!billingSame && addrFields(billing, setBilling, "Billing")}
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-3">Payment Method</h2>
          <select className="border rounded px-3 py-2" value={paymentMethod} onChange={(e)=> setPaymentMethod(e.target.value)}>
            <option value="upi">UPI</option>
            <option value="reference">Reference</option>
            <option value="card">Card</option>
            <option value="wallet">Wallet</option>
          </select>
        </div>
      </div>
      <div className="bg-white rounded shadow p-4 h-fit">
        <h2 className="font-semibold mb-3">Order Summary</h2>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{totals.subtotal}</span></div>
          <div className="flex justify-between"><span>Discount</span><span>- ₹{totals.discount}</span></div>
          <div className="flex justify-between font-bold pt-2 border-t"><span>Total</span><span>₹{totals.total}</span></div>
        </div>
        {error && <div className="text-red-600 text-sm mt-3">{error}</div>}
        {success && <div className="text-green-600 text-sm mt-3">{success}</div>}
        <button disabled={processing} onClick={placeOrder} className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60">
          {processing ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}


