"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ContentTypeField {
  name: string;
  type?: string;
  kind: string;
  required?: boolean;
}

interface ContentType {
  _id: string;
  name: string;
  slug: string;
  fields: ContentTypeField[];
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function ContentTypesPage() {
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search ? { search } : {}),
      });

      const res = await fetch(`/api/cms/contenttypes?${params.toString()}`);
      const data = await res.json();
      setContentTypes(data.items || []);
      setPagination(data.pagination);
      setLoading(false);
    }
    fetchData();
  }, [page, search]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Content Types</h1>
        <Link
          href="/admin/contenttypes/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Content Type
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset page when searching
          }}
          placeholder="Search content types..."
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Slug</th>
              <th className="border px-4 py-2 text-left">Fields</th>
              <th className="border px-4 py-2 text-left">Created</th>
              <th className="border px-4 py-2 text-left">Updated</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : contentTypes.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No content types found
                </td>
              </tr>
            ) : (
              contentTypes.map((ct) => (
                <tr key={ct._id}>
                  <td className="border px-4 py-2">{ct.name}</td>
                  <td className="border px-4 py-2">{ct.slug}</td>
                  <td className="border px-4 py-2">
                    <ul className="list-disc pl-5">
                      {ct.fields.map((f, i) => (
                        <li
                          key={i}
                          className={f.required ? `text-red-500` : ""}
                        >
                          {f.name} (
                          {f.type == "string" ? "text" : f.type || f.kind}
                          {f.required ? ", required" : ""})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(ct.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(ct.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    <Link
                      href={`/admin/contenttypes/edit/${ct.slug}`}
                      className="text-white hover:underline"
                    >
                      <button className="bg-amber-500 py-2 px-3 rounded text-white font-semibold">
                        Edit
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            disabled={page >= pagination.pages}
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
