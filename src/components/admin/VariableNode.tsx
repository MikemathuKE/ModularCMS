// VariableNode.ts
import {
  DecoratorNode,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import * as React from "react";

export type SerializedVariableNode = Spread<
  { type: "variable"; path: string; version: 1 },
  SerializedLexicalNode
>;

export class VariableNode extends DecoratorNode<React.ReactElement> {
  __path: string;

  static getType(): string {
    return "variable";
  }

  static clone(node: VariableNode): VariableNode {
    return new VariableNode(node.__path, node.__key);
  }

  constructor(path: string, key?: NodeKey) {
    super(key);
    this.__path = path;
  }

  decorate(): React.ReactElement {
    return (
      <span
        contentEditable={false}
        className="inline-block px-1 mx-0.5 bg-blue-100 text-blue-700 rounded font-mono text-sm"
      >
        {`{{${this.__path}}}`}
      </span>
    );
  }

  static importJSON(serialized: SerializedVariableNode): VariableNode {
    return new VariableNode(serialized.path);
  }

  exportJSON(): SerializedVariableNode {
    return {
      type: "variable",
      path: this.__path,
      version: 1,
    };
  }

  createDOM(): HTMLElement {
    const span = document.createElement("span");
    span.className =
      "inline-block px-1 mx-0.5 bg-blue-100 text-blue-700 rounded font-mono text-sm";
    span.contentEditable = "false";
    span.textContent = `{{${this.__path}}}`;
    return span;
  }

  updateDOM(): boolean {
    return false;
  }
}

export function $createVariableNode(path: string): VariableNode {
  return new VariableNode(path);
}

export function $isVariableNode(node?: LexicalNode): node is VariableNode {
  return node instanceof VariableNode;
}
