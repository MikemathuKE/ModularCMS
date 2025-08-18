"use client";
import React, { useState, ChangeEvent } from "react";
import { JSONNode } from "@/renderer/JsonRenderer";
import { MetaComponentMap } from "@/renderer/metaComponentMap";
import { renderJSONNode } from "@/renderer/JsonRenderer";
import { Info } from "@/components/LayoutComponents";

interface ComponentCategory {
  name: string;
  components: string[];
}

interface CollapsedState {
  [path: string]: boolean;
}

// Helper function to sort components alphabetically
const sortComponents = (components: string[]) => {
  return [...components].sort((a, b) => a.localeCompare(b));
};

const componentCategories: ComponentCategory[] = [
  {
    name: "Layout Components",
    components: sortComponents([
      // "PageContainer",
      // "Topbar",
      // "Main",
      // "Sidebar",
      // "Info",
      // "Footer",
      // "NavigationDrawer",
      // "SideNavigation",
      // "Logo",
      "Section",
      "Card",
      "CardContent",
      "CardHeader",
      "CardFooter",
      "Grid",
      // "MenuNav",
      // "Navbar",
      // "NavItem",
      // "Menu",
      // "MenuList",
      // "MenuItem",
      "TableWrapper",
      "PaginationWrapper",
      "TableHead",
      "TableBody",
      "TableHeader",
      "TableRow",
      "TableData",
      "Table",
    ]),
  },
  {
    name: "General Components",
    components: sortComponents([
      "Button",
      "Heading1",
      "Heading2",
      "Heading3",
      "Heading4",
      "Heading5",
      "Heading6",
      "Paragraph",
      "Span",
    ]),
  },
  {
    name: "Media Components",
    components: sortComponents(["AudioMedia", "VideoMedia", "ImageMedia"]),
  },
  {
    name: "Form Components",
    components: sortComponents([
      "Form",
      "TextInput",
      "EmailInput",
      "PasswordInput",
      "NumberInput",
      "CheckboxInput",
      "RadioInput",
      "FileInput",
      "DateInput",
      "RangeInput",
      "SelectInput",
      "TextArea",
      "FieldWrapper",
      "Label",
      "FormGroup",
      "ErrorText",
      "Option",
    ]),
  },
];

