import React, { ReactNode, isValidElement, cloneElement } from "react";
import { JSONNode, renderJSONNode } from "@/renderer/JsonRenderer";
import { CommonProps } from "@/lib/globals";
import {
  replacePlaceholders,
  resolveJSONPlaceholders,
} from "@/renderer/renderUtils";

export interface DataBlockProps extends CommonProps {
  index: number;
  item: any;
  children?: React.ReactNode;
}

export default function DataBlock({
  index = 0,
  children,
  item,
}: DataBlockProps) {
  return (
    <React.Fragment>
      {resolveDynamicChildren(children, item, index)}
    </React.Fragment>
  );
}

/**
 * Handle both JSONNode and ReactNode children
 */
export function resolveDynamicChildren(
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
