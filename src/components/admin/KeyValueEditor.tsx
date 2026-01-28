"use client";

import { useEffect, useState } from "react";

export interface KeyValueEditorProps {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  placeholderKey?: string;
  placeholderValue?: string;
}

interface KVRow {
  key: string;
  value: string;
}

export default function KeyValueEditor({
  value = {},
  onChange,
  placeholderKey = "Key",
  placeholderValue = "Value",
}: KeyValueEditorProps) {
  const [rows, setRows] = useState<KVRow[]>([]);

  // Convert object → rows
  useEffect(() => {
    const initialRows = Object.entries(value).map(([key, val]) => ({
      key,
      value: String(val),
    }));
    if (initialRows.length > 0) setRows(initialRows);
  }, [value]);

  function updateParent(updatedRows: KVRow[]) {
    const obj: Record<string, any> = {};
    updatedRows.forEach((r) => {
      if (r.key.trim() !== "") {
        obj[r.key] = r.value;
      }
    });
    onChange(obj);
  }

  function addRow() {
    const updated = [...rows, { key: "", value: "" }];
    setRows(updated);
  }

  function updateRow(index: number, field: "key" | "value", val: string) {
    const updated = [...rows];
    updated[index][field] = val;
    setRows(updated);
    updateParent(updated);
  }

  function removeRow(index: number) {
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);
    updateParent(updated);
  }

  return (
    <div className="space-y-2">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            className="flex-1 border rounded px-2 py-1"
            placeholder={placeholderKey}
            value={row.key}
            onChange={(e) => updateRow(i, "key", e.target.value)}
          />
          <input
            className="flex-1 border rounded px-2 py-1"
            placeholder={placeholderValue}
            value={row.value}
            onChange={(e) => updateRow(i, "value", e.target.value)}
          />
          <button
            type="button"
            onClick={() => removeRow(i)}
            className="px-2 py-1 text-red-600 hover:bg-red-50 rounded"
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addRow}
        className="text-sm text-blue-600 hover:underline"
      >
        + Add
      </button>
    </div>
  );
}
