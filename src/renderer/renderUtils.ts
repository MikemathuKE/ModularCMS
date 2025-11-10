import { JSONNode } from "@/renderer/JsonRenderer";
type FormatterFn = (val: any) => string;

const formatters: Record<string, FormatterFn> = {
  uppercase: (val) => String(val).toUpperCase(),
  lowercase: (val) => String(val).toLowerCase(),
  date: (val) => (val ? new Date(val).toLocaleDateString() : ""),
  datetime: (val) => (val ? new Date(val).toLocaleString() : ""),
  // add more as needed
};

function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split(".").reduce((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return acc[key];
    }
    return undefined;
  }, obj);
}

export function replacePlaceholders(
  template: string,
  item: Record<string, any>
): string {
  return template.replace(/\{\{(.*?)\}\}/g, (_, expr) => {
    let path = expr.trim();
    let fallback: string | undefined;
    let formatter: string | undefined;

    // extract default value first
    if (path.includes("|")) {
      const parts = path.split("|");
      path = parts[0].trim();
      fallback = parts[1].trim();
    }

    // extract formatter if exists
    if (path.includes(">")) {
      const parts = path.split(">");
      path = parts[0].trim();
      formatter = parts[1].trim();
    }

    const value = getNestedValue(item, path);

    if (value == null || value === "") {
      return fallback ?? "";
    }

    if (formatter && formatters[formatter]) {
      return formatters[formatter](value);
    }

    return String(value);
  });
}

export function resolveJSONPlaceholders(
  node: JSONNode | string | number | null,
  item: Record<string, any>
): JSONNode | string | number | null {
  if (!node) return null;

  if (typeof node === "string") return replacePlaceholders(node, item);
  if (typeof node === "number") return node;

  const newProps: Record<string, any> = {};
  for (const [key, value] of Object.entries(node.props || {})) {
    if (typeof value === "string") {
      newProps[key] = replacePlaceholders(value, item);
    } else {
      newProps[key] = value;
    }
  }

  return {
    ...node,
    props: newProps,
    children: node.children
      ?.map((child) => resolveJSONPlaceholders(child, item))
      .filter(Boolean),
  };
}
