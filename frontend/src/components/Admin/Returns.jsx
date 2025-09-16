import React, { useEffect, useState } from "react";
import client from "../../api/client";

export default function AdminReturns() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [statusForm, setStatusForm] = useState({ status: 'under-review', message: 'Updated by admin', adminNotes: '' });
  const [pickupForm, setPickupForm] = useState({ addressName: '', phone: '', address: '', city: '', state: '', pincode: '', scheduledDate: '', carrier: '', trackingNumber: '' });
  const [refundForm, setRefundForm] = useState({ refundAmount: 0, refundMethod: 'original-payment' });

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get("/returns/admin/all", { limit: 20 });
        if (res?.success) setItems(res.data.returns);
      } catch (e) {
        setError(e.message || "Failed to load returns");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">Loading returns...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-2xl font-bold">Returns</h1>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3">Return</th>
              <th className="p-3">User</th>
              <th className="p-3">Order</th>
              <th className="p-3">Status</th>
              <th className="p-3">Refund</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="p-3 font-medium">{r.returnNumber}</td>
                <td className="p-3">{r.user?.name}</td>
                <td className="p-3">{r.order?.orderNumber}</td>
                <td className="p-3 capitalize">{r.status}</td>
                <td className="p-3">₹{r.refund?.amount || 0}</td>
                <td className="p-3">
                  <div className="space-y-2 min-w-[320px]">
                    <div className="flex gap-2">
                      <select className="border rounded px-2 py-1" value={statusForm.status} onChange={(e)=> setStatusForm({ ...statusForm, status: e.target.value })}>
                        {["pending","under-review","approved","rejected","refund-processed","item-received","completed"].map(s=> <option key={s} value={s}>{s}</option>)}
                      </select>
                      <input className="border rounded px-2 py-1" placeholder="Message" value={statusForm.message} onChange={(e)=> setStatusForm({ ...statusForm, message: e.target.value })} />
                      <button disabled={updatingId===r._id} className="px-3 py-1 border rounded" onClick={async ()=>{
                        try {
                          setUpdatingId(r._id);
                          await client.patch(`/returns/${r._id}/status`, { status: statusForm.status, message: statusForm.message, adminNotes: statusForm.adminNotes, refundAmount: refundForm.refundAmount, refundMethod: refundForm.refundMethod });
                          const res = await client.get("/returns/admin/all", { limit: 20 });
                          if (res?.success) setItems(res.data.returns);
                        } catch (e) {
                          alert(e.message || 'Failed to update status');
                        } finally {
                          setUpdatingId("");
                        }
                      }}>{updatingId===r._id? 'Updating...' : 'Update Status'}</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input className="border rounded px-2 py-1" placeholder="Name" value={pickupForm.addressName} onChange={(e)=> setPickupForm({ ...pickupForm, addressName: e.target.value })} />
                      <input className="border rounded px-2 py-1" placeholder="Phone" value={pickupForm.phone} onChange={(e)=> setPickupForm({ ...pickupForm, phone: e.target.value })} />
                      <input className="border rounded px-2 py-1 col-span-2" placeholder="Address" value={pickupForm.address} onChange={(e)=> setPickupForm({ ...pickupForm, address: e.target.value })} />
                      <input className="border rounded px-2 py-1" placeholder="City" value={pickupForm.city} onChange={(e)=> setPickupForm({ ...pickupForm, city: e.target.value })} />
                      <input className="border rounded px-2 py-1" placeholder="State" value={pickupForm.state} onChange={(e)=> setPickupForm({ ...pickupForm, state: e.target.value })} />
                      <input className="border rounded px-2 py-1" placeholder="Pincode" value={pickupForm.pincode} onChange={(e)=> setPickupForm({ ...pickupForm, pincode: e.target.value })} />
                      <input type="date" className="border rounded px-2 py-1" value={pickupForm.scheduledDate} onChange={(e)=> setPickupForm({ ...pickupForm, scheduledDate: e.target.value })} />
                      <input className="border rounded px-2 py-1" placeholder="Carrier" value={pickupForm.carrier} onChange={(e)=> setPickupForm({ ...pickupForm, carrier: e.target.value })} />
                      <input className="border rounded px-2 py-1" placeholder="Tracking #" value={pickupForm.trackingNumber} onChange={(e)=> setPickupForm({ ...pickupForm, trackingNumber: e.target.value })} />
                      <button className="px-3 py-1 border rounded col-span-2" onClick={async ()=>{
                        try {
                          const address = { name: pickupForm.addressName, phone: pickupForm.phone, address: pickupForm.address, city: pickupForm.city, state: pickupForm.state, pincode: pickupForm.pincode };
                          await client.patch(`/returns/${r._id}/pickup`, { address, scheduledDate: pickupForm.scheduledDate, carrier: pickupForm.carrier, trackingNumber: pickupForm.trackingNumber });
                          const res = await client.get("/returns/admin/all", { limit: 20 });
                          if (res?.success) setItems(res.data.returns);
                        } catch (e) {
                          alert(e.message || 'Failed to update pickup');
                        }
                      }}>Save Pickup</button>
                    </div>
                    <div className="flex gap-2">
                      <input className="border rounded px-2 py-1" placeholder="Refund amount" type="number" value={refundForm.refundAmount} onChange={(e)=> setRefundForm({ ...refundForm, refundAmount: e.target.value })} />
                      <select className="border rounded px-2 py-1" value={refundForm.refundMethod} onChange={(e)=> setRefundForm({ ...refundForm, refundMethod: e.target.value })}>
                        {["original-payment","store-credit","bank-transfer","upi"].map(m=> <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


