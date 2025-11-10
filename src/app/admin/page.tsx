"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardStats {
  pages: number;
  contentTypes: number;
  media: number;
  recentPages: { title: string; slug: string; updatedAt: string }[];
  recentMedia: { url: string; type: string; updatedAt: string }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch("/api/cms/stats");
      const data = await res.json();
      setStats(data);
    }
    fetchStats();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {stats ? (
        <>
          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/admin/pages"
              className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold">Pages</h2>
              <p className="text-3xl font-bold mt-2">{stats.pages}</p>
              <p className="text-sm text-gray-500 mt-1">
                Manage your site pages
              </p>
            </Link>

            <Link
              href="/admin/contenttypes"
              className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold">Content Types</h2>
              <p className="text-3xl font-bold mt-2">{stats.contentTypes}</p>
              <p className="text-sm text-gray-500 mt-1">
                Define and manage content structures
              </p>
            </Link>

            <Link
              href="/admin/media"
              className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold">Media</h2>
              <p className="text-3xl font-bold mt-2">{stats.media}</p>
              <p className="text-sm text-gray-500 mt-1">
                Upload and manage images, videos, audio
              </p>
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Pages */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Pages</h2>
              <ul className="space-y-3">
                {Object.values(stats.recentPages).map((p) => (
                  <li key={p.slug} className="flex justify-between">
                    <Link
                      href={`/admin/pages/edit/${p.slug}`}
                      className="text-blue-600 hover:underline"
                    >
                      {p.title || p.slug}
                    </Link>
                    <span className="text-xs text-gray-500">
                      {new Date(p.updatedAt).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Media */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Media</h2>
              <div className="grid grid-cols-3 gap-3">
                {Object.values(stats.recentMedia).map((m, i) => (
                  <div key={i} className="flex flex-col items-center">
                    {m.type === "image" && (
                      <img
                        src={m.url}
                        alt=""
                        className="h-16 w-16 object-cover rounded"
                      />
                    )}
                    {m.type === "video" && (
                      <video
                        src={m.url}
                        className="h-16 w-16 object-cover rounded"
                      />
                    )}
                    {m.type === "audio" && (
                      <audio src={m.url} controls className="w-20" />
                    )}
                    <span className="text-xs text-gray-500 mt-1">
                      {new Date(m.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="mt-10">
            <Link
              href="/admin/settings"
              className="bg-gray-100 border rounded-lg px-4 py-3 inline-block hover:bg-gray-200 transition"
            >
              ⚙️ Go to Settings
            </Link>
          </div>
        </>
      ) : (
        <p>Loading stats...</p>
      )}
    </>
  );
}
