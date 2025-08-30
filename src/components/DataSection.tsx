"use client";
import React, {
  useEffect,
  useState,
  ReactNode,
  isValidElement,
  cloneElement,
} from "react";
import { JSONNode, renderJSONNode } from "@/renderer/JsonRenderer";
import { createStyledComponent } from "@/lib/DynamicStyles";
import { CommonProps } from "@/lib/globals";
import {
  replacePlaceholders,
  resolveJSONPlaceholders,
} from "@/renderer/renderUtils";

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
            <React.Fragment key={`${contentType}-${data.page}-${idx}`}>
              {resolveDynamicChildren(children, item, idx)}
            </React.Fragment>
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

/**
 * Handle both JSONNode and ReactNode children
 */
function resolveDynamicChildren(
  children: ReactNode,
  item: Record<string, any>,
  key?: number
): ReactNode {
  if (!children) return null;

  // Case 1: JSONNode structure
  if (typeof children === "object" && "component" in (children as any)) {
    const resolved = resolveJSONPlaceholders(children as JSONNode, item);
    return renderJSONNode(resolved);
  }

  // Case 2: Plain string
  if (typeof children === "string") {
    return replacePlaceholders(children, item);
  }

  // Case 3: React element
  if (isValidElement(children)) {
    const newProps: Record<string, any> = {};
    for (const [propKey, value] of Object.entries(children.props || {})) {
      if (typeof value === "string") {
        newProps[propKey] = replacePlaceholders(value, item);
      } else {
        newProps[propKey] = value;
      }
    }

    return cloneElement(
      children,
      { ...newProps, key },
      children.props?.children
        ? resolveDynamicChildren(children.props.children, item)
        : undefined
    );
  }

  // Case 4: Array of children
  if (Array.isArray(children)) {
    return children.map((child, i) =>
      resolveDynamicChildren(child, item, `${key}-${i}`)
    );
  }

  // Case 5: numbers / literals
  return children;
}
