"use client";
import React from "react";
import { JSONNode } from "@/renderer/JsonRenderer";
import { MetaComponentMap } from "@/renderer/metaComponentMap";

interface JsonEditorProps {
  value: JSONNode;
  onChange: (val: JSONNode) => void;
}

/**
 * Recursive JSONNode editor with dropdown for components
 */
export default function JsonEditor({ value, onChange }: JsonEditorProps) {
  function updateField(field: keyof JSONNode, newVal: any) {
    onChange({ ...value, [field]: newVal });
  }

  function updateComponent(newComponent: string) {
    const defaults = MetaComponentMap[newComponent]?.props || {};
    onChange({
      ...value,
      component: newComponent,
      props: { ...defaults }, // reset props to defaults
    });
  }

  function updateProp(key: string, val: string) {
    onChange({
      ...value,
      props: { ...(value.props || {}), [key]: val },
    });
  }

  function removeProp(key: string) {
    const next = { ...(value.props || {}) };
    delete next[key];
    onChange({ ...value, props: next });
  }

  function updateChild(idx: number, child: JSONNode | string | number) {
    const nextChildren = [...(value.children || [])];
    nextChildren[idx] = child;
    onChange({ ...value, children: nextChildren });
  }

  function addChild() {
    const nextChildren = [
      ...(value.children || []),
      { component: "", props: {}, children: [] },
    ];
    onChange({ ...value, children: nextChildren });
  }

  function removeChild(idx: number) {
    const nextChildren = [...(value.children || [])];
    nextChildren.splice(idx, 1);
    onChange({ ...value, children: nextChildren });
  }

  return (
    <div className="border rounded p-3 space-y-3 bg-white shadow-sm text-sm">
      {/* Component Selector */}
      <div>
        <label className="font-semibold">Component:</label>
        <select
          className="ml-2 border px-2 py-1 rounded"
          value={value.component}
          onChange={(e) => updateComponent(e.target.value)}
        >
          <option value="">-- Select Component --</option>
          {Object.keys(MetaComponentMap).map((comp) => (
            <option key={comp} value={comp}>
              {comp}
            </option>
          ))}
        </select>
      </div>

      {/* Props Editor */}
      <div>
        <label className="font-semibold">Props:</label>
        <div className="ml-3 space-y-2">
          {Object.entries(value.props || {}).map(([k, v]) => (
            <div key={k} className="flex gap-2 flex-col border p-1">
              <input
                className="border px-1 py-0.5 rounded flex-1 bg-gray-100"
                value={k}
                readOnly
              />
              <input
                className="border px-1 py-0.5 rounded flex-1"
                value={String(v)}
                onChange={(e) => updateProp(k, e.target.value)}
              />
              <button
                className="px-2 text-red-500"
                onClick={() => removeProp(k)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Children Editor */}
      <div>
        <label className="font-semibold">Children:</label>
        <div className="ml-3 space-y-2">
          {(value.children || []).map((child, idx) => (
            <div key={idx} className="border p-2 rounded bg-gray-50">
              {typeof child === "string" || typeof child === "number" ? (
                <div className="flex gap-2">
                  <input
                    className="border px-1 py-0.5 rounded flex-1"
                    value={String(child)}
                    onChange={(e) => updateChild(idx, e.target.value)}
                  />
                  <button
                    className="px-2 text-red-500"
                    onClick={() => removeChild(idx)}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <JsonEditor
                  value={child as JSONNode}
                  onChange={(newChild) => updateChild(idx, newChild)}
                />
              )}
            </div>
          ))}
          <button
            className="mt-1 px-2 py-0.5 text-xs bg-gray-200 rounded"
            onClick={addChild}
          >
            + Add Child
          </button>
        </div>
      </div>
    </div>
  );
}
