import React, { useEffect, useState } from "react";
import client from "../../api/client";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ code: "", name: "", type: "percentage", value: 10, isActive: true, isPublic: true, validFrom: new Date().toISOString().slice(0,10), validUntil: new Date(Date.now()+7*24*60*60*1000).toISOString().slice(0,10) });

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get("/coupons/admin/all", { limit: 50 });
        if (res?.success) setCoupons(res.data.coupons);
      } catch (e) {
        setError(e.message || "Failed to load coupons");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">Loading coupons...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-2xl font-bold">Coupons</h1>
      <div className="bg-white rounded shadow p-3 space-y-2">
        <h2 className="font-semibold">Create Coupon</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input className="border rounded px-2 py-1" placeholder="Code" value={form.code} onChange={(e)=> setForm({ ...form, code: e.target.value.toUpperCase() })} />
          <input className="border rounded px-2 py-1" placeholder="Name" value={form.name} onChange={(e)=> setForm({ ...form, name: e.target.value })} />
          <select className="border rounded px-2 py-1" value={form.type} onChange={(e)=> setForm({ ...form, type: e.target.value })}>
            <option value="percentage">percentage</option>
            <option value="fixed">fixed</option>
          </select>
          <input type="number" className="border rounded px-2 py-1" placeholder="Value" value={form.value} onChange={(e)=> setForm({ ...form, value: Number(e.target.value) })} />
          <label className="text-sm"><input type="checkbox" className="mr-2" checked={form.isActive} onChange={(e)=> setForm({ ...form, isActive: e.target.checked })}/>Active</label>
          <label className="text-sm"><input type="checkbox" className="mr-2" checked={form.isPublic} onChange={(e)=> setForm({ ...form, isPublic: e.target.checked })}/>Public</label>
          <input type="date" className="border rounded px-2 py-1" value={form.validFrom} onChange={(e)=> setForm({ ...form, validFrom: e.target.value })} />
          <input type="date" className="border rounded px-2 py-1" value={form.validUntil} onChange={(e)=> setForm({ ...form, validUntil: e.target.value })} />
        </div>
        <button disabled={creating} className="px-3 py-1 border rounded" onClick={async ()=>{
          try {
            setCreating(true);
            const payload = { ...form, validFrom: new Date(form.validFrom), validUntil: new Date(form.validUntil) };
            await client.post('/coupons', payload);
            const res = await client.get("/coupons/admin/all", { limit: 50 });
            if (res?.success) setCoupons(res.data.coupons);
          } catch (e) {
            alert(e.message || 'Failed to create');
          } finally {
            setCreating(false);
          }
        }}>{creating? 'Creating...' : 'Create'}</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {coupons.map((c) => (
          <div key={c._id} className="border rounded p-3">
            <div className="font-semibold">{c.code} — {c.name}</div>
            <div className="text-sm text-gray-600">{c.type} {c.value}</div>
            <div className="text-xs">Valid: {new Date(c.validFrom).toLocaleDateString()} - {new Date(c.validUntil).toLocaleDateString()}</div>
            <div className="text-xs">Active: {c.isActive ? 'Yes' : 'No'}</div>
            <div className="mt-2">
              <button className="px-3 py-1 border rounded" onClick={async ()=>{
                try {
                  await client.patch(`/coupons/admin/${c._id}/toggle`);
                  const res = await client.get("/coupons/admin/all", { limit: 50 });
                  if (res?.success) setCoupons(res.data.coupons);
                } catch (e) {
                  alert(e.message || 'Failed to toggle');
                }
              }}>{c.isActive ? 'Deactivate' : 'Activate'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


