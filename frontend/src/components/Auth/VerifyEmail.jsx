import React, { useState } from "react";
import client from "../../api/client";

export default function VerifyEmail() {
  const [token, setToken] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true); setMsg("");
    try {
      const res = await client.post('/auth/verify-email', { token });
      setMsg(res?.message || 'Email verified');
    } catch (e) {
      setMsg(e.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-3">
      <h1 className="text-2xl font-bold">Verify Email</h1>
      <input className="border rounded px-3 py-2 w-full" placeholder="Verification token" value={token} onChange={(e)=> setToken(e.target.value)} />
      <button disabled={loading || !token} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60" onClick={submit}>{loading? 'Verifying...' : 'Verify'}</button>
      {msg && <div className="text-sm">{msg}</div>}
    </div>
  );
}


