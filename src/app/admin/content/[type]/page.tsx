"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MediaSelector from "@/components/admin/MediaSelector";

interface ContentItem {
  _id: string;
  [key: string]: any;
}

export default function ContentEditorPage() {
  const { type } = useParams<{ type: string }>();

  const [fields, setFields] = useState<any[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch content type schema and existing items
  useEffect(() => {
    async function fetchData() {
      const [fieldsRes, itemsRes] = await Promise.all([
        fetch(`/api/cms/contenttypes/${type}`),
        fetch(
          `/api/cms/content/${type}?page=${page}&search=${encodeURIComponent(
            search
          )}`
        ),
      ]);
      const fieldsData = await fieldsRes.json();
      const itemsData = await itemsRes.json();

      setFields(fieldsData.fields || []);
      setItems(itemsData.items || []);

      setLoading(false);
    }
    fetchData();
  }, [type, search, page]);

  // Handle form submit (create or update)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = selectedItem
      ? `/api/cms/content/${type}/${selectedItem._id}`
      : `/api/cms/content/${type}`;
    const method = selectedItem ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    // Reload items
    const itemsRes = await fetch(
      `/api/cms/content/${type}?page=${page}&limit=${limit}&search=${encodeURIComponent(
        search
      )}`
    );
    const itemsData = await itemsRes.json();
    setItems(itemsData.items || []);

    // Reset form for new content
    if (!selectedItem) setFormData({});
  }

  /** Update nested formData safely */
  function updateField(path: string[], value: any) {
    setFormData((prev) => {
      const updated = { ...prev };
      let current: any = updated;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return updated;
    });
  }

  /** Render a field recursively */
  function renderField(field: any, path: string[] = []) {
    const fullPath = [...path, field.name];
    const value = fullPath.reduce((obj, key) => obj?.[key], formData);

    switch (field.kind) {
      case "primitive":
        return renderPrimitiveField(field, fullPath, value);
      case "object":
        return (
          <div className="border p-2 rounded mb-2 col-span-4">
            <h3 className="font-semibold mb-1">{field.name}</h3>
            {field.fields?.map((sub: any) => (
              <div key={sub.name} className="ml-4 mb-2 w-full">
                {renderField(sub, fullPath)}
              </div>
            ))}
          </div>
        );
      case "list":
        return renderListField(field, fullPath, value || []);
      default:
        return <span>Unknown field type</span>;
    }
  }

  function renderPrimitiveField(field: any, path: string[], value: any) {
    const common = { id: field.name, name: field.name };

    switch (field.type) {
      case "string":
      case "text":
        return (
          <textarea
            {...common}
            placeholder="Write Text here"
            value={value || ""}
            onChange={(e) => updateField(path, e.target.value)}
            className="w-full px-3 py-2 border rounded col-span-4"
          />
        );
      case "number":
        return (
          <input
            type="number"
            {...common}
            placeholder="0123"
            value={value || ""}
            onChange={(e) => updateField(path, Number(e.target.value))}
            className="w-full px-3 py-2 border rounded col-span-4"
          />
        );
      case "boolean":
        return (
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => updateField(path, e.target.checked)}
            className="col-span-4"
          />
        );
      case "date":
        return (
          <input
            type="date"
            {...common}
            value={value || ""}
            onChange={(e) => updateField(path, e.target.value)}
            className="w-full px-3 py-2 border rounded col-span-4"
          />
        );
      case "image":
      case "video":
      case "audio":
        return (
          <MediaSelector
            type={field.type.toLowerCase()}
            selected={value}
            onSelect={(url) => updateField(path, url)}
          />
        );
      default:
        return (
          <input
            type="text"
            {...common}
            value={value || ""}
            onChange={(e) => updateField(path, e.target.value)}
            className="w-full px-3 py-2 border rounded col-span-4"
          />
        );
    }
  }

  function renderListField(field: any, path: string[], value: any[]) {
    return (
      <div className="border p-2 rounded mb-2 col-span-4">
        <h3 className="font-medium mb-1">{field.name} (List)</h3>
        {value.map((item, idx) => (
          <div key={idx} className="ml-4 mb-2 border-b pb-2">
            {field.itemType.kind === "primitive"
              ? renderPrimitiveField(
                  field.itemType,
                  [...path, idx.toString()],
                  item
                )
              : renderField(field.itemType, [...path, idx.toString()])}
            <button
              type="button"
              className="text-red-500 text-xs mt-1"
              onClick={() => {
                const newList = [...value];
                newList.splice(idx, 1);
                updateField(path, newList);
              }}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="mt-1 text-sm text-blue-600"
          onClick={() => {
            const newList = [...value];
            newList.push(field.itemType.kind === "primitive" ? "" : {});
            updateField(path, newList);
          }}
        >
          + Add item
        </button>
      </div>
    );
  }

  // Sidebar display label for content
  function getSidebarLabel(item: ContentItem) {
    const requiredField = fields.find((f) => f.required) ||
      fields[0] || { name: "_id" };
    return item[requiredField.name] || item._id;
  }

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="w-full h-full gap-2 overflow-hidden flex">
      {/* Sidebar */}
      <div className="w-72 border-r h-full rounded-lg p-2 bg-gray-200 overflow-y-auto">
        {/*Search Field*/}
        <button
          type="button"
          className="mb-4 p-2 pb-2 pt-2 py-1 rounded-lg bg-blue-600 text-white w-full"
          onClick={() => {
            setSelectedItem(null);
            setFormData({});
          }}
        >
          + New {type}
        </button>

        {/*Search Field*/}
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder={`Search ${type}...`}
          className="px-1 py-2 mb-4 border rounded-md w-full"
        />

        {items.map((item) => (
          <button
            key={item._id}
            className={`w-full mb-1 px-2 py-1 text-left rounded hover:bg-amber-100 ${
              selectedItem?._id === item._id
                ? "bg-blue-400 text-white"
                : "bg-white"
            }`}
            onClick={() => {
              setSelectedItem(item);
              setFormData(item);
            }}
          >
            {getSidebarLabel(item)}
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="block w-full p-6 h-full bg-gray-200 rounded-2xl overflow-y-auto">
        <h1 className="text-4xl font-semibold capitalize text-center">
          {type} Content
        </h1>
        <h1 className="text-2xl font-semibold mb-6">
          {selectedItem ? (
            <>
              Edit {type} (
              <span className="text-red-500">
                {getSidebarLabel(selectedItem)}
              </span>
              )
            </>
          ) : (
            <>
              Add <span className="text-red-500">New</span> {type}
            </>
          )}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div
              key={field.name}
              className="grid grid-cols-5 align-middle shadow-lg"
            >
              <label className="block mb-1 font-medium col-span-1 h-full align-middle bg-gray-300 p-2">
                <b className="font-extrabold">{field.name}</b>{" "}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
