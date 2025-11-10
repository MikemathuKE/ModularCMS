// app/admin/contenttypes/[slug]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditContentTypePage() {
  const { slug } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [fields, setFields] = useState<
    { name: string; type: string; required?: boolean }[]
  >([]);
  const [newField, setNewField] = useState({
    name: "",
    type: "string",
    required: false,
  });

  useEffect(() => {
    async function fetchType() {
      const res = await fetch(`/api/cms/contenttypes/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setName(data.name);
        setFields(data.fields);
        setLoading(false);
      }
    }
    fetchType();
  }, [slug]);

  async function updateType(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/cms/contenttypes/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, fields }),
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

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Edit Content Type: {name}</h1>
      <form
        onSubmit={updateType}
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
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="password">Password</option>
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
              <li className="text-gray-500">createdAt (date)</li>
              <li className="text-gray-500">updatedAt (date)</li>
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
