"use client";
import React, { useEffect, useState, ReactNode } from "react";
import { createStyledComponent } from "@/lib/DynamicStyles";
import { CommonProps } from "@/lib/globals";
import DataBlock from "@/components/DataBlock";
// import { executeDataSourceEndpoint } from "@/lib/datasource/executeDataSourceEndpoint";

export interface DataSectionProps extends CommonProps {
  contentType: string;
  filters?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
  limit?: number;
  paginate?: boolean; // new: enable/disable pagination (default false)
  children: ReactNode;
  dataSourceEndpointId?: string; // optional
}

export const DataSection = createStyledComponent<DataSectionProps>(
  ({
    contentType,
    filters = {},
    sort = {},
    limit = 6,
    paginate = false,
    children,
    dataSourceEndpointId,
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
        let itemsData;
        if (dataSourceEndpointId) {
          // Use external endpoint
          // const json = await executeDataSourceEndpoint(dataSourceEndpointId, {
          //   ...filters,
          //   page,
          //   limit,
          // },undefined );
          // itemsData = json;
        } else {
          // Use CMS contentType
          if (!contentType)
            throw new Error("contentType required if no DataSourceEndpoint");
          const query = { filters, sort, page, limit };
          const res = await fetch(
            `/api/cms/content/${contentType}?q=${encodeURIComponent(
              JSON.stringify(query)
            )}`
          );
          itemsData = await res.json();
        }
        setData(itemsData || { items: [], page, pages: 0, total: 0 });
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
