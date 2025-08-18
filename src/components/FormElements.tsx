"use client";

import React from "react";
import { createStyledComponent } from "@/lib/DynamicStyles";
import { CommonProps } from "@/lib/globals";

export interface CustomFormProps extends CommonProps {
  // Core form attributes
  action?: string;
  method?: "get" | "post";
  encType?:
    | "application/x-www-form-urlencoded"
    | "multipart/form-data"
    | "text/plain";
  name?: string;
  target?: "_self" | "_blank" | "_parent" | "_top" | string;
  autoComplete?: string;
  noValidate?: boolean;
  acceptCharset?: string;

  // Event Handlers
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  onReset?: React.FormEventHandler<HTMLFormElement>;

  // HTML Global attributes
  className?: string;
  role?: string;
  tabIndex?: number;
  title?: string;
  lang?: string;
  dir?: "ltr" | "rtl" | "auto";
  accessKey?: string;

  // Custom Props
  children?: React.ReactNode;
}

export const Form = createStyledComponent<CustomFormProps>(
  ({ children, ...props }: CustomFormProps) => (
    <form {...props}>{children}</form>
  ),
  "Form"
);

// --- 1. Text Input ---
export interface TextInputProps extends CommonProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  minLength?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  autoComplete?: string;
  pattern?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}

export const TextInput = createStyledComponent<TextInputProps>(
  (props) => <input type="text" {...props} />,
  "TextInput"
);

// --- 2. Email Input ---
export interface EmailInputProps extends CommonProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  minLength?: number;
  autoComplete?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EmailInput = createStyledComponent<EmailInputProps>(
  (props) => <input type="email" {...props} />,
  "EmailInput"
);

// --- 3. Password Input ---
export interface PasswordInputProps extends CommonProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  autoComplete?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PasswordInput = createStyledComponent<PasswordInputProps>(
  (props) => <input type="password" {...props} />,
  "PasswordInput"
);

// --- 4. Number Input ---
export interface NumberInputProps extends CommonProps {
  name?: string;
  value?: number;
  defaultValue?: number;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const NumberInput = createStyledComponent<NumberInputProps>(
  (props) => <input type="number" {...props} />,
  "NumberInput"
);

// --- 5. Checkbox Input ---
export interface CheckboxInputProps extends CommonProps {
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  required?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CheckboxInput = createStyledComponent<CheckboxInputProps>(
  (props) => <input type="checkbox" {...props} />,
  "CheckboxInput"
);

// --- 6. Radio Input ---
export interface RadioInputProps extends CommonProps {
  name?: string;
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RadioInput = createStyledComponent<RadioInputProps>(
  (props) => <input type="radio" {...props} />,
  "RadioInput"
);

// --- 7. File Input ---
export interface FileInputProps extends CommonProps {
  name?: string;
  multiple?: boolean;
  accept?: string;
  required?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileInput = createStyledComponent<FileInputProps>(
  (props) => <input type="file" {...props} />,
  "FileInput"
);

// --- 8. Date Input ---
export interface DateInputProps extends CommonProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  required?: boolean;
  min?: string;
  max?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DateInput = createStyledComponent<DateInputProps>(
  (props) => <input type="date" {...props} />,
  "DateInput"
);

export interface ErrorTextProps extends CommonProps {
  error?: string;
}

export const ErrorText = createStyledComponent<ErrorTextProps>(
  ({ error, ...props }: ErrorTextProps) => <span {...props}>{error}</span>,
  "ErrorText"
);

export interface FieldWrapperProps extends CommonProps {
  label?: string;
  error?: string;
  children?: React.ReactNode;
}

export const FieldWrapper = createStyledComponent<FieldWrapperProps>(
  ({ children, label, error, ...props }: FieldWrapperProps) => (
    <div {...props}>
      {label && <Label>{label}</Label>}
      {children}
      {error && <ErrorText error={error} />}
    </div>
  ),
  "FieldWrapper"
);

export interface LabelProps extends CommonProps {
  htmlFor?: string;
  children?: React.ReactNode;
}
export const Label = createStyledComponent<LabelProps>(
  ({ children, ...props }: LabelProps) => <label {...props}>{children}</label>,
  "Label"
);

export interface FormGroupProps extends CommonProps {
  children?: React.ReactNode;
}
export const FormGroup = createStyledComponent<FormGroupProps>(
  ({ children, ...props }: FormGroupProps) => <div {...props}>{children}</div>,
  "FormGroup"
);

export interface RangeInputProps extends CommonProps {
  name?: string;
  value?: string | number;
  defaultValue?: string | number;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  tabIndex?: number;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

export const RangeInput = createStyledComponent<RangeInputProps>(
  (props) => <input type="range" {...props} />,
  "RangeInput"
);

export interface SelectInputProps extends CommonProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  required?: boolean;
  multiple?: boolean;
  size?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  children?: React.ReactNode;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  onFocus?: React.FocusEventHandler<HTMLSelectElement>;
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
}

export const SelectInput = createStyledComponent<SelectInputProps>(
  (props) => <select {...props} />,
  "SelectInput"
);

export interface OptionProps extends CommonProps {
  value?: string;
  children: React.ReactNode;
}

export const Option = createStyledComponent<OptionProps>(
  ({ value, children }: OptionProps) => (
    <option value={value}>{children}</option>
  ),
  "Option"
);

export interface TextAreaProps extends CommonProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
  cols?: number;
  maxLength?: number;
  minLength?: number;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  wrap?: "hard" | "soft" | "off";
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
}

export const TextArea = createStyledComponent<TextAreaProps>(
  (props) => <textarea {...props} />,
  "SelectInput"
);
