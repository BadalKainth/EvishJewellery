import React, { useEffect, useState } from "react";
import client from "../../api/client";

export default function Addresses() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", state: "", pincode: "", isDefault: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const res = await client.get('/users/profile');
      if (res?.success) setProfile(res.data.user);
    } catch (e) {
      setError(e.message || 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const addAddress = async () => {
    setSaving(true);
    try {
      await client.post('/users/addresses', form);
      setForm({ name: "", phone: "", address: "", city: "", state: "", pincode: "", isDefault: false });
      await load();
    } catch (e) {
      alert(e.message || 'Failed to add address');
    } finally {
      setSaving(false);
    }
  };

  const updateAddress = async (addressId, data) => {
    try {
      await client.put(`/users/addresses/${addressId}`, data);
      await load();
    } catch (e) {
      alert(e.message || 'Failed to update address');
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      await client.delete(`/users/addresses/${addressId}`);
      await load();
    } catch (e) {
      alert(e.message || 'Failed to delete address');
    }
  };

  if (loading) return <div className="p-6">Loading addresses...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Addresses</h1>
      <div className="bg-white rounded shadow p-4">
        <h2 className="font-semibold mb-2">Add Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input className="border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={(e)=> setForm({ ...form, name: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder="Phone" value={form.phone} onChange={(e)=> setForm({ ...form, phone: e.target.value })} />
          <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Address" value={form.address} onChange={(e)=> setForm({ ...form, address: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder="City" value={form.city} onChange={(e)=> setForm({ ...form, city: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder="State" value={form.state} onChange={(e)=> setForm({ ...form, state: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder="Pincode" value={form.pincode} onChange={(e)=> setForm({ ...form, pincode: e.target.value })} />
          <label className="text-sm"><input type="checkbox" className="mr-2" checked={form.isDefault} onChange={(e)=> setForm({ ...form, isDefault: e.target.checked })} />Set as default</label>
        </div>
        <button disabled={saving} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60" onClick={addAddress}>{saving? 'Saving...' : 'Add Address'}</button>
      </div>

      <div className="bg-white rounded shadow p-4">
        <h2 className="font-semibold mb-2">Your Addresses</h2>
        <div className="space-y-2">
          {profile?.addresses?.map((a)=> (
            <div key={a._id} className="border rounded p-3 flex justify-between items-start">
              <div className="text-sm">
                <div className="font-medium">{a.name} {a.isDefault && <span className="text-xs text-green-600">(Default)</span>}</div>
                <div>{a.phone}</div>
                <div>{a.address}, {a.city}, {a.state} - {a.pincode}</div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 border rounded" onClick={()=> updateAddress(a._id, { isDefault: true })}>Make Default</button>
                <button className="px-3 py-1 border rounded" onClick={()=> deleteAddress(a._id)}>Delete</button>
              </div>
            </div>
          ))}
          {(!profile?.addresses || profile.addresses.length===0) && <div>No addresses yet.</div>}
        </div>
      </div>
    </div>
  );
}


