// app/admin/contenttypes/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewContentTypePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [fields, setFields] = useState<
    { name: string; type: string; required?: boolean }[]
  >([]);
  const [newField, setNewField] = useState({
    name: "",
    type: "string",
    required: false,
  });

  async function createType(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/cms/contenttypes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, fields }),
    });
    if (res.ok) {
      router.push("/admin/contenttypes");
    } else {
      console.error(await res.json());
    }
  }

  function addField() {
    if (!newField.name) return;
    setFields([...fields, newField]);
    setNewField({ name: "", type: "string", required: false });
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">New Content Type</h1>
      <form
        onSubmit={createType}
        className="space-y-4 border rounded-lg p-4 bg-white shadow"
      >
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            className="mt-1 block w-full border rounded px-2 py-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Slug</label>
          <input
            type="text"
            className="mt-1 block w-full border rounded px-2 py-1"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>

        <div>
          <h2 className="text-md font-medium mb-2">Fields</h2>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Field name"
              className="border rounded px-2 py-1 flex-1"
              value={newField.name}
              onChange={(e) =>
                setNewField({ ...newField, name: e.target.value })
              }
            />
            <select
              className="border rounded px-2 py-1"
              value={newField.type}
              onChange={(e) =>
                setNewField({ ...newField, type: e.target.value })
              }
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="date">Date</option>
              <option value="json">JSON</option>
              <option value="audio">Audio</option>
              <option value="video">Video</option>
              <option value="image">Image</option>
            </select>
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={newField.required}
                onChange={(e) =>
                  setNewField({ ...newField, required: e.target.checked })
                }
              />
              Required
            </label>
            <button
              type="button"
              onClick={addField}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Add
            </button>
          </div>

          {fields.length > 0 && (
            <ul className="list-disc pl-5 text-sm">
              {fields.map((f, i) => (
                <li key={i}>
                  {f.name} ({f.type}) {f.required && "*"}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save Content Type
        </button>
      </form>
    </div>
  );
}
