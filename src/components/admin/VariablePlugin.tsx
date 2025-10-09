import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { $createVariableNode } from "./VariableNode";
import { $getSelection, $isRangeSelection, $createTextNode } from "lexical";

export function VariablePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const textContent = selection.getTextContent();
        // ✅ Allow alphanumerics, underscores, and dots in variable paths
        const regex = /\{\{([a-zA-Z0-9_.]+)\}\}/g;
        const match = regex.exec(textContent);

        if (match && match[1]) {
          const path = match[1].trim();
          editor.update(() => {
            const variableNode = $createVariableNode(path);
            selection.insertNodes([variableNode, $createTextNode(" ")]);
          });
        }
      });
    });
  }, [editor]);

  return null;
}
