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
  name?: string;
  value?: string | number | readonly string[];
  form?: string;
  formAction?: string;
  formEncType?: string;
  formMethod?: string;
  formNoValidate?: boolean;
  formTarget?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  className?: string;
  tabIndex?: number;
  title?: string;
  role?: string;
  children: React.ReactNode;
}

export const Button = createStyledComponent<ButtonProps>(
  ({ children, ...props }) => <button {...props}>{children}</button>,
  "Button"
);

export interface StringProps extends CommonProps {
  text: string;
}

export const Text = createStyledComponent<StringProps>(
  ({ text }) => <>{text}</>,
  "Text"
);
