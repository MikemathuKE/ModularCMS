"use client";
import React, { useEffect, useMemo } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ToolbarPlugin } from "./ToolbarPlugin";

import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { CodeNode } from "@lexical/code";
import { VariableNode } from "@/components/admin/VariableNode"; // adjust path
import { VariablePlugin } from "@/components/admin/VariablePlugin";

const theme = {
  paragraph: "mb-2",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
  },
  heading: {
    h1: "text-3xl font-bold mb-2",
    h2: "text-2xl font-semibold mb-2",
    h3: "text-xl font-semibold mb-2",
  },
  quote: "border-l-4 border-gray-400 pl-3 italic text-gray-700 my-2",
  code: "bg-gray-100 font-mono px-2 py-1 rounded text-sm",
  link: "text-blue-600 underline",
  textAlignment: {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  },
};

function LoadInitialContent({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!value) return;
    try {
      const parsed = JSON.parse(value);
      const newState = editor.parseEditorState(parsed);
      // Only update if it’s not already the same
      editor.setEditorState(newState);
    } catch (err) {
      console.warn("Could not parse Lexical JSON:", err);
    }
  }, [value]);

  return null;
}

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (json: string) => void;
}) {
  const initialConfig = useMemo(
    () => ({
      namespace: "RichTextEditor",
      theme,
      onError(error: Error) {
        console.error(error);
      },
      nodes: [
        HeadingNode,
        QuoteNode,
        ListNode,
        ListItemNode,
        LinkNode,
        AutoLinkNode,
        CodeNode,
        VariableNode,
      ],
    }),
    [] // 👈 empty deps => stable reference
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      {/* Load saved content whenever the prop changes */}
      <LoadInitialContent value={value} />

      <ToolbarPlugin />
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="border p-2 rounded min-h-[150px] outline-none" />
        }
        placeholder={<div className="text-gray-400 p-2">Start typing…</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <OnChangePlugin
        onChange={(editorState) => {
          onChange(JSON.stringify(editorState.toJSON()));
        }}
      />
      <VariablePlugin />
    </LexicalComposer>
  );
}
