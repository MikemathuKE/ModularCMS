"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Theme {
  _id: string;
  name: string;
  slug: string;
  active: boolean;
  json: any;
}

export default function ThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchThemes = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/cms/themes?search=${encodeURIComponent(search)}&page=${page}`
    );
    const data = await res.json();
    setThemes(data.items || []);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  };

  useEffect(() => {
    fetchThemes();
  }, [search, page]);

  const setActive = async (id: string) => {
    await fetch(`/api/cms/themes/manage?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: true }),
    });
    fetchThemes();
  };

  const deleteTheme = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/cms/themes/manage?id=${id}`, { method: "DELETE" });
    fetchThemes();
  };

  const duplicateTheme = async (id: string) => {
    await fetch(`/api/cms/themes/${id}/duplicate`, { method: "POST" });
    fetchThemes();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Themes</h1>
        <Link
          href="/admin/themes/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Theme
        </Link>
      </div>

      <div className="flex mb-4 gap-2">
        <input
          type="text"
          placeholder="Search themes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="border rounded divide-y">
          {themes.map((theme) => (
            <div
              key={theme._id}
              className="p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="font-medium">{theme.name}</h2>
                <div className="flex gap-2 mt-1">
                  {theme.active && (
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded">
                      Active
                    </span>
                  )}
                  {theme.slug === "default" && (
                    <span className="text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/preview/themes/${theme._id}`}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  target="_blank"
                >
                  Preview
                </Link>

                <>
                  <Link
                    href={`/admin/themes/${theme._id}`}
                    className="px-3 py-1 bg-yellow-200 rounded hover:bg-yellow-300"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteTheme(theme._id)}
                    className="px-3 py-1 bg-red-200 rounded hover:bg-red-300"
                  >
                    Delete
                  </button>
                </>
                <>
                  <button
                    onClick={() => duplicateTheme(theme._id)}
                    className="px-3 py-1 bg-blue-200 rounded hover:bg-blue-300"
                  >
                    Duplicate
                  </button>
                </>

                {!theme.active && (
                  <button
                    onClick={() => setActive(theme._id)}
                    className="px-3 py-1 bg-green-200 rounded hover:bg-green-300"
                  >
                    Set Active
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 rounded ${
              page === p ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
