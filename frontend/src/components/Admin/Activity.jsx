import React, { useEffect, useState } from "react";
import client from "../../api/client";

export default function AdminActivity() {
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get('/admin/activity-log', { limit: 50 });
        if (res?.success) setLog(res.data.activityLog);
      } catch (e) {
        setError(e.message || 'Failed to fetch activity log');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">Loading activity...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-2xl font-bold">Activity Log</h1>
      <div className="bg-white rounded shadow p-4 text-sm space-y-2">
        {log.map((a) => (
          <div key={`${a.type}-${a.id}`} className="border-b pb-2">
            <div className="font-medium capitalize">{a.type}: {a.title}</div>
            <div className="text-gray-600">{a.description}</div>
            <div className="text-xs">{new Date(a.timestamp).toLocaleString()}</div>
          </div>
        ))}
        {log.length === 0 && <div>No activity.</div>}
      </div>
    </div>
  );
}


