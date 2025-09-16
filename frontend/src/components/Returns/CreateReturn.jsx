import React, { useEffect, useState } from "react";
import client from "../../api/client";

export default function CreateReturn() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [items, setItems] = useState([]);
  const [reason, setReason] = useState("defective");
  const [description, setDescription] = useState("");
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const res = await client.get("/orders", { limit: 10, status: "delivered" });
      if (res?.success) setOrders(res.data.orders);
    })();
  }, []);

  useEffect(() => {
    if (!selectedOrder) { setItems([]); return; }
    const order = orders.find(o => o._id === selectedOrder);
    if (order) {
      setItems(order.items.map(i => ({ product: i.product._id, name: i.name, price: i.price, quantity: 1, maxQty: i.quantity, reason: "defective", condition: "unopened" })));
    }
  }, [selectedOrder, orders]);

  const submit = async () => {
    setSending(true);
    setMsg("");
    try {
      const payload = {
        order: selectedOrder,
        items: items.map(i => ({ product: i.product, quantity: i.quantity, reason: i.reason, condition: i.condition })),
        reason,
        description,
      };
      const res = await client.post("/returns", payload);
      if (res?.success) setMsg(`Return submitted: ${res.data.return.returnNumber}`);
    } catch (e) {
      setMsg(e.message || 'Failed to submit return');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Request a Return</h1>
      <div className="bg-white rounded shadow p-4 space-y-3">
        <select className="border rounded px-3 py-2" value={selectedOrder} onChange={(e)=> setSelectedOrder(e.target.value)}>
          <option value="">Select delivered order</option>
          {orders.map(o => <option key={o._id} value={o._id}>{o.orderNumber} — ₹{o.pricing.total}</option>)}
        </select>
        {items.length>0 && (
          <div className="space-y-2">
            {items.map((it, idx)=> (
              <div key={it.product} className="flex items-center gap-2">
                <div className="flex-1 text-sm">{it.name}</div>
                <input type="number" min={1} max={it.maxQty} value={it.quantity} onChange={(e)=>{
                  const copy = [...items]; copy[idx].quantity = Number(e.target.value); setItems(copy);
                }} className="w-20 border rounded px-2 py-1" />
                <select value={it.reason} onChange={(e)=>{ const copy=[...items]; copy[idx].reason=e.target.value; setItems(copy); }} className="border rounded px-2 py-1">
                  {["defective","wrong-item","size-issue","quality-issue","not-as-described","damaged-in-transit","changed-mind","other"].map(r=> <option key={r} value={r}>{r}</option>)}
                </select>
                <select value={it.condition} onChange={(e)=>{ const copy=[...items]; copy[idx].condition=e.target.value; setItems(copy); }} className="border rounded px-2 py-1">
                  {["unopened","opened-unused","used","damaged"].map(c=> <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            ))}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <select className="border rounded px-3 py-2" value={reason} onChange={(e)=> setReason(e.target.value)}>
            {["defective","wrong-item","size-issue","quality-issue","not-as-described","damaged-in-transit","changed-mind","other"].map(r=> <option key={r} value={r}>{r}</option>)}
          </select>
          <input className="border rounded px-3 py-2" placeholder="Description" value={description} onChange={(e)=> setDescription(e.target.value)} />
        </div>
        <button disabled={sending || !selectedOrder} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60" onClick={submit}>{sending? 'Submitting...' : 'Submit Return'}</button>
        {msg && <div className="text-sm mt-2">{msg}</div>}
      </div>
    </div>
  );
}


