import React, { useEffect, useState } from "react";
import client from "../../api/client";
import { useDropzone } from "react-dropzone"; // ✅ added

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    originalPrice: "",
    price: "",
    category: "bracelets",
    type: "gold",
    material: "",
    weight: "",
    stock: "",
    tags: "",
    size: "",
    imagesCsv: "",
    isFeatured: false,
  });
  const [errors, setErrors] = useState({});
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

  useEffect(() => {
    load();
  }, []);

  const onDrop = (acceptedFiles) => {
    setCreateForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...acceptedFiles],
    }));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
  });

  // ✅ Remove image from preview
  const removeImage = (index) => {
    setCreateForm((prev) => {
      const updated = [...prev.images];
      updated.splice(index, 1);
      return { ...prev, images: updated };
    });
  };

  const toggleActive = async (p) => {
    try {
      await client.put(`/products/${p._id}`, { ...p, isActive: !p.isActive });
      await load();
    } catch (e) {
      alert(e.message || "Failed to update");
    }
  };

  const updateStock = async (p, operation, value) => {
    try {
      await client.patch(`/products/${p._id}/stock`, {
        operation,
        quantity: Number(value) || 0,
        stock: Number(value) || p.stock,
      });
      await load();
    } catch (e) {
      alert(e.message || "Failed to update stock");
    }
  };

  const makeImagesArray = (csv) =>
    (csv || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((url, idx) => ({ url, isPrimary: idx === 0 }));

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};
    if (!createForm.name.trim()) newErrors.name = "Name is required";
    if (!createForm.price || createForm.price <= 0)
      newErrors.price = "Valid price is required";
    if (!createForm.originalPrice || createForm.originalPrice <= 0)
      newErrors.originalPrice = "Valid Original Price is required";
    if (createForm.images.length === 0)
      newErrors.images = "At least one image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Create product (send FormData with files)
  const createProduct = async () => {
    if (!validateForm()) return;
    setCreating(true);
    try {
      const formData = new FormData();
      formData.append("name", createForm.name);
      formData.append("description", createForm.description);
      formData.append("price", Number(createForm.price));
      formData.append("originalPrice", Number(createForm.originalPrice));
      formData.append("category", createForm.category);
      formData.append("type", createForm.type);
      formData.append("material", createForm.material);
      formData.append("weight", Number(createForm.weight));
      formData.append("stock", Number(createForm.stock));
      formData.append("size", Number(createForm.size));
      formData.append("isFeatured", createForm.isFeatured);
      if (createForm.tags) {
        createForm.tags
          .split(",")
          .map((t) => t.trim())
          .forEach((tag) => formData.append("tags[]", tag));
      }

      // append multiple images
      createForm.images.forEach((file) => {
        formData.append("images", file);
      });

      await client.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCreateForm({
        name: "",
        description: "",
        price: "",
        originalPrice: "",
        category: "rings",
        type: "gold",
        material: "",
        weight: "",
        stock: "",
        size: "",
        images: [],
        imagesCsv: "",
        isFeatured: false,
      });
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
      originalPrice: p.originalPrice,
      category: p.category,
      type: p.type,
      material: p.material,
      weight: p.weight,
      stock: p.stock,
      size: p.size,
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
        originalPrice: Number(editForm.originalPrice),
        weight: Number(editForm.weight),
        stock: Number(editForm.stock),
        size: Number(editForm.size),
        tags: editForm.tags
          ? editForm.tags.split(",").map((t) => t.trim())
          : [],
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
    setSelectedIds((prev) =>
      checked ? [...new Set([...prev, id])] : prev.filter((x) => x !== id)
    );
  };

  const runBulk = async () => {
    if (selectedIds.length === 0) return;
    try {
      const body = { action: bulk.action, productIds: selectedIds };
      if (bulk.action === "update-stock")
        body.data = { stock: Number(bulk.value) || 0 };
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
          <input
            className="border rounded px-2 py-1"
            placeholder="Name"
            value={createForm.name}
            onChange={(e) =>
              setCreateForm({ ...createForm, name: e.target.value })
            }
          />
          <input
            className="border rounded px-2 py-1"
            placeholder="Original Price"
            type="number"
            value={createForm.originalPrice}
            onChange={
              (e) =>
                setCreateForm({ ...createForm, originalPrice: e.target.value }) // ✅ correct
            }
          />
          <input
            className="border rounded px-2 py-1"
            placeholder="Selling Price"
            type="number"
            value={createForm.price}
            onChange={(e) =>
              setCreateForm({ ...createForm, price: e.target.value })
            }
          />

          <select
            className="border rounded px-2 py-1"
            value={createForm.category}
            onChange={(e) =>
              setCreateForm({ ...createForm, category: e.target.value })
            }
          >
            {[
              "bracelets",
              "rings",
              "earrings",
              "necklaces",
              "couple-sets",
              "anklets",
              "bags",
              "women-dress",
              "watch",
            ].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className="border rounded px-2 py-1"
            value={createForm.type}
            onChange={(e) =>
              setCreateForm({ ...createForm, type: e.target.value })
            }
          >
            {[
              "gold",
              "silver",
              "diamond",
              "platinum",
              "rose-gold",
              "white-gold",
              "cotton",
              "other",
            ].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            className="border rounded px-2 py-1"
            placeholder="Material"
            value={createForm.material}
            onChange={(e) =>
              setCreateForm({ ...createForm, material: e.target.value })
            }
          />
          <input
            className="border rounded px-2 py-1"
            placeholder="Weight"
            type="number"
            value={createForm.weight}
            onChange={(e) =>
              setCreateForm({ ...createForm, weight: e.target.value })
            }
          />
          <input
            className="border rounded px-2 py-1"
            placeholder="Stock"
            type="number"
            value={createForm.stock}
            onChange={(e) =>
              setCreateForm({ ...createForm, stock: e.target.value })
            }
          />

          <input
            className="border rounded px-2 py-1"
            placeholder="Size No"
            type="number"
            value={createForm.size}
            onChange={(e) =>
              setCreateForm({ ...createForm, size: e.target.value })
            }
          />
          <input
            className="border rounded px-2 py-1 md:col-span-2"
            placeholder="Tags (comma)"
            value={createForm.tags}
            onChange={(e) =>
              setCreateForm({ ...createForm, tags: e.target.value })
            }
          />

          {/* ✅ Image uploader */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded p-4 text-center col-span-3 cursor-pointer ${
              isDragActive ? "bg-green-100" : "bg-gray-50"
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag & drop images here, or click to select</p>
            )}
          </div>
          {errors.images && (
            <span className="text-red-500 text-sm col-span-3">
              {errors.images}
            </span>
          )}

          <div className="flex flex-wrap gap-2 col-span-3">
            {Array.isArray(createForm.images) &&
              createForm.images.map((file, idx) => (
                <div key={idx} className="relative w-24 h-24">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-24 h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1"
                  >
                    ×
                  </button>
                </div>
              ))}
          </div>

          <textarea
            className="border rounded px-2 py-1 md:col-span-3"
            placeholder="Description"
            value={createForm.description}
            onChange={(e) =>
              setCreateForm({ ...createForm, description: e.target.value })
            }
          />
          <label className="text-sm">
            <input
              type="checkbox"
              className="mr-2"
              checked={createForm.isFeatured}
              onChange={(e) =>
                setCreateForm({ ...createForm, isFeatured: e.target.checked })
              }
            />
            Featured
          </label>
        </div>
        <button
          disabled={creating}
          className="px-3 py-1 border rounded"
          onClick={createProduct}
        >
          {creating ? "Creating..." : "Create"}
        </button>
      </div>

      {/* Bulk actions */}
      <div className="bg-white rounded shadow p-3 flex items-center gap-2">
        <span className="text-sm">Bulk:</span>
        <select
          className="border rounded px-2 py-1"
          value={bulk.action}
          onChange={(e) => setBulk({ ...bulk, action: e.target.value })}
        >
          {["activate", "deactivate", "delete", "update-stock"].map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        {bulk.action === "update-stock" && (
          <input
            className="border rounded px-2 py-1 w-24"
            placeholder="Stock"
            type="number"
            value={bulk.value}
            onChange={(e) => setBulk({ ...bulk, value: e.target.value })}
          />
        )}
        <button className="px-3 py-1 border rounded" onClick={runBulk}>
          Run
        </button>
        <span className="text-xs text-gray-600">
          Selected: {selectedIds.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {products.map((p) => (
          <div key={p._id} className="border rounded p-3">
            <div className="flex items-start justify-between">
              <input
                type="checkbox"
                onChange={(e) => toggleSelect(p._id, e.target.checked)}
              />
            </div>
            <img
              src={p.primaryImage || p.images?.[0]?.url}
              alt={p.name}
              className="w-full h-36 object-cover rounded"
            />
            <div className="mt-2 font-semibold">{p.name}</div>
            <div className="text-sm text-gray-600">₹{p.originalPrice}</div>
            <div className="text-sm text-gray-600">₹{p.price}</div>
            <div className="text-xs capitalize">
              {p.category} / {p.type}
            </div>
            {/* ✅ Stock Display with color coding */}
            <div
              className={`text-sm font-medium ${
                p.stock < 10 ? "text-red-600" : "text-green-600"
              }`}
            >
              Stock: {p.stock}
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              <button
                onClick={() => toggleActive(p)}
                className="px-3 py-1 border rounded"
              >
                {p.isActive ? "Deactivate" : "Activate"}
              </button>
              <div className="flex items-center gap-2">
                <input
                  className="w-20 border rounded px-2 py-1"
                  type="number"
                  placeholder="Qty"
                  id={`qty-${p._id}`}
                />
                <button
                  className="px-3 py-1 border rounded"
                  onClick={() =>
                    updateStock(
                      p,
                      "add",
                      document.getElementById(`qty-${p._id}`).value
                    )
                  }
                >
                  Add
                </button>
                <button
                  className="px-3 py-1 border rounded"
                  onClick={() =>
                    updateStock(
                      p,
                      "subtract",
                      document.getElementById(`qty-${p._id}`).value
                    )
                  }
                >
                  Subtract
                </button>
              </div>
              <button
                className="px-3 py-1 border rounded"
                onClick={() => startEdit(p)}
              >
                {editingId === p._id ? "Editing" : "Edit"}
              </button>
            </div>

            {editingId === p._id && (
              <div className="mt-3 space-y-2">
                <input
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Name"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />

                <input
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Original Price"
                  type="number"
                  value={editForm.originalPrice}
                  onChange={
                    (e) =>
                      setEditForm({
                        ...editForm,
                        originalPrice: e.target.value,
                      }) // ✅ correct
                  }
                />
                <input
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Selling Price"
                  type="number"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: e.target.value })
                  }
                />

                <input
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Material"
                  value={editForm.material}
                  onChange={(e) =>
                    setEditForm({ ...editForm, material: e.target.value })
                  }
                />
                <input
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Weight"
                  type="number"
                  value={editForm.weight}
                  onChange={(e) =>
                    setEditForm({ ...editForm, weight: e.target.value })
                  }
                />
                <input
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Stock"
                  type="number"
                  value={editForm.stock}
                  onChange={(e) =>
                    setEditForm({ ...editForm, stock: e.target.value })
                  }
                />
                <input
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Tags (comma)"
                  value={editForm.tags}
                  onChange={(e) =>
                    setEditForm({ ...editForm, tags: e.target.value })
                  }
                />
                <input
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Image URLs (comma)"
                  value={editForm.imagesCsv}
                  onChange={(e) =>
                    setEditForm({ ...editForm, imagesCsv: e.target.value })
                  }
                />
                <textarea
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Description"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                />
                <label className="text-sm">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={!!editForm.isFeatured}
                    onChange={(e) =>
                      setEditForm({ ...editForm, isFeatured: e.target.checked })
                    }
                  />
                  Featured
                </label>
                <label className="text-sm">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={!!editForm.isActive}
                    onChange={(e) =>
                      setEditForm({ ...editForm, isActive: e.target.checked })
                    }
                  />
                  Active
                </label>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 border rounded"
                    onClick={() => saveEdit(p._id)}
                  >
                    Save
                  </button>
                  <button
                    className="px-3 py-1 border rounded"
                    onClick={() => setEditingId("")}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
