"use client";

import { useEffect, useState } from "react";
import { safeJsonParse } from "@/utils/safeJSONParse";
import KeyValueEditor from "@/components/admin/KeyValueEditor";
import { CONTENT_TYPES } from "@/constants/contentTypes";
import { ContentType } from "@/lib/types/types";
import SchemaJsonPreview from "./SchemaJsonPreview";

import { slugify } from "@/lib/helperFunctions";

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

export interface EndpointForm {
  _id?: string;
  name: string;
  slug: string;
  method: HttpMethod;
  path: string;
  contentType?: string;
  headers: Record<string, string>;
  queryParams: Record<string, any>;
  bodyTemplate?: string | undefined;
}

interface EndpointModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: EndpointForm) => Promise<void> | void;

  parentDataSource: string;
  initialData?: EndpointForm; // ← presence = edit mode
}

export default function EndpointModal({
  open,
  onClose,
  onSave,
  parentDataSource,
  initialData,
}: EndpointModalProps) {
  const isEdit = !!initialData;

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "request" | "headers" | "query" | "body"
  >("request");

  const [form, setForm] = useState<EndpointForm>({
    name: "",
    slug: "",
    method: "GET",
    path: "",
    contentType: "",
    headers: {},
    queryParams: {},
    bodyTemplate: "",
  });

  const [contentTypes, SetContentTypes] = useState<ContentType[]>([]);
  const [activeContentType, SetActiveContentType] = useState<string | null>(
    null,
  );

  /* ----------------------------- Init ----------------------------- */

  async function GetContentTypes() {
    fetch(`/api/cms/contenttypes?page=1&limit=1000`).then(async (res) => {
      const data = await res.json();
      SetContentTypes(data.items);
    });
  }

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      SetActiveContentType(initialData.bodyTemplate || null);
    }
    GetContentTypes();
  }, [initialData]);

  if (!open) return null;

  /* ----------------------------- Save ----------------------------- */

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  /* ----------------------------- UI ----------------------------- */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-3xl rounded shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit Endpoint" : "Add Endpoint"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 px-6 pt-4 border-b text-sm">
          {["request", "headers", "query", "body"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-2 capitalize ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 font-medium"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          {/* ---------------- Request ---------------- */}
          {activeTab === "request" && (
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Name</label>
                <input
                  className="w-full border px-3 py-2 rounded"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      slug: slugify(parentDataSource + "-" + e.target.value),
                      name: e.target.value,
                    })
                  }
                />
                <label className="block font-medium mb-1">Slug</label>
                <input
                  className={`w-full border px-3 py-2 rounded ${isEdit ? "bg-gray-200" : ""}`}
                  disabled={isEdit}
                  value={form.slug}
                  onChange={(e) =>
                    setForm({ ...form, slug: slugify(e.target.value) })
                  }
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium mb-1">Method</label>
                  <select
                    className="w-full border px-3 py-2 rounded"
                    value={form.method}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        method: e.target.value as HttpMethod,
                      })
                    }
                  >
                    {[
                      "GET",
                      "POST",
                      "PUT",
                      "PATCH",
                      "DELETE",
                      "HEAD",
                      "OPTIONS",
                    ].map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block font-medium mb-1">Path</label>
                  <input
                    className="w-full border px-3 py-2 rounded font-mono"
                    placeholder="/users/{id}"
                    value={form.path}
                    onChange={(e) => setForm({ ...form, path: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Content Type
                </label>

                <select
                  value={form.contentType || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      contentType: e.target.value || undefined,
                    })
                  }
                  className="w-full border rounded px-3 py-2 bg-white"
                >
                  <option value="">— Inherit / None —</option>

                  {CONTENT_TYPES.map((ct) => (
                    <option key={ct.value} value={ct.value}>
                      {ct.label}
                    </option>
                  ))}
                </select>

                <p className="text-xs text-gray-500 mt-1">
                  Overrides DataSource default Content-Type
                </p>
              </div>
            </div>
          )}

          {/* ---------------- Headers ---------------- */}
          {activeTab === "headers" && (
            <KeyValueEditor
              label="Headers"
              value={form.headers}
              onChange={(headers) => setForm({ ...form, headers })}
            />
          )}

          {/* ---------------- Query ---------------- */}
          {activeTab === "query" && (
            <KeyValueEditor
              label="Query Parameters"
              value={form.queryParams}
              onChange={(queryParams) => setForm({ ...form, queryParams })}
            />
          )}

          {/* ---------------- Body ---------------- */}
          {activeTab === "body" && (
            <div>
              <label className="block font-medium mb-1">Content Type</label>
              <select
                className="w-full border px-3 py-2 rounded font-mono text-sm"
                defaultValue={activeContentType || ""}
                onChange={(e) => {
                  setForm({
                    ...form,
                    bodyTemplate:
                      e.target.value != ""
                        ? safeJsonParse(e.target.value)
                        : undefined,
                  });
                  SetActiveContentType(e.target.value);
                }}
              >
                <option value={""}>--None--</option>
                {contentTypes.map((contentType) => {
                  return (
                    <option key={contentType.slug} value={contentType._id}>
                      {contentType.name}
                    </option>
                  );
                })}
              </select>
              <SchemaJsonPreview
                fields={
                  contentTypes.filter((contentType) => {
                    return contentType._id == activeContentType;
                  })[0]?.fields || []
                }
                title="Content Type Preview"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Endpoint"}
          </button>
        </div>
      </div>
    </div>
  );
}
