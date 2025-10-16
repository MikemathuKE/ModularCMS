"use client";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import debounce from "lodash.debounce";
import { useCallback } from "react";

import { JSONNode } from "@/renderer/JsonRenderer";
import { MetaComponentMap } from "@/renderer/metaComponentMap";
import { renderJSONNode } from "@/renderer/JsonRenderer";
import { ThemeProvider } from "@/context/ThemeContext";
import RichTextEditor from "@/components/admin/RichTextEditor";

import MediaSelector from "@/components/admin/MediaSelector";
import { ModalManager } from "@/lib/ModalManager";

interface ComponentCategory {
  name: string;
  components: string[];
}

interface CollapsedState {
  [path: string]: boolean;
}

const componentCategories: ComponentCategory[] = [
  {
    name: "Data Components",
    components: ["DataSection"],
  },
  {
    name: "Layout Components",
    components: [
      "Section",
      "Card",
      "CardHeader",
      "CardContent",
      "CardFooter",
      "Grid",
      "Table",
      // "TableWrapper",
      // "TableHead",
      // "TableBody",
      // "TableHeader",
      // "TableRow",
      // "TableData",
      "ALink",
      // "PaginationWrapper",
    ],
  },
  {
    name: "Modal Components",
    components: ["Modal"],
  },
  {
    name: "General Components",
    components: [
      "Button",
      "Heading1",
      "Heading2",
      "Heading3",
      "Heading4",
      "Heading5",
      "Heading6",
      "Paragraph",
      "Span",
      "Text",
      "RichText",
      "IconLink",
    ],
  },
  {
    name: "Media Components",
    components: ["ImageMedia", "VideoMedia", "AudioMedia"],
  },
  {
    name: "Form Components",
    components: [
      "Form",
      // "TextInput",
      // "EmailInput",
      // "PasswordInput",
      // "NumberInput",
      // "CheckboxInput",
      // "RadioInput",
      // "FileInput",
      // "DateInput",
      // "RangeInput",
      // "SelectInput",
      // "TextArea",
      // "FieldWrapper",
      // "Label",
      // "FormGroup",
      // "ErrorText",
      // "Option",
    ],
  },
];

