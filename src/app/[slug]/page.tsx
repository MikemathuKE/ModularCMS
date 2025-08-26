// app/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { JSONNode, renderJSONNode } from "@/renderer/JsonRenderer";

interface PageData {
  json: JSONNode;
  slug: string;
  published: boolean;
}

export default function PublicPage() {
  const { slug } = useParams();
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPage() {
      try {
        const res = await fetch(`/api/cms/pages/${slug}`);
        if (!res.ok) throw new Error("Failed to fetch page data");
        const data: PageData = await res.json();

        if (!data.published) {
          setPageData(null);
        } else {
          setPageData(data);
        }
      } catch (err) {
        console.error(err);
        setPageData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-500">Page not found or not published</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
        {renderJSONNode(pageData.json)}
      </div>
    </main>
  );
}
