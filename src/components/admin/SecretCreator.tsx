import { slugify } from "@/lib/helperFunctions";
import { useState } from "react";

export default function SecretCreator({
  onCreated,
}: {
  onCreated: (secret: { name: string; slug: string }) => void;
}) {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);

  async function createSecret() {
    if (!name || !value) return;

    setSaving(true);

    const slug = slugify(name);

    try {
      const res = await fetch("/api/cms/secrets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, value }),
      });

      const data = await res.json();

      if (res.ok) {
        onCreated(data.data);
        setName("");
        setValue("");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border rounded p-3 space-y-2 bg-gray-50">
      <input
        className="w-full border px-2 py-1 rounded"
        placeholder="Secret name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full border px-2 py-1 rounded"
        placeholder="Secret value"
        type="password"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <button
        type="button"
        onClick={createSecret}
        disabled={saving}
        className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {saving ? "Saving..." : "Create Secret"}
      </button>
    </div>
  );
}
