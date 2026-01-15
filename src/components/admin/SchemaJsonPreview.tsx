import { useMemo } from "react";
import { generateSchemaPreview } from "@/lib/generateSchemaPreview";

export default function SchemaJsonPreview({
  fields,
  title = "Example JSON Output",
}: {
  fields: any[];
  title?: string;
}) {
  const example = useMemo(() => {
    return generateSchemaPreview(fields);
  }, [fields]);

  return (
    <div className="border rounded-lg bg-gray-900 text-gray-100 p-4">
      <h3 className="text-sm font-medium mb-2 text-gray-300">{title}</h3>
      <pre className="text-xs overflow-auto max-h-[400px]">
        {JSON.stringify(example, null, 2)}
      </pre>
    </div>
  );
}
