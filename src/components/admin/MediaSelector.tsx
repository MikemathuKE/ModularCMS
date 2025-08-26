"use client";

import { useEffect, useState } from "react";

export default function MediaSelector({
  type,
  selected,
  onSelect,
}: {
  type: "image" | "video" | "audio";
  selected?: string;
  onSelect: (url: string) => void;
}) {
  const [media, setMedia] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 9; // items per page

  async function fetchMedia() {
    const res = await fetch(
      `/api/cms/media?type=${type}&page=${page}&limit=${limit}&q=${encodeURIComponent(
        search
      )}`
    );
    if (res.ok) {
      const data = await res.json();
      setMedia(data.items);
      setTotal(data.total);
    }
  }

  useEffect(() => {
    if (open) fetchMedia();
  }, [open, type, page, search]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const res = await fetch(`/api/cms/media`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      await fetchMedia();
      setFile(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this file?")) return;
    const res = await fetch(`/api/cms/media/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMedia((prev) => prev.filter((m) => m._id !== id));
      setTotal((prev) => prev - 1);
    }
  }

  function handleSelect(url: string) {
    onSelect(url);
    setOpen(false);
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      {/* Trigger button */}
      <button
        type="button"
        className="px-3 py-2 bg-blue-600 text-white rounded"
        onClick={() => setOpen(true)}
      >
        Select {type}
      </button>

      {/* Show selected preview */}
      {selected && (
        <div className="mt-2">
          {type === "image" && (
            <img src={selected} alt="" className="h-16 w-16 object-cover" />
          )}
          {type === "video" && (
            <video src={selected} className="h-20 w-20 object-cover" controls />
          )}
          {type === "audio" && <audio src={selected} controls />}
        </div>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Select {type}</h2>
              <button
                type="button"
                className="text-gray-500 hover:text-black"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Upload form */}
            {/* <form onSubmit={handleUpload} className="flex gap-2 mb-4">
              <input
                type="file"
                accept={
                  type === "image"
                    ? "image/*"
                    : type === "video"
                    ? "video/*"
                    : "audio/*"
                }
                onChange={(e) =>
                  setFile(e.target.files ? e.target.files[0] : null)
                }
                className="flex-1 border p-2 rounded"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-green-600 text-white rounded"
              >
                Upload
              </button>
            </form> */}

            {/* Search bar */}
            <div className="mb-4">
              <input
                type="text"
                placeholder={`Search ${type}s...`}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            {/* Media list */}
            <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {media.map((m) => (
                <div key={m._id} className="relative group border rounded p-2">
                  <button
                    type="button"
                    onClick={() => handleSelect(m.url)}
                    className={`block w-full ${
                      selected === m.url
                        ? "ring-2 ring-blue-600"
                        : "hover:ring-2 hover:ring-gray-400"
                    }`}
                  >
                    {type === "image" && (
                      <img
                        src={m.url}
                        alt=""
                        className="h-24 w-full object-cover"
                      />
                    )}
                    {type === "video" && (
                      <video
                        src={m.url}
                        className="h-24 w-full object-cover"
                        controls
                      />
                    )}
                    {type === "audio" && <audio src={m.url} controls />}
                  </button>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleDelete(m._id)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded px-1 opacity-0 group-hover:opacity-100"
                  >
                    🗑
                  </button>
                </div>
              ))}

              {media.length === 0 && (
                <p className="col-span-3 text-center text-gray-500">
                  No {type}s found
                </p>
              )}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={`px-3 py-1 rounded ${
                    page === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                >
                  Previous
                </button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={`px-3 py-1 rounded ${
                    page === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
