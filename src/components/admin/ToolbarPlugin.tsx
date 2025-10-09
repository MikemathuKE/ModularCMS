"use client";
import React, { useCallback } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $isTextNode,
  TextNode,
} from "lexical";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $createCodeNode } from "@lexical/code";

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const format = (type: "bold" | "italic" | "underline") =>
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, type);

  const setHeading = (tag: "h1" | "h2" | "h3" | "p") =>
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (tag === "p") editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        else selection.insertNodes([$createHeadingNode(tag)]);
      }
    });

  const insertQuote = () =>
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection))
        selection.insertNodes([$createQuoteNode()]);
    });

  const insertCodeBlock = () =>
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection))
        selection.insertNodes([$createCodeNode()]);
    });

  const insertLink = useCallback(() => {
    const url = window.prompt("Enter link URL:");
    if (url) editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
  }, [editor]);

  const applyInlineStyle = (styleKey: string, styleValue: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const nodes = selection.getNodes();
        for (const node of nodes) {
          if ($isTextNode(node)) {
            const textNode = node as TextNode;
            const currentStyle = textNode.getStyle() || "";
            const newStyle = mergeStyle(currentStyle, styleKey, styleValue);
            textNode.setStyle(newStyle);
          }
        }
      }
    });
  };

  function mergeStyle(style: string, key: string, val: string): string {
    const rules = Object.fromEntries(
      style
        .split(";")
        .map((r) => r.trim())
        .filter(Boolean)
        .map((r) => r.split(":").map((s) => s.trim()))
    );
    rules[key] = val;
    return Object.entries(rules)
      .map(([k, v]) => `${k}: ${v}`)
      .join("; ");
  }

  const changeColor = (color: string) => applyInlineStyle("color", color);
  const changeBackground = (color: string) =>
    applyInlineStyle("background-color", color);
  const changeFont = (family: string) =>
    applyInlineStyle("font-family", family);

  return (
    <div className="flex flex-wrap gap-2 mb-2 border-b pb-2">
      {/* text styles */}
      <button
        onClick={() => format("bold")}
        className="px-2 py-1 border rounded font-bold"
      >
        B
      </button>
      <button
        onClick={() => format("italic")}
        className="px-2 py-1 border rounded italic"
      >
        I
      </button>
      <button
        onClick={() => format("underline")}
        className="px-2 py-1 border rounded underline"
      >
        U
      </button>

      {/* headings */}
      <button
        onClick={() => setHeading("h1")}
        className="px-2 py-1 border rounded"
      >
        H1
      </button>
      <button
        onClick={() => setHeading("h2")}
        className="px-2 py-1 border rounded"
      >
        H2
      </button>
      <button
        onClick={() => setHeading("h3")}
        className="px-2 py-1 border rounded"
      >
        H3
      </button>
      <button
        onClick={() => setHeading("p")}
        className="px-2 py-1 border rounded"
      >
        ¶
      </button>

      {/* lists */}
      <button
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
        className="px-2 py-1 border rounded"
      >
        • List
      </button>
      <button
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
        className="px-2 py-1 border rounded"
      >
        1. List
      </button>

      {/* quote & code */}
      <button onClick={insertQuote} className="px-2 py-1 border rounded italic">
        ❝Quote❞
      </button>
      <button
        onClick={insertCodeBlock}
        className="px-2 py-1 border rounded font-mono"
      >
        Code
      </button>

      {/* alignment */}
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
        className="px-2 py-1 border rounded"
      >
        ⬅
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
        className="px-2 py-1 border rounded"
      >
        ⬍
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
        className="px-2 py-1 border rounded"
      >
        ➡
      </button>
      <button
        onClick={() =>
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")
        }
        className="px-2 py-1 border rounded"
      >
        ☰
      </button>

      {/* link */}
      <button
        onClick={insertLink}
        className="px-2 py-1 border rounded text-blue-600"
      >
        🔗 Link
      </button>

      {/* font & color */}
      <select
        onChange={(e) => changeFont(e.target.value)}
        className="border rounded px-1"
      >
        <option value="">Font</option>
        <option value="Arial">Arial</option>
        <option value="Georgia">Georgia</option>
        <option value="Courier New">Courier New</option>
        <option value="Times New Roman">Times New Roman</option>
      </select>

      <input
        type="color"
        onChange={(e) => changeColor(e.target.value)}
        title="Text Color"
        className="cursor-pointer"
      />

      <input
        type="color"
        onChange={(e) => changeBackground(e.target.value)}
        title="Highlight Color"
        className="cursor-pointer"
      />
    </div>
  );
}
