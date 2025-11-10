"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Page {
  _id: string;
  name: string;
  slug: string;
  layout: string;
  status: "draft" | "published"; // ✅ new field
  createdAt: string;
  updatedAt: string;
}

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPages() {
      try {
        const res = await fetch("/api/cms/pages");
        const data = await res.json();
        setPages(data.data);
      } catch (err) {
        console.error("Failed to fetch pages", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPages();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pages</h1>
        <Link href="/admin/pages/new">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Create New Page
          </button>
        </Link>
      </div>

      <table className="w-full border-collapse border border-gray-300 text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Slug</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Last Updated</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page._id}>
              <td className="border border-gray-300 px-4 py-2">{page.name}</td>
              <td className="border border-gray-300 px-4 py-2">{page.slug}</td>
              <td className="border border-gray-300 px-4 py-2">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    page.status === "published"
                      ? "bg-green-600"
                      : "bg-yellow-500"
                  }`}
                >
                  {page.status}
                </span>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(page.updatedAt).toLocaleString()}
              </td>
              <td className="border border-gray-300 px-4 py-2 space-x-2">
                <Link href={`/admin/pages/edit/${page.slug}`}>
                  <button className="cursor-pointer px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
                    Edit
                  </button>
                </Link>
                <Link href={`/admin/preview/${page.slug}`}>
                  <button className="cursor-pointer px-3 py-1 border rounded hover:bg-gray-100">
                    Preview
                  </button>
                </Link>
              </td>
            </tr>
          ))}
          {pages.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                No pages found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
