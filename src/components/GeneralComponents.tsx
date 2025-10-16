"use client";
import { createStyledComponent } from "@/lib/DynamicStyles";
import { CommonProps } from "@/lib/globals";

export interface TextProps extends CommonProps {
  children: React.ReactNode;
}

// Basic Components

export const Heading1 = createStyledComponent<TextProps>(
  ({ children, ...props }: TextProps) => <h1 {...props}>{children}</h1>,
  "Heading1"
);

export const Heading2 = createStyledComponent<TextProps>(
  ({ children, ...props }: TextProps) => <h2 {...props}>{children}</h2>,
  "Heading2"
);

export const Heading3 = createStyledComponent<TextProps>(
  ({ children, ...props }: TextProps) => <h3 {...props}>{children}</h3>,
  "Heading3"
);

export const Heading4 = createStyledComponent<TextProps>(
  ({ children, ...props }: TextProps) => <h4 {...props}>{children}</h4>,
  "Heading4"
);

export const Heading5 = createStyledComponent<TextProps>(
  ({ children, ...props }: TextProps) => <h5 {...props}>{children}</h5>,
  "Heading5"
);

export const Heading6 = createStyledComponent<TextProps>(
  ({ children, ...props }: TextProps) => <h6 {...props}>{children}</h6>,
  "Heading6"
);

export const Paragraph = createStyledComponent<TextProps>(
  ({ children, ...props }: TextProps) => <p {...props}>{children}</p>,
  "Paragraph"
);

export const Span = createStyledComponent<TextProps>(
  ({ children, ...props }: TextProps) => <span {...props}>{children}</span>,
  "Span"
);

export interface ButtonProps extends CommonProps {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  autoFocus?: boolean;
  // name?: string;
  // value?: string | number | readonly string[];
  // form?: string;
  // formAction?: string;
  // formEncType?: string;
  // formMethod?: string;
  // formNoValidate?: boolean;
  // formTarget?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  // onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  // onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  // onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  // onMouseLeave?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  // onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  // onKeyUp?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  // className?: string;
  // tabIndex?: number;
  // title?: string;
  // role?: string;
  children: React.ReactNode;
  modal?: string;
  link?: string;
  data?: Record<string, any>;
}

import { useRouter } from "next/navigation";

import { ModalManager } from "@/lib/ModalManager";

export const Button = createStyledComponent<ButtonProps>(
  ({ children, modal, data, link, onClick, ...props }: ButtonProps) => {
    const router = useRouter();
    function registerClick(event: React.MouseEvent<HTMLButtonElement>) {
      if (modal) {
        ModalManager.open(modal);
        ModalManager.setData(modal, data);
      } else if (link) {
        router.push(link);
      }
      if (onClick) onClick(event);
    }

    return (
      <button onClick={(e) => registerClick(e)} {...props}>
        {children}
      </button>
    );
  },
  "Button"
);

import * as Icons from "react-icons/fa"; // FontAwesome icons via react-icons

export interface IconLinkProps extends CommonProps {
  url: string;
  icon: string;
  color: string;
  size: number;
}

export const IconLink = createStyledComponent<IconLinkProps>(
  ({ url = "#", icon, color = "gray", size = 24, ...props }: IconLinkProps) => {
    const IconComp = (Icons as any)[icon] || null;
    return (
      <a href={url}>
        {IconComp && (
          <IconComp
            style={{ color: color, width: size, height: size }}
            {...props}
          />
        )}
      </a>
    );
  },
  "IconLink"
);

export interface StringProps extends CommonProps {
  text: string;
}

export const Text = createStyledComponent<StringProps>(
  ({ text }) => <>{text}</>,
  "Text"
);

import { $generateHtmlFromNodes } from "@lexical/html";
import { createEditor } from "lexical";

import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { CodeNode } from "@lexical/code";

export function lexicalJsonToHtml(json: string): string {
  try {
    if (!json || json.trim() === "") return "";

    const parsed = JSON.parse(json);
    // Ensure structure is valid
    if (!parsed.root || !parsed.root.children) {
      return "";
    }

    const editor = createEditor({
      nodes: [
        HeadingNode,
        QuoteNode,
        ListNode,
        ListItemNode,
        LinkNode,
        AutoLinkNode,
        CodeNode,
      ],
    });
    const editorState = editor.parseEditorState(parsed);

    // If state is empty, skip rendering
    if (editorState.isEmpty()) {
      return "";
    }

    let html = "";
    editor.setEditorState(editorState);
    editor.update(() => {
      html = $generateHtmlFromNodes(editor);
    });

    return html;
  } catch (err) {
    console.error("Error converting Lexical JSON to HTML:", err);
    return "";
  }
}

// utils/getNestedValue.ts
export function getNestedValue(obj: any, path: string): any {
  return path
    .split(".")
    .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

function renderWithVariables(
  html: string,
  context: Record<string, any> | undefined
) {
  if (!context) return html;
  return html.replace(/\{\{([a-zA-Z0-9_.]+)\}\}/g, (_, path) => {
    const value = getNestedValue(context, path.trim());
    return value !== undefined ? String(value) : `{{${path}}}`;
  });
}

interface RichTextProps extends StringProps {
  richText: string;
  variables?: Record<string, any>;
}

export const RichText = createStyledComponent<RichTextProps>(
  ({ richText, variables }: RichTextProps) => {
    if (!richText) return null;

    // Detect JSON vs plain text
    const isJson = richText.trim().startsWith("{");
    const html = isJson ? lexicalJsonToHtml(richText) : richText;
    if (!html) return null;

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  },
  "RichText"
);
