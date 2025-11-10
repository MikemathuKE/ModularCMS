"use client";

import React, { useState, useEffect } from "react";
import { createStyledComponent } from "@/lib/DynamicStyles";
import { CommonProps } from "@/lib/globals";
import { Button, Heading3 } from "./GeneralComponents";

export interface CustomFormProps extends CommonProps {
  contentType: string; // required
  formTitle: string; // required
  initialValues?: Record<string, any>; // preload values
  onSuccess?: (data: any) => void; // callback after submission
  onError?: (err: any) => void; // callback if submission fails

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

interface FieldDef {
  name: string;
  type: string; // "string" | "number" | "boolean" | "date" | "text" | "file" | "image"
  required?: boolean;
  label?: string;
}

export const Form = createStyledComponent<CustomFormProps>(
  ({
    contentType,
    formTitle,
    initialValues = {},
    onSuccess,
    onError,
    children,
    ...props
  }: CustomFormProps) => {
    const [fields, setFields] = useState<FieldDef[]>([]);
    const [values, setValues] = useState<Record<string, any>>(initialValues);
    const [files, setFiles] = useState<Record<string, File | null>>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Load schema for contentType
    useEffect(() => {
      async function fetchSchema() {
        try {
          const res = await fetch(`/api/cms/contenttypes/${contentType}`);
          const schema = await res.json();
          setFields(schema.fields || []);
          // initialize values
          const defaults: Record<string, any> = {};
          schema.fields.forEach((f: FieldDef) => {
            if (f.type === "boolean")
              defaults[f.name] = initialValues[f.name] ?? false;
            else defaults[f.name] = initialValues[f.name] ?? "";
          });
          setValues(defaults);
        } catch (err) {
          console.error("Error fetching schema:", err);
        } finally {
          setLoading(false);
        }
      }

      if (contentType) {
        fetchSchema();
      } else {
        setLoading(false);
      }
    }, [contentType]);

    function handleChange(
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) {
      const {
        name,
        type,
        value,
        checked,
        files: fileList,
      } = e.target as HTMLInputElement;

      if (type === "file" && fileList) {
        setFiles((prev) => ({ ...prev, [name]: fileList[0] || null }));
      } else {
        setValues((prev) => ({
          ...prev,
          [name]: type === "checkbox" ? checked : value,
        }));
      }
    }

    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (contentType) {
        setSubmitting(true);
        try {
          let res;

          // If files are included → use multipart/form-data
          if (Object.values(files).some((f) => f !== null)) {
            const formData = new FormData();
            Object.entries(values).forEach(([k, v]) => formData.append(k, v));
            Object.entries(files).forEach(([k, f]) => {
              if (f) formData.append(k, f);
            });

            res = await fetch(`/api/cms/content/${contentType}`, {
              method: "POST",
              body: formData,
            });
          } else {
            res = await fetch(`/api/cms/content/${contentType}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            });
          }

          if (!res.ok) throw new Error("Failed to submit form");
          const data = await res.json();
          if (onSuccess) onSuccess(data);
        } catch (err) {
          console.error(err);
          if (onError) onError(err);
        } finally {
          setSubmitting(false);
        }
      }
    }

    if (loading) {
      return <div>Loading {contentType} form...</div>;
    }

    return (
      <form {...props} onSubmit={handleSubmit}>
        {formTitle && <Heading3>{formTitle}</Heading3>}
        {fields &&
          fields.map((field) => (
            <FieldWrapper
              key={field.name}
              label={field.label || field.name}
              required={field.required}
            >
              {field.type === "string" && (
                <TextInput
                  name={field.name}
                  value={values[field.name] || ""}
                  onChange={handleChange}
                  required={field.required}
                />
              )}

              {field.type === "number" && (
                <NumberInput
                  name={field.name}
                  value={values[field.name] || ""}
                  onChange={handleChange}
                  required={field.required}
                />
              )}

              {field.type === "boolean" && (
                <CheckboxInput
                  name={field.name}
                  checked={!!values[field.name]}
                  onChange={handleChange}
                />
              )}

              {field.type === "date" && (
                <DateInput
                  name={field.name}
                  value={values[field.name] || ""}
                  onChange={handleChange}
                />
              )}

              {field.type === "text" && (
                <TextArea
                  name={field.name}
                  value={values[field.name] || false}
                  onChange={handleChange}
                  required={field.required}
                />
              )}

              {field.type === "email" && (
                <EmailInput
                  name={field.name}
                  value={values[field.name] || false}
                  onChange={handleChange}
                  required={field.required}
                />
              )}

              {field.type === "password" && (
                <PasswordInput
                  name={field.name}
                  value={values[field.name] || false}
                  onChange={handleChange}
                  required={field.required}
                />
              )}

              {field.type === "file" || field.type === "image" ? (
                <FileInput
                  name={field.name}
                  onChange={handleChange}
                  accept={field.type === "image" ? "image/*" : undefined}
                  required={field.required}
                />
              ) : null}
            </FieldWrapper>
          ))}

        {/* Extra manual children */}
        {children}

        <Button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    );
  },
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
  required?: boolean;
  children?: React.ReactNode;
}

export const FieldWrapper = createStyledComponent<FieldWrapperProps>(
  ({ children, label, required, error, ...props }: FieldWrapperProps) => (
    <div {...props}>
      {label && (
        <Label>
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
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
  "TextArea"
);