export default function LayoutEditorTree() {
  const [rootNode, setRootNode] = useState<JSONNode>({
    component: "",
    props: {},
    children: [],
  });
  const [selectedNodePath, setSelectedNodePath] = useState<number[]>([]);
  const [showJSON, setShowJSON] = useState(true);
  const [collapsedNodes, setCollapsedNodes] = useState<CollapsedState>({});

  const cloneNode = (node: JSONNode) => JSON.parse(JSON.stringify(node));

  const getNodeAtPath = (path: number[]): JSONNode | null => {
    let node: any = rootNode;
    for (const i of path) {
      if (!node.children || !node.children[i]) return null;
      node = node.children[i];
    }
    return node;
  };

  // Add this helper function to toggle collapse state
  const toggleCollapse = (path: number[]) => {
    const pathKey = path.join(",");
    setCollapsedNodes((prev) => ({
      ...prev,
      [pathKey]: !prev[pathKey],
    }));
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
    console.log(rootNode);
  };

  const addChildNode = (component: string) => {
    const componentMeta = MetaComponentMap[component];
    if (!componentMeta) {
      console.error(`Component ${component} not found in MetaComponentMap`);
      return;
    }

    // Fix for empty src attributes
    const props = { ...componentMeta.props };
    if (component === "ImageMedia" && props.src === "") {
      props.src = null;
    }

    // Add default onChange handler for form inputs
    if (
      component.includes("Input") &&
      props.value !== undefined &&
      !props.onChange
    ) {
      props.onChange = () => {};
    }

    const newChild: JSONNode = {
      component,
      props,
    };

    if (
      [
        "Heading1",
        "Heading2",
        "Heading3",
        "Heading4",
        "Heading5",
        "Heading6",
        "Paragraph",
        "Span",
        "Label",
        "Button",
        "Option",
      ].includes(component)
    ) {
      newChild.children = ["Text"];
    }

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

    const newIndex = direction === "up" ? index - 1 : index + 1;

    // Check if move is possible
    if (newIndex < 0 || newIndex >= parent.children.length) return;

    const newChildren = [...parent.children];
    // Swap positions
    [newChildren[index], newChildren[newIndex]] = [
      newChildren[newIndex],
      newChildren[index],
    ];

    updateNodeAtPath(parentPath, { ...parent, children: newChildren });
    // Update selected path to follow the moved node
    setSelectedNodePath([...parentPath, newIndex]);
  };

  const updateProp = (propName: string, value: any) => {
    const node = getNodeAtPath(selectedNodePath);
    if (!node) return;

    // Special handling for text content in text components
    if (
      [
        "Heading1",
        "Heading2",
        "Heading3",
        "Heading4",
        "Heading5",
        "Heading6",
        "Paragraph",
        "Span",
        "Label",
        "Button",
        "Option",
      ].includes(node.component) &&
      propName === "children"
    ) {
      const children = [value];
      updateNodeAtPath(selectedNodePath, { ...node, children });
      return;
    }

    // Fix for form inputs - add empty onChange if not present
    if (
      propName === "value" &&
      node.component.includes("Input") &&
      !node.props?.onChange
    ) {
      const props = {
        ...(node.props || {}),
        [propName]: value,
        onChange: () => {}, // Add empty handler
      };
      updateNodeAtPath(selectedNodePath, { ...node, props });
      return;
    }

    const props = { ...(node.props || {}), [propName]: value };
    updateNodeAtPath(selectedNodePath, { ...node, props });
  };

  const importJSON = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        setRootNode(json);
      } catch (err) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const saveJSON = () => {
    const dataStr = JSON.stringify(rootNode, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "page.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const openFullPreview = () => {
    const previewWindow = window.open("", "_blank");
    if (!previewWindow) return;
    previewWindow.document.body.innerHTML = "<div id='root'></div>";
    const div = previewWindow.document.getElementById("root");
    if (div) {
      const element = renderJSONNode(rootNode);
      import("react-dom").then((ReactDOM) => {
        ReactDOM.render(element, div);
      });
    }
  };

  const renderTree = (node: JSONNode, path: number[] = []) => {
    const isSelected = path.join(",") === selectedNodePath.join(",");
    const pathKey = path.join(",");
    const isCollapsed = collapsedNodes[pathKey];
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={pathKey} className="pl-4 border-l ml-2">
        <div className="flex items-center">
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleCollapse(path);
              }}
              className="mr-1 text-gray-500 hover:text-gray-700"
            >
              {isCollapsed ? (
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-yellow"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m10 16 4-4-4-4"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-gray-800"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m8 10 4 4 4-4"
                  />
                </svg>
              )}
            </button>
          )}
          <div
            className={`cursor-pointer p-1 rounded hover:bg-blue-50 flex-grow ${
              isSelected ? "bg-blue-200 font-semibold" : ""
            }`}
            onClick={() => setSelectedNodePath(path)}
          >
            {node.component || "<empty>"}
            {node.props?.id ? " - [" + node.props.id + "]" : ""}
            {path.length > 0 && (
              <div className="inline-flex gap-1 ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveNode(path, "up");
                  }}
                  className="text-gray-500 hover:text-gray-700"
                  title="Move up"
                  disabled={path[path.length - 1] === 0}
                >
                  ↑
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveNode(path, "down");
                  }}
                  className="text-gray-500 hover:text-gray-700"
                  title="Move down"
                  disabled={
                    path.length > 0 &&
                    getNodeAtPath(path.slice(0, -1))?.children?.length ===
                      path[path.length - 1] + 1
                  }
                >
                  ↓
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNode(path);
                  }}
                  className="text-red-500 hover:text-red-700 font-bold"
                  title="Delete"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
        {!isCollapsed &&
          node.children &&
          node.children.map((child, i) =>
            typeof child === "string" ? (
              <></>
            ) : (
              // <div key={i} className="pl-4 italic text-gray-500">
              //   {child}
              // </div>
              renderTree(child, [...path, i])
            )
          )}
      </div>
    );
  };

  const selectedNode = getNodeAtPath(selectedNodePath);

  const renderPropEditor = () => {
    if (!selectedNode?.component) return <p>Select a node to edit props</p>;

    const componentMeta = MetaComponentMap[selectedNode.component];
    if (!componentMeta)
      return (
        <p className="text-red-500">
          Unknown component: {selectedNode.component}
        </p>
      );
    const textValue =
      selectedNode.children !== undefined
        ? (selectedNode.children[0] as string)
        : "";

    // Handle text children for text components
    const isTextChild = [
      "Heading1",
      "Heading2",
      "Heading3",
      "Heading4",
      "Heading5",
      "Heading6",
      "Paragraph",
      "Span",
      "Option",
      "Button",
      "Label",
    ].includes(selectedNode.component);
    // if (

    // ) {
    //   return (
    //     <div className="flex flex-col gap-2 p-2">
    //       <div className="flex flex-col gap-1">
    //         <label className="font-medium">Text Content</label>
    //         <textarea
    //           value={textValue}
    //           onChange={(e) => updateProp("children", e.target.value)}
    //           className="border p-1 rounded bg-slate-50"
    //         />
    //       </div>
    //       <button
    //         className="mt-2 border p-1 bg-red-100 w-full hover:bg-red-200"
    //         onClick={() => deleteNode(selectedNodePath)}
    //       >
    //         Delete Node
    //       </button>
    //     </div>
    //   );
    // }

    // Ensure props exists and has proper fallback
    const propsDefinition = componentMeta.props || {};
    const currentProps = selectedNode.props || {};

    return (
      <div className="flex flex-col gap-2 p-2">
        {isTextChild && (
          <>
            <label className="font-medium">Text Content</label>
            <textarea
              value={textValue}
              onChange={(e) => updateProp("children", e.target.value)}
              className="border p-1 rounded bg-slate-50"
            />
          </>
        )}
        {Object.entries(propsDefinition).map(([propName, defaultValue]) => {
          // Skip children prop for non-text components if it's not set
          if (propName === "children" && !currentProps[propName]) {
            return null;
          }
          console.log(propName);

          const currentValue = currentProps[propName] ?? defaultValue;
          const propType = typeof defaultValue;

          return (
            <>
              <div key={propName} className="flex flex-col gap-1">
                <label className="font-medium">
                  {propName}{" "}
                  <span className="text-gray-500 text-sm">({propType})</span>
                </label>
                {renderPropInput(
                  propName,
                  propType,
                  currentValue,
                  selectedNode.component
                )}
              </div>
            </>
          );
        })}
        <button
          className="mt-2 border p-1 bg-red-100 w-full hover:bg-red-200"
          onClick={() => deleteNode(selectedNodePath)}
        >
          Delete Node
        </button>
      </div>
    );
  };

  const renderPropInput = (
    name: string,
    type: string,
    value: any,
    component: string
  ) => {
    // Handle null values
    if (value === null) {
      value = "";
    }

    // Special handling for form inputs
    if (component.includes("Input") && name === "value" && type === "string") {
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => updateProp(name, e.target.value)}
          className="border p-1 rounded bg-gray-100"
        />
      );
    }

    switch (type) {
      case "boolean":
        return (
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => updateProp(name, e.target.checked)}
            className="mr-2 bg-gray-100"
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => updateProp(name, Number(e.target.value))}
            className="border p-1 rounded bg-gray-100"
          />
        );
      case "object":
        if (Array.isArray(value)) {
          return (
            <textarea
              value={JSON.stringify(value, null, 2)}
              onChange={(e) => {
                try {
                  updateProp(name, JSON.parse(e.target.value));
                } catch (err) {
                  console.error("Invalid JSON");
                }
              }}
              className="border p-1 rounded font-mono text-xs bg-gray-100"
              rows={4}
            />
          );
        }
        return (
          <textarea
            value={JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try {
                updateProp(name, JSON.parse(e.target.value));
              } catch (err) {
                console.error("Invalid JSON");
              }
            }}
            className="border p-1 rounded font-mono text-xs bg-gray-100"
            rows={4}
          />
        );
      case "function":
        return (
          <div className="text-sm text-gray-500">
            Function prop - edit in code
          </div>
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => updateProp(name, e.target.value)}
            className="border p-1 rounded bg-gray-100"
          />
        );
    }
  };

  return (
    <div className="h-full bg-gray-500">
      <div className="w-full text-center bg-gray-700 sticky top-0 shadow-slate-500 shadow-md">
        <h1 className="text-2xl text-white">Page Editor</h1>
        <h2 className="text-lg text-amber-200">/About</h2>
      </div>
      <div className="flex gap-4 p-4 max-h-200 overflow-hidden">
        {/* Left: Component palette */}
        <div className="flex flex-col gap-2 w-1/4 border rounded p-2 overflow-auto shadow-sm bg-slate-200">
          <h2 className="font-bold text-lg bg-gray-300 text-center">
            Components
          </h2>
          {componentCategories.map((cat) => (
            <div key={cat.name} className="mb-2">
              <h3 className="font-semibold">{cat.name}</h3>
              <div className="flex flex-wrap gap-1">
                {cat.components.map((comp) => (
                  <button
                    key={comp}
                    className="border bg-blue-200 p-1 text-sm rounded hover:bg-gray-100"
                    onClick={() => addChildNode(comp)}
                  >
                    {comp}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="mt-4">
            <button
              onClick={saveJSON}
              className="border p-1 bg-slate-300 w-full mb-2 hover:bg-blue-200 rounded cursor-pointer"
            >
              Export JSON
            </button>
            <div className="flex">
              <label
                htmlFor="files"
                className="border p-1 bg-slate-300 w-full mb-2 hover:bg-blue-200 rounded text-center cursor-pointer"
              >
                Import JSON
              </label>
              <input
                id="files"
                type="file"
                accept=".json"
                onChange={importJSON}
                className="w-full hidden"
              />
            </div>
            {/* <button
              onClick={openFullPreview}
              className="mt-2 border p-1 bg-blue-100 w-full hover:bg-blue-200 rounded"
            >
              Open Full Preview
            </button> */}
          </div>
        </div>

        {/* Center: Tree + live preview */}
        <div className="flex-1 border rounded p-2 flex flex-col gap-2 overflow-auto shadow-sm bg-gray-300">
          <h2 className="font-bold text-lg bg-gray-400 text-center">
            Page Structure
          </h2>
          <div className="flex-1 overflow-auto">{renderTree(rootNode)}</div>
        </div>

        {/* Right: Props editor */}
        <div className="w-1/4 border rounded p-2 overflow-auto shadow-sm bg-slate-200">
          <h2 className="font-bold text-lg bg-gray-300 text-center">
            Props Editor
          </h2>
          {renderPropEditor()}
        </div>
      </div>
      <div className="p-4 ">
        {showJSON && (
          <div className="w-full ">
            <h2 className="font-bold mt-4 bg-gray-300 w-full text-center">
              Live Preview
            </h2>
            <Info>{renderJSONNode(rootNode)}</Info>
          </div>
        )}
      </div>
    </div>
  );
}
