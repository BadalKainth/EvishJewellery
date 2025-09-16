import React, { useEffect, useState } from "react";
import client from "../../api/client";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toggling, setToggling] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get("/users/admin/all", { limit: 50 });
        if (res?.success) setUsers(res.data.users);
      } catch (e) {
        setError(e.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">Loading users...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-2xl font-bold">Users</h1>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 capitalize">{u.role}</td>
                <td className="p-3">{u.isActive ? 'Active' : 'Inactive'}</td>
                <td className="p-3">
                  <button disabled={toggling===u._id} className="px-3 py-1 border rounded" onClick={async ()=>{
                    try {
                      setToggling(u._id);
                      await client.patch(`/users/admin/${u._id}/status`, { isActive: !u.isActive });
                      const res = await client.get("/users/admin/all", { limit: 50 });
                      if (res?.success) setUsers(res.data.users);
                    } catch (e) {
                      alert(e.message || 'Failed to update user');
                    } finally {
                      setToggling("");
                    }
                  }}>{toggling===u._id? 'Updating...' : (u.isActive? 'Deactivate' : 'Activate')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


