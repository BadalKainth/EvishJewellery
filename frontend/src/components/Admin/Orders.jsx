import React, { useEffect, useState } from "react";
import client from "../../api/client";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: "confirmed", message: "Updated by admin" });
  const [paymentForm, setPaymentForm] = useState({ paymentStatus: "completed", transactionId: "" });

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

  useEffect(() => { load(); }, []);

  if (loading) return <div className="p-6">Loading orders...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-2xl font-bold">Orders</h1>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
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
              <tr key={o._id} className="border-t">
                <td className="p-3 font-medium">{o.orderNumber}</td>
                <td className="p-3">{o.user?.name} ({o.user?.email})</td>
                <td className="p-3 font-semibold">₹{o.pricing.total}</td>
                <td className="p-3 capitalize">{o.status}</td>
                <td className="p-3">
                  <div className="flex flex-col gap-2 min-w-[280px]">
                    <div className="flex gap-2">
                      <select className="border rounded px-2 py-1" value={statusForm.status} onChange={(e)=> setStatusForm({ ...statusForm, status: e.target.value })}>
                        {[
                          "pending","confirmed","processing","shipped","delivered","cancelled","returned"
                        ].map(s=> <option key={s} value={s}>{s}</option>)}
                      </select>
                      <input className="border rounded px-2 py-1" placeholder="Message" value={statusForm.message} onChange={(e)=> setStatusForm({ ...statusForm, message: e.target.value })} />
                      <button disabled={updatingId===o._id} className="px-3 py-1 border rounded" onClick={async ()=>{
                        try {
                          setUpdatingId(o._id);
                          await client.patch(`/orders/${o._id}/status`, { status: statusForm.status, message: statusForm.message });
                          await load();
                        } catch (e) {
                          alert(e.message || 'Failed to update status');
                        } finally {
                          setUpdatingId(null);
                        }
                      }}>{updatingId===o._id? 'Updating...' : 'Update Status'}</button>
                    </div>
                    <div className="flex gap-2">
                      <select className="border rounded px-2 py-1" value={paymentForm.paymentStatus} onChange={(e)=> setPaymentForm({ ...paymentForm, paymentStatus: e.target.value })}>
                        {["pending","completed","failed","refunded","partial_refund"].map(s=> <option key={s} value={s}>{s}</option>)}
                      </select>
                      <input className="border rounded px-2 py-1" placeholder="Transaction Id" value={paymentForm.transactionId} onChange={(e)=> setPaymentForm({ ...paymentForm, transactionId: e.target.value })} />
                      <button disabled={updatingId===o._id} className="px-3 py-1 border rounded" onClick={async ()=>{
                        try {
                          setUpdatingId(o._id);
                          await client.patch(`/orders/${o._id}/payment`, { paymentStatus: paymentForm.paymentStatus, transactionId: paymentForm.transactionId });
                          await load();
                        } catch (e) {
                          alert(e.message || 'Failed to update payment');
                        } finally {
                          setUpdatingId(null);
                        }
                      }}>{updatingId===o._id? 'Updating...' : 'Update Payment'}</button>
                    </div>
                    <div className="flex gap-2">
                      <input className="border rounded px-2 py-1" placeholder="Carrier" onChange={(e)=> o._trackingCarrier = e.target.value} />
                      <input className="border rounded px-2 py-1" placeholder="Tracking #" onChange={(e)=> o._trackingNumber = e.target.value} />
                      <input type="date" className="border rounded px-2 py-1" onChange={(e)=> o._estimatedDelivery = e.target.value} />
                      <button disabled={updatingId===o._id} className="px-3 py-1 border rounded" onClick={async ()=>{
                        try {
                          setUpdatingId(o._id);
                          await client.patch(`/orders/${o._id}/status`, { status: 'shipped', message: 'Tracking updated', trackingNumber: o._trackingNumber, carrier: o._trackingCarrier, estimatedDelivery: o._estimatedDelivery });
                          await load();
                        } catch (e) {
                          alert(e.message || 'Failed to update tracking');
                        } finally {
                          setUpdatingId(null);
                        }
                      }}>Save Tracking</button>
                    </div>
                  </div>
                </td>
                <td className="p-3">{new Date(o.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


