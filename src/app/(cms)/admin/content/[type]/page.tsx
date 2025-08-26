"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface ContentItem {
  _id: string;
  [key: string]: any;
}

export default function ContentTypePage() {
  const { type } = useParams<{ type: string }>();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      const res = await fetch(
        `/api/cms/content/${type}?page=${page}&search=${encodeURIComponent(
          search
        )}`
      );
      const data = await res.json();
      setItems(data.items || []);
      setTotalPages(data.totalPages || 1);
      setLoading(false);
    }
    fetchItems();
  }, [type, search, page]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold capitalize">{type} Content</h1>
        <Link
          href={`/admin/content/${type}/new`}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          Add {type}
        </Link>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder={`Search ${type}...`}
          className="flex-1 px-3 py-2 border rounded-md"
        />
      </div>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-600">No {type} found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left border-b">ID</th>
                <th className="p-3 text-left border-b">Fields</th>
                <th className="p-3 text-right border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{item._id}</td>
                  <td className="p-3 border-b">
                    {Object.entries(item).map(([key, val]) => {
                      if (
                        ["_id", "createdAt", "updatedAt", "__v"].includes(key)
                      )
                        return null;
                      return (
                        <span
                          key={key}
                          className="inline-block px-2 py-1 mr-1 text-xs rounded bg-gray-200"
                        >
                          {key}: {String(val)}
                        </span>
                      );
                    })}
                  </td>
                  <td className="p-3 border-b text-right space-x-2">
                    <Link
                      href={`/admin/content/${type}/edit/${item._id}`}
                      className="px-3 py-1 m-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={async () => {
                        if (!confirm("Are you sure?")) return;
                        await fetch(`/api/cms/content/${type}/${item._id}`, {
                          method: "DELETE",
                        });
                        setItems((prev) =>
                          prev.filter((p) => p._id !== item._id)
                        );
                      }}
                      className="px-3 py-1 m-1 rounded-md bg-gray-600 text-white hover:bg-gray-700"
                    >
                      Publish
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm("Are you sure?")) return;
                        await fetch(`/api/cms/content/${type}/${item._id}`, {
                          method: "DELETE",
                        });
                        setItems((prev) =>
                          prev.filter((p) => p._id !== item._id)
                        );
                      }}
                      className="px-3 py-1 m-1 rounded-md bg-red-600 text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
