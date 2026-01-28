import { Secret } from "@/lib/types/types";

export default function SecretSelect({
  value,
  secrets,
  onChange,
}: {
  value?: string;
  secrets: Secret[];
  onChange: (slug: string) => void;
}) {
  return (
    <select
      className="w-full border px-3 py-2 rounded bg-white"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">— Select Secret —</option>
      {secrets.map((s) => (
        <option key={s.slug} value={s.slug}>
          {s.name} ({s.slug})
        </option>
      ))}
    </select>
  );
}
