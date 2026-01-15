"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface DataSource {
  _id: string;
  name: string;
  slug: string;
  baseUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function DataSourcesPage() {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDataSources() {
      try {
        const res = await fetch("/api/cms/datasources");
        const data = await res.json();

        setDataSources(data.items);
      } catch (err) {
        console.error("Failed to fetch data sources", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDataSources();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Data Sources</h1>

        <Link href="/admin/datasources/new">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Create Data Source
          </button>
        </Link>
      </div>

      <table className="w-full border-collapse border border-gray-300 text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Slug</th>
            <th className="border border-gray-300 px-4 py-2">Base URL</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {dataSources.map((ds) => (
            <tr key={ds._id}>
              <td className="border border-gray-300 px-4 py-2 font-medium">
                {ds.name}
              </td>

              <td className="border border-gray-300 px-4 py-2">
                <span className="px-2 py-1 rounded bg-gray-200 text-sm">
                  {ds.slug}
                </span>
              </td>

              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                {ds.baseUrl || "—"}
              </td>

              <td className="border border-gray-300 px-4 py-2 space-x-2">
                <Link href={`/admin/datasources/${ds.slug}`}>
                  <button className="px-3 py-1 bg-green-700 text-white rounded hover:bg-gray-300">
                    Manage
                  </button>
                </Link>

                <Link href={`/admin/datasources/${ds.slug}/logs`}>
                  <button className="px-3 py-1 border bg-gray-200 rounded hover:bg-gray-100">
                    Logs
                  </button>
                </Link>
              </td>
            </tr>
          ))}

          {dataSources.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                No data sources found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
