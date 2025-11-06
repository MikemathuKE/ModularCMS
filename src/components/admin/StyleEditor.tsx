// components/admin/StyleEditor.tsx
"use client";
import React, { useState } from "react";

interface StyleEditorProps {
  style: React.CSSProperties;
  onChange: (style: React.CSSProperties) => void;
}

const cssKeys = [
  "color",
  "backgroundColor",
  "fontSize",
  "fontWeight",
  "margin",
  "padding",
  "border",
  "borderRadius",
  "display",
  "flexDirection",
  "alignItems",
  "justifyContent",
  "width",
  "height",
  "textAlign",
];

export default function StyleEditor({ style, onChange }: StyleEditorProps) {
  const [expanded, setExpanded] = useState(false);

  const handleStyleChange = (key: string, value: string) => {
    onChange({ ...style, [key]: value });
  };

  return (
    <div className="border rounded p-2 bg-white shadow-sm">
      <button
        className="font-medium text-sm w-full text-left"
        onClick={() => setExpanded(!expanded)}
      >
        🎨 Style {expanded ? "▾" : "▸"}
      </button>
      {expanded && (
        <div className="mt-2 flex flex-col gap-1">
          {cssKeys.map((key) => (
            <div key={key} className="flex justify-between items-center gap-2">
              <label className="text-sm flex-1">{key}</label>
              <input
                type="text"
                className="border rounded p-1 text-sm flex-1"
                value={(style as any)[key] ?? ""}
                placeholder="e.g. 20px, red"
                onChange={(e) => handleStyleChange(key, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
