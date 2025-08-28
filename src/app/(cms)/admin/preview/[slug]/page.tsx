// app/admin/preview/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { JSONNode, renderJSONNode } from "@/renderer/JsonRenderer";
import { ThemeProvider } from "@/context/ThemeContext";

export default function PagePreview() {
  const { slug } = useParams();
  const [pageData, setPageData] = useState<{ json: JSONNode } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPage() {
      try {
        const res = await fetch(`/api/cms/pages/${slug}`);
        if (!res.ok) throw new Error("Failed to fetch page data");
        const data = await res.json();
        setPageData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading preview...</p>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-500">Page not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Preview: {slug}
        </h1>
        <div className="prose max-w-none">
          <ThemeProvider themeIdentifier={null}>
            {renderJSONNode(pageData.json)}
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
}
