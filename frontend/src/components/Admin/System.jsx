import React, { useEffect, useState } from "react";
import client from "../../api/client";

export default function AdminSystem() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get('/admin/system-health');
        if (res?.success) setData(res.data.health);
      } catch (e) {
        setError(e.message || 'Failed to fetch system health');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">Loading system health...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-3">System Health</h1>
      <div className="bg-white rounded shadow p-4 text-sm">
        <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}


