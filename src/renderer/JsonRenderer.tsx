import React from "react";
import { MetaComponentMap } from "@/renderer/metaComponentMap";

export interface JSONNode {
  component: string;
  props?: {
    style?: React.CSSProperties;
    [key: string]: any;
  };
  children?: Array<JSONNode | string | number>;
}

interface RendererOptions {
  handlers?: Record<string, (...args: any[]) => any>; // safe handlers registry
  allowUnsafeEval?: boolean; // if true, allow eval of string handlers
}

let keyCounter = 0;
function getKey() {
  keyCounter += 1;
  return `json-node-${keyCounter}`;
}

export function renderJSONNode(
  node: JSONNode,
  options: RendererOptions = {}
): React.ReactElement {
  const { handlers = {}, allowUnsafeEval = false } = options;
  const { component, props = {}, children } = node;

  // Empty component "" renders as fragment
  if (component === "") {
    return (
      <React.Fragment key={getKey()}>
        {Array.isArray(children)
          ? children.map((child) =>
              typeof child === "object" ? renderJSONNode(child, options) : child
            )
          : null}
      </React.Fragment>
    );
  }

  const meta = MetaComponentMap[component];
  if (!meta) {
    throw new Error(`Component "${component}" not found in MetaComponentMap`);
  }

  // Merge default undefined props from meta with passed props
  const mergedProps = { ...meta.props, ...props } as Record<string, any>;

  // Resolve event handlers
  for (const [key, value] of Object.entries(mergedProps)) {
    if (/^on[A-Z]/.test(key)) {
      if (typeof value === "string" && handlers[value]) {
        mergedProps[key] = handlers[value];
      } else if (typeof value === "string" && allowUnsafeEval) {
        mergedProps[key] = eval(`(${value})`);
      }
    }
  }

  const renderedChildren = Array.isArray(children)
    ? children.map((child) =>
        typeof child === "object" ? renderJSONNode(child, options) : child
      )
    : undefined;

  return React.createElement(
    meta.component,
    { ...mergedProps, key: getKey() },
    renderedChildren
  );
}
