import React, { useState } from "react";
import client from "../../api/client";

export default function AdminExport() {
  const [type, setType] = useState('orders');
  const [format, setFormat] = useState('json');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const doExport = async () => {
    setLoading(true); setError(''); setData(null);
    try {
      const res = await client.post('/admin/export', { type, format });
      setData(res.data);
    } catch (e) {
      setError(e.message || 'Export failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-2xl font-bold">Export Data</h1>
      <div className="flex gap-2">
        <select className="border rounded px-2 py-1" value={type} onChange={(e)=> setType(e.target.value)}>
          {['products','orders','users','returns'].map(t=> <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="border rounded px-2 py-1" value={format} onChange={(e)=> setFormat(e.target.value)}>
          {['json','csv'].map(f=> <option key={f} value={f}>{f}</option>)}
        </select>
        <button className="px-3 py-1 border rounded" onClick={doExport} disabled={loading}>{loading? 'Exporting...' : 'Export'}</button>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      {data && (
        <div className="bg-white rounded shadow p-4 text-sm overflow-x-auto">
          <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}


