export type Field =
  | {
      kind: "primitive";
      name: string;
      type: string;
      required?: boolean;
    }
  | {
      kind: "object";
      name: string;
      fields: Field[];
    }
  | {
      kind: "list";
      name: string;
      of: Field;
    };

export default function FieldEditor({
  field,
  onChange,
  onRemove,
}: {
  field: Field;
  onChange: (f: Field) => void;
  onRemove?: () => void;
}) {
  return (
    <div className="border rounded p-3 space-y-2 bg-gray-50">
      <div className="flex gap-2">
        <input
          className="border px-2 py-1 flex-1"
          placeholder="Field name"
          value={field.name}
          onChange={(e) => onChange({ ...field, name: e.target.value })}
        />

        <select
          className="border px-2 py-1"
          value={field.kind}
          onChange={(e) => {
            const kind = e.target.value as Field["kind"];
            if (kind === "primitive")
              onChange({ kind, name: field.name, type: "string" });
            if (kind === "object")
              onChange({ kind, name: field.name, fields: [] });
            if (kind === "list")
              onChange({
                kind,
                name: field.name,
                of: { kind: "primitive", name: "item", type: "string" },
              });
          }}
        >
          <option value="primitive">Primitive</option>
          <option value="object">Object</option>
          <option value="list">List</option>
        </select>

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-600 text-sm"
          >
            ✕
          </button>
        )}
      </div>

      {field.kind === "primitive" && (
        <div className="flex gap-2 items-center">
          <select
            className="border px-2 py-1"
            value={field.type}
            onChange={(e) => onChange({ ...field, type: e.target.value })}
          >
            <option value="string">Text</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="date">Date</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>

          <label className="text-sm flex items-center gap-1">
            <input
              type="checkbox"
              checked={field.required || false}
              onChange={(e) =>
                onChange({ ...field, required: e.target.checked })
              }
            />
            Required
          </label>
        </div>
      )}

      {field.kind === "object" && (
        <div className="pl-4 space-y-2">
          {field.fields.map((f, i) => (
            <FieldEditor
              key={i}
              field={f}
              onChange={(updated) => {
                const next = [...field.fields];
                next[i] = updated;
                onChange({ ...field, fields: next });
              }}
              onRemove={() => {
                onChange({
                  ...field,
                  fields: field.fields.filter((_, idx) => idx !== i),
                });
              }}
            />
          ))}
          <button
            type="button"
            onClick={() =>
              onChange({
                ...field,
                fields: [
                  ...field.fields,
                  { kind: "primitive", name: "", type: "string" },
                ],
              })
            }
            className="text-blue-600 text-sm"
          >
            + Add field
          </button>
        </div>
      )}

      {field.kind === "list" && (
        <div className="pl-4">
          <p className="text-sm text-gray-600 mb-1">List item schema</p>
          <FieldEditor
            field={field.of}
            onChange={(updated) => onChange({ ...field, of: updated })}
          />
        </div>
      )}
    </div>
  );
}
