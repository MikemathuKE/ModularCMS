"use client";
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/LayoutRenderer";
import { LayoutConfig } from "@/components/LayoutConfig";
import { JSONNode } from "@/renderer/JsonRenderer";
import JsonEditor from "@/components/admin/JSONEditor";
import { Paragraph, Heading1 } from "@/components/GeneralComponents";

export default function LayoutEditorPage() {
  const [config, setConfig] = useState<LayoutConfig>({
    topbar: null,
    sidebar: null,
    footer: null,
  });
  const [layouts, setLayouts] = useState<string[]>([]);
  const [selectedLayout, setSelectedLayout] = useState<string>("default");
  const [newLayoutName, setNewLayoutName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch available layouts
  async function fetchLayouts() {
    try {
      const res = await fetch("/api/cms/layouts");
      const json = await res.json();
      setLayouts(json.layouts || []);
    } catch (err) {
      console.error("Error fetching layout list:", err);
    }
  }

  // Fetch current layout config
  async function fetchLayout(name: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/cms/layouts/${name}`);
      if (res.ok) {
        const json = await res.json();
        setConfig(json);
      } else {
        setConfig({ topbar: null, sidebar: null, footer: null });
      }
    } catch (err) {
      console.error("Error fetching layout:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLayouts();
    fetchLayout(selectedLayout);
  }, [selectedLayout]);

  function updateSection(section: keyof LayoutConfig, node: JSONNode) {
    setConfig((prev) => ({ ...prev, [section]: node }));
  }

  // Save layout to DB
  async function saveLayout() {
    setSaving(true);
    try {
      const res = await fetch(`/api/cms/layouts/${selectedLayout}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error("Failed to save layout");
      alert("Layout saved successfully!");
      fetchLayouts();
    } catch (err) {
      console.error(err);
      alert("Error saving layout");
    } finally {
      setSaving(false);
    }
  }

  // Create new layout
  async function createNewLayout() {
    if (!newLayoutName.trim()) return;
    try {
      const res = await fetch(`/api/cms/layouts/${newLayoutName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topbar: null, sidebar: null, footer: null }),
      });
      if (!res.ok) throw new Error("Failed to create layout");
      setSelectedLayout(newLayoutName);
      setNewLayoutName("");
      fetchLayouts();
    } catch (err) {
      console.error(err);
      alert("Error creating new layout");
    }
  }

  // Duplicate layout
  async function duplicateLayout() {
    const newName = prompt(
      `Enter a name for the duplicate of "${selectedLayout}":`
    );
    if (!newName || !newName.trim()) return;

    try {
      const res = await fetch(`/api/cms/layouts/${newName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config), // use current config
      });
      if (!res.ok) throw new Error("Failed to duplicate layout");
      alert(`Layout duplicated as "${newName}"`);
      setSelectedLayout(newName);
      fetchLayouts();
    } catch (err) {
      console.error(err);
      alert("Error duplicating layout");
    }
  }

  async function deleteLayout() {
    if (!confirm(`Delete layout "${selectedLayout}"?`)) return;
    try {
      const res = await fetch(`/api/cms/layouts/${selectedLayout}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete layout");

      alert("Layout deleted successfully!");
      setSelectedLayout("default"); // fallback
      fetchLayouts();
      fetchLayout("default");
    } catch (err) {
      console.error(err);
      alert("Error deleting layout");
    }
  }

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Config Panel */}
      <div className="w-96 bg-gray-50 border-r p-4 space-y-6 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Layout Settings</h2>

        {/* Layout selector */}
        <div className="space-y-2">
          <label className="font-semibold">Select Layout:</label>
          <select
            value={selectedLayout}
            onChange={(e) => setSelectedLayout(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          >
            {layouts.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="New layout name"
              value={newLayoutName}
              onChange={(e) => setNewLayoutName(e.target.value)}
              className="flex-1 border px-2 py-1 rounded"
            />
            <button
              onClick={createNewLayout}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Create
            </button>
          </div>
        </div>

        {/* Section editors */}
        {(["topbar", "sidebar", "footer"] as (keyof LayoutConfig)[]).map(
          (section) => (
            <div key={section} className="space-y-3">
              <label className="flex items-center gap-2 font-semibold">
                <input
                  type="checkbox"
                  checked={!!config[section]}
                  onChange={() =>
                    setConfig((prev) => ({
                      ...prev,
                      [section]: prev[section]
                        ? null
                        : { component: "", props: {}, children: [] },
                    }))
                  }
                />
                Show {section}
              </label>

              {config[section] && (
                <JsonEditor
                  value={config[section]!}
                  onChange={(node) => updateSection(section, node)}
                />
              )}
            </div>
          )
        )}

        <div className="flex flex-col gap-2 mt-6">
          <button
            onClick={saveLayout}
            disabled={saving}
            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            onClick={duplicateLayout}
            className="w-full bg-yellow-500 text-white py-2 rounded"
          >
            Duplicate Layout
          </button>

          <button
            onClick={deleteLayout}
            className="w-full bg-red-600 text-white py-2 rounded"
          >
            Delete Layout
          </button>
        </div>
      </div>

      {/* Live preview */}
      <div className="flex-1 bg-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6">Loading layout...</div>
        ) : (
          <Layout config={config}>
            <Heading1>Main Content</Heading1>
            <Paragraph>
              This is a preview of your layout with the current configuration.
            </Paragraph>
          </Layout>
        )}
      </div>
    </div>
  );
}