export default function LayoutEditor({
  rootNode,
  setRootNode,
  pageId,
}: {
  rootNode: JSONNode;
  setRootNode: (node: JSONNode) => void;
  pageId: string;
}) {
  const [selectedNodePath, setSelectedNodePath] = useState<number[]>([]);
  const [collapsedNodes, setCollapsedNodes] = useState<CollapsedState>({});
  const [contentTypes, setContentTypes] = useState<
    { name: string; id: string; slug: string }[]
  >([]);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [status, setPublished] = useState("draft");
  const [pageName, setPageName] = useState<string>("");

  const [layouts, setLayouts] = useState<string[]>([]);
  const [selectedLayout, setSelectedLayout] = useState("default");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [url, setUrl] = useState<string>("");

  // fetch available layouts
  useEffect(() => {
    fetch("/api/cms/layouts")
      .then((res) => res.json())
      .then((data) => setLayouts(data.layouts || ["default"]))
      .catch(() => setLayouts(["default"]));
  }, []);

  // fetch content types
  useEffect(() => {
    fetch("/api/cms/content-types")
      .then((res) => res.json())
      .then((data) => setContentTypes(data.items))
      .catch(() => setContentTypes([]));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setSaveMessage("");
    }, 3000);
  }, [saveMessage]);

  // fetch page details
  useEffect(() => {
    fetch(`/api/cms/pages/${pageId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.status) setPublished(data.status);
        if (data?.name) setPageName(data.name);
      })
      .catch(() => {});
  }, [pageId]);

  const getNodeAtPath = (path: number[]): JSONNode | null => {
    let node: any = rootNode;
    for (const i of path) {
      if (!node.children || !node.children[i]) return null;
      node = node.children[i];
    }
    return node;
  };

  const updateNodeAtPath = (path: number[], newNode: JSONNode) => {
    const recursiveUpdate = (node: JSONNode, p: number[]): JSONNode => {
      if (p.length === 0) return newNode;
      const [index, ...rest] = p;
      const children = node.children?.map((child, i) =>
        i === index ? recursiveUpdate(child, rest) : child
      );
      return { ...node, children };
    };
    setRootNode(recursiveUpdate(rootNode, path));
  };

  const addChildNode = (component: string) => {
    const meta = MetaComponentMap[component];
    if (!meta) return;
    const newChild: JSONNode = {
      component,
      props: { ...meta.props },
      children: [],
    };
    const node = getNodeAtPath(selectedNodePath);
    if (!node) return;
    const children = [...(node.children || []), newChild];
    updateNodeAtPath(selectedNodePath, { ...node, children });
  };

  const deleteNode = (path: number[]) => {
    if (path.length === 0) return;
    const parentPath = path.slice(0, -1);
    const index = path[path.length - 1];
    const parent = getNodeAtPath(parentPath);
    if (!parent?.children) return;
    const children = parent.children.filter((_, i) => i !== index);
    updateNodeAtPath(parentPath, { ...parent, children });
    setSelectedNodePath([]);
  };

  const moveNode = (path: number[], direction: "up" | "down") => {
    if (path.length === 0) return;
    const parentPath = path.slice(0, -1);
    const index = path[path.length - 1];
    const parent = getNodeAtPath(parentPath);
    if (!parent?.children) return;

    const newChildren = [...parent.children];
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === newChildren.length - 1)
    )
      return;

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newChildren[index], newChildren[swapIndex]] = [
      newChildren[swapIndex],
      newChildren[index],
    ];

    updateNodeAtPath(parentPath, { ...parent, children: newChildren });
    setSelectedNodePath([...parentPath, swapIndex]);
  };

  const updatePropDebounce = useCallback(
    debounce((propName: string, value: any) => {
      const node = getNodeAtPath(selectedNodePath);
      if (!node) return;
      if (node.props?.[propName] === value) return; // no-op if unchanged
      updateNodeAtPath(selectedNodePath, {
        ...node,
        props: { ...(node.props || {}), [propName]: value },
      });
    }, 1000),
    [selectedNodePath]
  );

  const updateProp = (propName: string, value: any) => {
    const node = getNodeAtPath(selectedNodePath);
    if (!node) return;
    const props = { ...(node.props || {}), [propName]: value };
    updateNodeAtPath(selectedNodePath, { ...node, props });
  };

  const toggleCollapse = (path: number[]) => {
    const key = path.join("-");
    setCollapsedNodes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderTree = (node: JSONNode, path: number[] = []) => {
    const isCollapsed = collapsedNodes[path.join("-")];
    const parent = getNodeAtPath(path.slice(0, -1));
    return (
      <div key={path.join("-")} className="ml-4">
        <div
          className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${
            selectedNodePath.join("-") === path.join("-")
              ? "bg-blue-100"
              : "hover:bg-gray-100"
          }`}
          onClick={() => setSelectedNodePath(path)}
        >
          {node.children && node.children.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleCollapse(path);
              }}
              className="text-xs px-1 border rounded"
            >
              {isCollapsed ? "+" : "-"}
            </button>
          )}
          <span className="font-mono">{node.component || "<Root>"}</span>
          {/* Controls */}
          {path.length > 0 && (
            <div className="ml-auto flex gap-1">
              <button
                className="text-xs px-1 border rounded hover:bg-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  moveNode(path, "up");
                }}
              >
                ↑
              </button>
              <button
                className="text-xs px-1 border rounded hover:bg-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  moveNode(path, "down");
                }}
              >
                ↓
              </button>
              <button
                className="text-xs px-1 border rounded text-red-500 hover:bg-red-200"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNode(path);
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>
        {!isCollapsed &&
          node.children?.map((child, i) => renderTree(child, [...path, i]))}
      </div>
    );
  };

  const renderPropInput = (
    propName: string,
    value: any,
    propType: string,
    required = false
  ) => {
    const type = typeof value;
    return (
      <div
        key={selectedNodePath.join("-") + propName}
        className="flex flex-col gap-1"
      >
        <label className="font-medium">
          {propName}
          {required && <span className="text-red-500">*</span>}
        </label>
        {propName === "src" ? (
          <MediaSelector
            key={selectedNodePath.join("-")}
            type={"image"}
            selected={formData[url]}
            onSelect={(url) => {
              setFormData({ ...formData });
              setUrl(url);
              updateProp(propName, String(url));
            }}
          />
        ) : propName === "richText" ? (
          <RichTextEditor
            key={selectedNodePath.join("-")}
            value={value}
            onChange={(html) => updatePropDebounce(propName, html)}
          />
        ) : (
          <>
            {type === "boolean" ? (
              <input
                key={selectedNodePath.join("-")}
                type="checkbox"
                checked={!!value}
                onChange={(e) => updateProp(propName, e.target.checked)}
              />
            ) : propType.toLowerCase().includes("button") &&
              propName == "modal" ? (
              <select
                className="border rounded px-2 py-1"
                value={value}
                onChange={(e) => updateProp(propName, e.target.value)}
              >
                <option value={""}>--Select Modal--</option>
                {ModalManager.get()
                  .keys()
                  .map((value, idx) => (
                    <option key={idx} value={value}>
                      {value}
                    </option>
                  ))}
              </select>
            ) : propName == "contentType" ? (
              <select
                className="border rounded px-2 py-1"
                value={value}
                onChange={(e) => updateProp(propName, e.target.value)}
              >
                <option value={""}>--Select ContentType--</option>
                {Object.values(contentTypes).map((value, idx) => (
                  <option key={idx} value={value.slug}>
                    {value.name}
                  </option>
                ))}
              </select>
            ) : type === "number" ? (
              <input
                key={selectedNodePath.join("-")}
                type="number"
                value={value ?? ""}
                onChange={(e) => updateProp(propName, Number(e.target.value))}
                className="border p-1 rounded"
              />
            ) : (
              <textarea
                key={selectedNodePath.join("-")}
                value={value ?? ""}
                onChange={(e) => updateProp(propName, e.target.value)}
                className="border p-1 rounded"
              />
            )}
          </>
        )}
      </div>
    );
  };

  const selectedNode = getNodeAtPath(selectedNodePath);

  const savePage = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch(`/api/cms/pages/${pageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          json: rootNode,
          status,
          layout: selectedLayout,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaveMessage("✅ Page saved successfully!");
    } catch {
      setSaveMessage("❌ Error saving page");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-white">
        <h1 className="font-semibold text-xl">
          Page Editor{" "}
          <span className="text-gray-500">({pageName + " page" || "..."})</span>
        </h1>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm"> Status: </label>
          <select
            value={status}
            onChange={(e) => setPublished(e.target.value)}
            className="border rounded p-1"
          >
            <option value={"draft"}>Draft</option>
            <option value={"published"}>Published</option>
          </select>
          {/* Layout selector */}
          <label className="flex items-center gap-2 text-sm">
            Layout:
            <select
              value={selectedLayout}
              onChange={(e) => setSelectedLayout(e.target.value)}
              className="border rounded p-1"
            >
              {layouts.map((layout) => (
                <option key={layout} value={layout}>
                  {layout}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={savePage}
            disabled={saving}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
      {saveMessage && (
        <div className="px-4 py-2 text-sm text-gray-700">{saveMessage}</div>
      )}

      <div className="flex flex-1">
        {/* Palette */}
        <div className="w-1/4 bg-gray-100 p-2 overflow-auto border-r">
          {componentCategories.map((cat) => (
            <div key={cat.name} className="mb-3">
              <h3 className="font-semibold">{cat.name}</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {cat.components.map((c) => (
                  <button
                    key={c}
                    onClick={() => addChildNode(c)}
                    className="bg-blue-200 text-sm px-2 py-1 rounded hover:bg-blue-300"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tree */}
        <div className="flex-1 bg-white p-2 overflow-auto border-r">
          <h2 className="font-semibold text-lg mb-2">Page Structure</h2>
          {renderTree(rootNode, [])}
        </div>

        {/* Props editor */}
        <div className="w-1/4 bg-gray-100 p-2 overflow-auto">
          <h2 className="font-semibold text-lg mb-2">Props Editor</h2>
          {selectedNode ? (
            <div className="flex flex-col gap-2">
              {Object.entries(
                MetaComponentMap[selectedNode.component]?.props || {}
              ).map(([name, def]) =>
                renderPropInput(
                  name,
                  selectedNode.props?.[name] ?? def,
                  selectedNode.component,
                  false
                )
              )}
              <div>
                <label className="font-medium">Linked Content</label>
                <select
                  className="border p-1 rounded w-full"
                  value={selectedNode.props?.contentId || ""}
                  onChange={(e) => updateProp("contentId", e.target.value)}
                >
                  <option value="">None</option>
                  {Object.values(contentTypes).map((ct) => (
                    <option key={uuidv4()} value={ct.id}>
                      {ct.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <p>Select a node</p>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-200 p-2">
        <h2 className="font-semibold text-lg mb-2">Live Preview</h2>
        <div className="bg-white p-2 border rounded">
          <ThemeProvider themeIdentifier={null}>
            {renderJSONNode(rootNode)}
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
}
