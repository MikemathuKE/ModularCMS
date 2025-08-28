"use client";

import { useState, useEffect } from "react";

interface Media {
  _id: string;
  filename: string;
  url: string;
  type: "image" | "video" | "audio";
  width?: number;
  height?: number;
  duration?: number;
}

export default function MediaPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"image" | "video" | "audio">("image");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  async function fetchMedia() {
    setLoading(true);
    const res = await fetch(
      `/api/cms/media?type=${type}&page=${page}&search=${encodeURIComponent(
        search
      )}`
    );
    const data = await res.json();
    setMedia(data.items);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  }

  useEffect(() => {
    fetchMedia();
  }, [type, page, search]);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    await fetch("/api/cms/media", {
      method: "POST",
      body: formData,
    });
    form.reset();
    fetchMedia();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/cms/media/${id}`, { method: "DELETE" });
    fetchMedia();
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Media Registry</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        {["image", "video", "audio"].map((t) => (
          <button
            key={t}
            onClick={() => {
              setType(t as any);
              setPage(1);
            }}
            className={`pb-2 border-b-2 ${
              type === t
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}s
          </button>
        ))}
      </div>

      {/* Upload Form */}
      <form
        onSubmit={handleUpload}
        className="flex items-center gap-4 mb-6 border p-4 rounded bg-gray-50"
      >
        <input type="file" name="file" required className="flex-1" />
        <select name="type" required className="border rounded px-2 py-1">
          <option value="">Select Type</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Upload
        </button>
      </form>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder={`Search ${type}s...`}
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      {/* Media List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {media.map((m) => (
            <div
              key={m._id}
              className="border p-3 rounded shadow bg-white flex flex-col items-center"
            >
              {m.type === "image" ? (
                <img src={m.url} alt={m.filename} className="max-h-40" />
              ) : m.type === "video" ? (
                <video controls src={m.url} className="max-h-40" />
              ) : (
                <audio controls src={m.url} />
              )}
              <p className="mt-2 text-sm">{m.filename}</p>
              <button
                onClick={() => handleDelete(m._id)}
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
