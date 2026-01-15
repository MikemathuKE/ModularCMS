"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FieldEditor, { Field } from "@/components/admin/FieldEditor";
import SchemaJsonPreview from "@/components/admin/SchemaJsonPreview";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function NewContentTypePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [userEditedSlug, setUserEditedSlug] = useState(false);
  const [fields, setFields] = useState<Field[]>([]);

  async function createType(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/cms/contenttypes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, fields }),
    });

    if (res.ok) router.push("/admin/contenttypes");
    else console.error(await res.json());
  }

  function onNameChange(value: string) {
    setName(value);

    if (!userEditedSlug) {
      setSlug(slugify(value));
    }
  }

  function onSlugChange(value: string) {
    setSlug(value);
    setUserEditedSlug(true);
  }

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-xl font-semibold mb-4">New Content Type</h1>
      <div className="grid grid-cols-2 gap-6">
        {/*Schema Editor */}
        <form onSubmit={createType} className="space-y-4">
          <input
            className="border px-3 py-2 w-full"
            placeholder="Name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />

          <input
            className="border px-3 py-2 w-full"
            placeholder="slug"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
          />

          <div className="space-y-3">
            {fields.map((field, i) => (
              <FieldEditor
                key={i}
                field={field}
                onChange={(updated) => {
                  const next = [...fields];
                  next[i] = updated;
                  setFields(next);
                }}
                onRemove={() => setFields(fields.filter((_, idx) => idx !== i))}
              />
            ))}
            <button
              type="button"
              onClick={() =>
                setFields([
                  ...fields,
                  { kind: "primitive", name: "", type: "string" },
                ])
              }
              className="text-blue-600"
            >
              + Add root field
            </button>
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Content Type
          </button>
        </form>
        {/*JSON Preview */}
        <SchemaJsonPreview fields={fields} />
      </div>
    </div>
  );
}
