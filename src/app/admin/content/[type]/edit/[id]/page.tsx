"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MediaSelector from "@/components/admin/MediaSelector";

export default function EditContentPage() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const router = useRouter();
  const [fields, setFields] = useState<any[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [fieldsRes, itemRes] = await Promise.all([
        fetch(`/api/cms/contenttypes/${type}`),
        fetch(`/api/cms/content/${type}/${id}`),
      ]);
      const fieldsData = await fieldsRes.json();
      const itemData = await itemRes.json();
      setFields(fieldsData.fields || []);
      setFormData(itemData || {});
      setLoading(false);
    }
    fetchData();
  }, [type, id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch(`/api/cms/content/${type}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    router.push(`/admin/content/${type}`);
  }

  function renderField(field: any) {
    const common = {
      id: field.name,
      name: field.name,
    };

    switch (field.type) {
      case "string":
        <input
          type="text"
          {...common}
          value={formData[field.name] || ""}
          onChange={(e) =>
            setFormData({ ...formData, [field.name]: e.target.value })
          }
          className="w-full px-3 py-2 border rounded"
        />;
      case "text":
        return (
          <textarea
            {...common}
            value={formData[field.name] || ""}
            onChange={(e) =>
              setFormData({ ...formData, [field.name]: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
          />
        );
      case "number":
        return (
          <input
            type="number"
            {...common}
            value={formData[field.name] || ""}
            onChange={(e) =>
              setFormData({ ...formData, [field.name]: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
          />
        );
      case "boolean":
        return (
          <input
            type="checkbox"
            {...common}
            checked={!!formData[field.name]}
            onChange={(e) =>
              setFormData({ ...formData, [field.name]: e.target.checked })
            }
          />
        );
      case "image":
      case "video":
      case "audio":
        return (
          <MediaSelector
            type={field.type.toLowerCase()}
            selected={formData[field.name]}
            onSelect={(url) => setFormData({ ...formData, [field.name]: url })}
          />
        );
      case "date":
        return (
          <input
            type="date"
            {...common}
            value={formData[field.name] || ""}
            onChange={(e) =>
              setFormData({ ...formData, [field.name]: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
          />
        );
      default:
        return (
          <input
            type="text"
            {...common}
            value={formData[field.name] || ""}
            onChange={(e) =>
              setFormData({ ...formData, [field.name]: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
          />
        );
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Edit {type} ({id})
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block mb-1 font-medium" htmlFor={field.name}>
              {field.name}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            {renderField(field)}
          </div>
        ))}
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
