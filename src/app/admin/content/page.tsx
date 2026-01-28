"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ContentType } from "@/lib/types/types";

export default function ContentPage() {
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTypes() {
      setLoading(true);
      const res = await fetch(
        `/api/cms/contenttypes?search=${encodeURIComponent(search)}`,
      );
      const data = await res.json();
      setContentTypes(data.items || []);
      setLoading(false);
    }
    fetchTypes();
  }, [search]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Content</h1>
        <Link
          href="/admin/contenttypes/new"
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          Add Content Type
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search content types..."
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : contentTypes.length === 0 ? (
        <p className="text-gray-600">No content types found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left border-b">Name</th>
                <th className="p-3 text-left border-b">Slug</th>
                <th className="p-3 text-left border-b">Fields</th>
                <th className="p-3 text-right border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contentTypes.map((ct) => (
                <tr key={ct._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{ct.name}</td>
                  <td className="p-3 border-b">{ct.slug}</td>
                  <td className="p-3 border-b">
                    {ct.fields.map((f) => (
                      <span
                        key={f.name}
                        className="inline-block px-2 py-1 mr-1 text-xs rounded bg-gray-200"
                      >
                        {f.name} ({f.type})
                      </span>
                    ))}
                  </td>
                  <td className="p-3 border-b text-right">
                    <Link
                      href={`/admin/content/${ct.slug}`}
                      className="px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
