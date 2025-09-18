import React, { useState } from "react";
import { useParams } from "react-router-dom";
import client from "../../api/client";

export default function UploadReturnMedia() {
  const { id } = useParams();
  const [type, setType] = useState("image");
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setMsg("");
    try {
      if (type === "comment") {
        await client.post(`/returns/${id}/media`, { type: "comment", content });
      } else {
        const form = new FormData();
        form.append("media", file);
        form.append("type", type);
        await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
          }/returns/${id}/media`,
          {
            method: "POST",
            body: form,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        ).then(async (res) => {
          if (!res.ok)
            throw new Error(
              (await res.json().catch(() => ({})))?.message || "Upload failed"
            );
        });
      }
      setMsg("Uploaded successfully");
    } catch (e) {
      setMsg(e.message || "Failed to upload");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold">Upload Return Media</h1>
      <select
        className="border rounded px-3 py-2"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="image">Image</option>
        <option value="video">Video</option>
        <option value="comment">Comment</option>
      </select>
      {type === "comment" ? (
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Write a comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      ) : (
        <input
          type="file"
          accept={type === "image" ? "image/*" : "video/*"}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      )}
      <button
        disabled={loading || (type !== "comment" && !file)}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
        onClick={submit}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
      {msg && <div className="text-sm">{msg}</div>}
    </div>
  );
}
