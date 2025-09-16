import React, { useState } from "react";
import client from "../../api/client";

export default function ChangePassword() {
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNewPass] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true); setMsg("");
    try {
      const res = await client.post('/auth/change-password', { currentPassword, newPassword });
      setMsg(res?.message || 'Password changed successfully');
    } catch (e) {
      setMsg(e.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-3">
      <h1 className="text-2xl font-bold">Change Password</h1>
      <input className="border rounded px-3 py-2 w-full" placeholder="Current password" type="password" value={currentPassword} onChange={(e)=> setCurrent(e.target.value)} />
      <input className="border rounded px-3 py-2 w-full" placeholder="New password" type="password" value={newPassword} onChange={(e)=> setNewPass(e.target.value)} />
      <button disabled={loading || !currentPassword || !newPassword} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60" onClick={submit}>{loading? 'Changing...' : 'Change Password'}</button>
      {msg && <div className="text-sm">{msg}</div>}
    </div>
  );
}


