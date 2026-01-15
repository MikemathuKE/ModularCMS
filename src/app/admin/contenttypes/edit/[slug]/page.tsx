"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import FieldEditor, { Field } from "@/components/admin/FieldEditor";
import SchemaJsonPreview from "@/components/admin/SchemaJsonPreview";

export default function EditContentTypePage() {
  const { slug } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [fields, setFields] = useState<Field[]>([]);

  useEffect(() => {
    async function fetchType() {
      const res = await fetch(`/api/cms/contenttypes/${slug}`);
      if (!res.ok) return;

      const data = await res.json();
      setName(data.name);
      setFields(data.fields || []);
      setLoading(false);
    }

    fetchType();
  }, [slug]);

  async function updateType(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(`/api/cms/contenttypes/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        fields,
      }),
    });

    if (res.ok) {
      router.push("/admin/contenttypes");
    } else {
      console.error(await res.json());
    }
  }

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-xl font-semibold mb-4">Edit Content Type: {name}</h1>

      <form onSubmit={updateType} className="grid grid-cols-2 gap-6">
        {/* LEFT — Editor */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <h2 className="text-md font-medium">Fields</h2>

            {fields.map((field, index) => (
              <FieldEditor
                key={index}
                field={field}
                onChange={(updated) => {
                  const next = [...fields];
                  next[index] = updated;
                  setFields(next);
                }}
                onRemove={() => setFields(fields.filter((_, i) => i !== index))}
              />
            ))}

            <button
              type="button"
              onClick={() =>
                setFields([
                  ...fields,
                  {
                    kind: "primitive",
                    name: "",
                    type: "string",
                  },
                ])
              }
              className="text-blue-600 text-sm"
            >
              + Add root field
            </button>
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </div>

        {/* RIGHT — JSON Preview */}
        <SchemaJsonPreview fields={fields} title="Example JSON Output" />
      </form>
    </div>
  );
}
