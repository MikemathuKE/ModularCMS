"use client";
import React, { useEffect, useState, ReactNode } from "react";
import { createStyledComponent } from "@/lib/DynamicStyles";
import { CommonProps } from "@/lib/globals";
import DataBlock from "@/components/DataBlock";

export interface DataSectionProps extends CommonProps {
  contentType: string;
  filters?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
  limit?: number;
  paginate?: boolean; // new: enable/disable pagination (default false)
  children: ReactNode;
}

export const DataSection = createStyledComponent<DataSectionProps>(
  ({
    contentType,
    filters = {},
    sort = {},
    limit = 6,
    paginate = false,
    children,
  }) => {
    const [data, setData] = useState({
      items: [] as any[],
      page: 1,
      pages: 0,
      total: 0,
    });
    const [loading, setLoading] = useState(true);

    async function fetchData(page = 1) {
      setLoading(true);
      try {
        const query: Record<string, any> = {
          filters,
          sort,
          limit,
          page,
        };
        const apiUrl = "/api/cms/content";
        const res = await fetch(
          `${apiUrl}/${contentType}?q=${encodeURIComponent(
            JSON.stringify(query)
          )}`
        );
        const json = await res.json();
        setData(json || { items: [], page, pages: 0, total: 0 });
      } catch (err) {
        console.error("DataSection fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    useEffect(() => {
      fetchData(1);
    }, [contentType, JSON.stringify(filters), JSON.stringify(sort), limit]);

    if (loading) {
      return <div>Loading {contentType}...</div>;
    }

    return (
      <div className="data-section w-full">
        {data.items &&
          data.items.length > 0 &&
          data.items.map((item, idx) => (
            <DataBlock
              key={`${contentType}-${data.page}-${idx}`}
              index={idx}
              item={item}
            >
              {children}
            </DataBlock>
          ))}

        {/* Pagination controls */}
        {paginate && data.pages > 1 && (
          <div className="flex justify-center space-x-2 mt-4">
            <button
              disabled={data.page <= 1}
              onClick={() => fetchData(data.page - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-2">
              Page {data.page} of {data.pages}
            </span>
            <button
              disabled={data.page >= data.pages}
              onClick={() => fetchData(data.page + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  },
  "DataSection"
);
