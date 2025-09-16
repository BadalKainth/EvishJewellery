import React, { useState } from "react";
import client from "../../api/client";

export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true); setMsg("");
    try {
      const res = await client.post('/auth/reset-password', { token, password });
      setMsg(res?.message || 'Password reset successfully');
    } catch (e) {
      setMsg(e.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-3">
      <h1 className="text-2xl font-bold">Reset Password</h1>
      <input className="border rounded px-3 py-2 w-full" placeholder="Reset token" value={token} onChange={(e)=> setToken(e.target.value)} />
      <input className="border rounded px-3 py-2 w-full" placeholder="New password" type="password" value={password} onChange={(e)=> setPassword(e.target.value)} />
      <button disabled={loading || !token || !password} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60" onClick={submit}>{loading? 'Resetting...' : 'Reset Password'}</button>
      {msg && <div className="text-sm">{msg}</div>}
    </div>
  );
}


