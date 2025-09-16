import React, { useEffect, useState } from "react";
import client from "../../api/client";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    price: 0,
    category: "rings",
    type: "gold",
    material: "",
    weight: 1,
    stock: 0,
    tags: "",
    imagesCsv: "",
    isFeatured: false,
  });
  const [editingId, setEditingId] = useState("");
  const [editForm, setEditForm] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulk, setBulk] = useState({ action: "activate", value: 0 });

  const load = async () => {
    setLoading(true);
    try {
      const res = await client.get("/products", { limit: 50 });
      if (res?.success) setProducts(res.data.products);
    } catch (e) {
      setError(e.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (p) => {
    try {
      await client.put(`/products/${p._id}`, { ...p, isActive: !p.isActive });
      await load();
    } catch (e) {
      alert(e.message || 'Failed to update');
    }
  };

  const updateStock = async (p, operation, value) => {
    try {
      await client.patch(`/products/${p._id}/stock`, { operation, quantity: Number(value) || 0, stock: Number(value) || p.stock });
      await load();
    } catch (e) {
      alert(e.message || 'Failed to update stock');
    }
  };

  const makeImagesArray = (csv) =>
    (csv || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((url, idx) => ({ url, isPrimary: idx === 0 }));

  const createProduct = async () => {
    setCreating(true);
    try {
      const payload = {
        name: createForm.name,
        description: createForm.description,
        price: Number(createForm.price),
        category: createForm.category,
        type: createForm.type,
        material: createForm.material,
        weight: Number(createForm.weight),
        stock: Number(createForm.stock),
        isFeatured: !!createForm.isFeatured,
        tags: createForm.tags ? createForm.tags.split(",").map((t) => t.trim()) : [],
        images: makeImagesArray(createForm.imagesCsv),
      };
      await client.post("/products", payload);
      setCreateForm({ name: "", description: "", price: 0, category: "rings", type: "gold", material: "", weight: 1, stock: 0, tags: "", imagesCsv: "", isFeatured: false });
      await load();
    } catch (e) {
      alert(e.message || "Failed to create product");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setEditForm({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      type: p.type,
      material: p.material,
      weight: p.weight,
      stock: p.stock,
      tags: (p.tags || []).join(","),
      imagesCsv: (p.images || []).map((i) => i.url).join(","),
      isFeatured: !!p.isFeatured,
      isActive: !!p.isActive,
    });
  };

  const saveEdit = async (id) => {
    try {
      const payload = {
        ...editForm,
        price: Number(editForm.price),
        weight: Number(editForm.weight),
        stock: Number(editForm.stock),
        tags: editForm.tags ? editForm.tags.split(",").map((t) => t.trim()) : [],
        images: makeImagesArray(editForm.imagesCsv),
      };
      await client.put(`/products/${id}`, payload);
      setEditingId("");
      await load();
    } catch (e) {
      alert(e.message || "Failed to save changes");
    }
  };

  const toggleSelect = (id, checked) => {
    setSelectedIds((prev) => (checked ? [...new Set([...prev, id])] : prev.filter((x) => x !== id)));
  };

  const runBulk = async () => {
    if (selectedIds.length === 0) return;
    try {
      const body = { action: bulk.action, productIds: selectedIds };
      if (bulk.action === "update-stock") body.data = { stock: Number(bulk.value) || 0 };
      await client.post("/admin/products/bulk", body);
      setSelectedIds([]);
      await load();
    } catch (e) {
      alert(e.message || "Bulk action failed");
    }
  };

  if (loading) return <div className="p-6">Loading products...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-2xl font-bold">Products</h1>

      {/* Create product */}
      <div className="bg-white rounded shadow p-3 space-y-2">
        <h2 className="font-semibold">Create Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input className="border rounded px-2 py-1" placeholder="Name" value={createForm.name} onChange={(e)=> setCreateForm({ ...createForm, name: e.target.value })} />
          <input className="border rounded px-2 py-1" placeholder="Price" type="number" value={createForm.price} onChange={(e)=> setCreateForm({ ...createForm, price: e.target.value })} />
          <select className="border rounded px-2 py-1" value={createForm.category} onChange={(e)=> setCreateForm({ ...createForm, category: e.target.value })}>
            {["necklaces","earrings","bracelets","rings","anklets","couple-sets"].map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="border rounded px-2 py-1" value={createForm.type} onChange={(e)=> setCreateForm({ ...createForm, type: e.target.value })}>
            {["gold","silver","diamond","platinum","rose-gold","white-gold","other"].map(t=> <option key={t} value={t}>{t}</option>)}
          </select>
          <input className="border rounded px-2 py-1" placeholder="Material" value={createForm.material} onChange={(e)=> setCreateForm({ ...createForm, material: e.target.value })} />
          <input className="border rounded px-2 py-1" placeholder="Weight" type="number" value={createForm.weight} onChange={(e)=> setCreateForm({ ...createForm, weight: e.target.value })} />
          <input className="border rounded px-2 py-1" placeholder="Stock" type="number" value={createForm.stock} onChange={(e)=> setCreateForm({ ...createForm, stock: e.target.value })} />
          <input className="border rounded px-2 py-1 md:col-span-2" placeholder="Tags (comma)" value={createForm.tags} onChange={(e)=> setCreateForm({ ...createForm, tags: e.target.value })} />
          <input className="border rounded px-2 py-1 md:col-span-3" placeholder="Image URLs (comma)" value={createForm.imagesCsv} onChange={(e)=> setCreateForm({ ...createForm, imagesCsv: e.target.value })} />
          <textarea className="border rounded px-2 py-1 md:col-span-3" placeholder="Description" value={createForm.description} onChange={(e)=> setCreateForm({ ...createForm, description: e.target.value })} />
          <label className="text-sm"><input type="checkbox" className="mr-2" checked={createForm.isFeatured} onChange={(e)=> setCreateForm({ ...createForm, isFeatured: e.target.checked })} />Featured</label>
        </div>
        <button disabled={creating} className="px-3 py-1 border rounded" onClick={createProduct}>{creating? 'Creating...' : 'Create'}</button>
      </div>

      {/* Bulk actions */}
      <div className="bg-white rounded shadow p-3 flex items-center gap-2">
        <span className="text-sm">Bulk:</span>
        <select className="border rounded px-2 py-1" value={bulk.action} onChange={(e)=> setBulk({ ...bulk, action: e.target.value })}>
          {["activate","deactivate","delete","update-stock"].map(a=> <option key={a} value={a}>{a}</option>)}
        </select>
        {bulk.action === 'update-stock' && (
          <input className="border rounded px-2 py-1 w-24" placeholder="Stock" type="number" value={bulk.value} onChange={(e)=> setBulk({ ...bulk, value: e.target.value })} />
        )}
        <button className="px-3 py-1 border rounded" onClick={runBulk}>Run</button>
        <span className="text-xs text-gray-600">Selected: {selectedIds.length}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {products.map((p) => (
          <div key={p._id} className="border rounded p-3">
            <div className="flex items-start justify-between">
              <input type="checkbox" onChange={(e)=> toggleSelect(p._id, e.target.checked)} />
            </div>
            <img src={p.primaryImage || p.images?.[0]?.url} alt={p.name} className="w-full h-36 object-cover rounded" />
            <div className="mt-2 font-semibold">{p.name}</div>
            <div className="text-sm text-gray-600">₹{p.price}</div>
            <div className="text-xs capitalize">{p.category} / {p.type}</div>
            <div className="flex gap-2 mt-3 flex-wrap">
              <button onClick={() => toggleActive(p)} className="px-3 py-1 border rounded">
                {p.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <div className="flex items-center gap-2">
                <input className="w-20 border rounded px-2 py-1" type="number" placeholder="Qty" id={`qty-${p._id}`} />
                <button className="px-3 py-1 border rounded" onClick={() => updateStock(p, 'add', document.getElementById(`qty-${p._id}`).value)}>Add</button>
                <button className="px-3 py-1 border rounded" onClick={() => updateStock(p, 'subtract', document.getElementById(`qty-${p._id}`).value)}>Subtract</button>
              </div>
              <button className="px-3 py-1 border rounded" onClick={()=> startEdit(p)}>{editingId===p._id? 'Editing' : 'Edit'}</button>
            </div>

            {editingId === p._id && (
              <div className="mt-3 space-y-2">
                <input className="border rounded px-2 py-1 w-full" placeholder="Name" value={editForm.name} onChange={(e)=> setEditForm({ ...editForm, name: e.target.value })} />
                <input className="border rounded px-2 py-1 w-full" placeholder="Price" type="number" value={editForm.price} onChange={(e)=> setEditForm({ ...editForm, price: e.target.value })} />
                <input className="border rounded px-2 py-1 w-full" placeholder="Material" value={editForm.material} onChange={(e)=> setEditForm({ ...editForm, material: e.target.value })} />
                <input className="border rounded px-2 py-1 w-full" placeholder="Weight" type="number" value={editForm.weight} onChange={(e)=> setEditForm({ ...editForm, weight: e.target.value })} />
                <input className="border rounded px-2 py-1 w-full" placeholder="Stock" type="number" value={editForm.stock} onChange={(e)=> setEditForm({ ...editForm, stock: e.target.value })} />
                <input className="border rounded px-2 py-1 w-full" placeholder="Tags (comma)" value={editForm.tags} onChange={(e)=> setEditForm({ ...editForm, tags: e.target.value })} />
                <input className="border rounded px-2 py-1 w-full" placeholder="Image URLs (comma)" value={editForm.imagesCsv} onChange={(e)=> setEditForm({ ...editForm, imagesCsv: e.target.value })} />
                <textarea className="border rounded px-2 py-1 w-full" placeholder="Description" value={editForm.description} onChange={(e)=> setEditForm({ ...editForm, description: e.target.value })} />
                <label className="text-sm"><input type="checkbox" className="mr-2" checked={!!editForm.isFeatured} onChange={(e)=> setEditForm({ ...editForm, isFeatured: e.target.checked })} />Featured</label>
                <label className="text-sm"><input type="checkbox" className="mr-2" checked={!!editForm.isActive} onChange={(e)=> setEditForm({ ...editForm, isActive: e.target.checked })} />Active</label>
                <div className="flex gap-2">
                  <button className="px-3 py-1 border rounded" onClick={()=> saveEdit(p._id)}>Save</button>
                  <button className="px-3 py-1 border rounded" onClick={()=> setEditingId("")}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


