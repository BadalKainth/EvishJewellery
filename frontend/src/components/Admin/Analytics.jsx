import React, { useEffect, useState } from "react";
import client from "../../api/client";

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState('30d');
  const [type, setType] = useState('sales');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res = await client.get('/admin/analytics', { period, type });
      if (res?.success) setData(res.data);
    } catch (e) {
      setError(e.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [period, type]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <div className="flex gap-2">
        <select className="border rounded px-2 py-1" value={period} onChange={(e)=> setPeriod(e.target.value)}>
          {['7d','30d','90d','1y'].map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select className="border rounded px-2 py-1" value={type} onChange={(e)=> setType(e.target.value)}>
          {['sales','orders','users','products'].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      {loading && <div>Loading analytics...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && data && (
        <div className="bg-white rounded shadow p-4 text-sm overflow-x-auto">
          <pre className="whitespace-pre-wrap">{JSON.stringify(data.analytics || data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}


