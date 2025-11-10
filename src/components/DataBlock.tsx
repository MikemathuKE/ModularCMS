import React, {
  ReactNode,
  isValidElement,
  cloneElement,
  ReactElement,
} from "react";
import { JSONNode, renderJSONNode } from "@/renderer/JsonRenderer";
import { CommonProps } from "@/lib/globals";
import {
  replacePlaceholders,
  resolveJSONPlaceholders,
} from "@/renderer/renderUtils";

export interface DataBlockProps extends CommonProps {
  index: number;
  item: Record<string, string | object | boolean | number>;
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
  item: Record<string, string | object | boolean | number>,
  key?: number | string
): ReactNode {
  if (!children) return null;

  // Case 1: JSONNode structure
  if (typeof children === "object" && "component" in children) {
    const resolved = resolveJSONPlaceholders(
      children as unknown as JSONNode,
      item
    );
    return renderJSONNode(resolved as JSONNode);
  }

  // Case 2: Plain string
  if (typeof children === "string") {
    return replacePlaceholders(children, item);
  }

  // Case 3: React element
  if (isValidElement(children)) {
    const element = children as ReactElement<any>; // ✅ type assertion

    const newProps: Record<string, string | object | boolean | number> = {};
    for (const [propKey, value] of Object.entries(element.props)) {
      if (typeof value === "string") {
        newProps[propKey] = replacePlaceholders(value, item);
      } else if (!value) {
        continue;
      } else {
        newProps[propKey] = value;
      }
    }

    return cloneElement(
      element,
      { ...newProps, key },
      element.props?.children
        ? resolveDynamicChildren(element.props.children, item)
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
