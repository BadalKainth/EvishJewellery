import React, { useState } from "react";
import client from "../../api/client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true); setMsg("");
    try {
      const res = await client.post('/auth/forgot-password', { email });
      setMsg(res?.message || 'If the email exists, a reset link has been sent');
    } catch (e) {
      setMsg(e.message || 'Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-3">
      <h1 className="text-2xl font-bold">Forgot Password</h1>
      <input className="border rounded px-3 py-2 w-full" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)} />
      <button disabled={loading || !email} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60" onClick={submit}>{loading? 'Sending...' : 'Send Reset Link'}</button>
      {msg && <div className="text-sm">{msg}</div>}
    </div>
  );
}


