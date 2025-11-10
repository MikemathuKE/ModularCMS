"use client";
import type { CSSProperties, ElementType } from "react";
import React, { createContext, useContext, useState, useMemo } from "react";
import { defaultTheme } from "@/theme/DefaultTheme";
import { CommonProps } from "./globals";

// Only allow string | number | null | undefined
type NullableCSSValue = string | number | null | undefined;
type SafeCSSProperties = Partial<Record<keyof CSSProperties, NullableCSSValue>>;

type StyleInput<Props = unknown> =
  | SafeCSSProperties
  | ((props: Props) => SafeCSSProperties)
  | undefined;

export interface ExtendedCSSProperties extends CSSProperties {
  hover?: CSSProperties;
  focus?: CSSProperties;
  active?: CSSProperties;
  before?: CSSProperties;
  after?: CSSProperties;
  disabled?: CSSProperties;
}

export type ComponentStyleMap = Record<string, Partial<ExtendedCSSProperties>>;

export interface ThemeVariables {
  light: Record<string, string>;
  dark: Record<string, string>;
}

export interface AppTheme {
  componentStyles: ComponentStyleMap;
  variables: ThemeVariables;
  layout: "default" | string;
  themeMode?: "light" | "dark";
}

export interface ThemeContextValue {
  theme: AppTheme;
  themeMode: "light" | "dark";
  layout: "default" | string;
  setThemeMode: (mode: "light" | "dark") => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: { ...defaultTheme, themeMode: "light" },
  themeMode: "light",
  layout: "default",
  setThemeMode: () => {},
});

export const ThemeProvider: React.FC<{
  initialTheme?: AppTheme;
  initialMode?: "light" | "dark";
  children: React.ReactNode;
}> = ({ initialTheme = defaultTheme, initialMode = "light", children }) => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">(initialMode);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: { ...initialTheme, themeMode },
      themeMode,
      layout: initialTheme?.layout || "default",
      setThemeMode,
    }),
    [initialTheme, themeMode]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Hooks
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx.theme;
};

export const useThemeMode = () => {
  const { themeMode, setThemeMode } = useContext(ThemeContext);
  return { themeMode, setThemeMode };
};

// --- Utility: resolve {{varName}} placeholders ---
function resolveVariables(
  styles: CSSProperties,
  variables: Record<string, string>
): CSSProperties {
  const resolved: CSSProperties = {};
  for (const [key, value] of Object.entries(styles)) {
    if (typeof value === "string") {
      const replaced = value.replace(/\{\{(.+?)\}\}/g, (_, varName) => {
        const trimmed = varName.trim();
        return variables[trimmed] ?? "";
      });
      resolved[key as keyof CSSProperties] = replaced as any;
    } else {
      resolved[key as keyof CSSProperties] = value as any;
    }
  }
  return resolved;
}

// Main function
export function createStyledComponent<Props extends CommonProps>(
  Component: ElementType,
  tagNameOverride: string,
  extraStyles?: StyleInput<Props>
) {
  const tagName =
    tagNameOverride ||
    (typeof Component === "string"
      ? Component
      : Component.displayName || Component.name || "Component");

  const Themed = (props: Props & { theme?: AppTheme }) => {
    const theme = useTheme();
    const themeMode = theme.themeMode ?? "light";
    const variables = theme.variables?.[themeMode] ?? {};

    const themedStyles = theme?.componentStyles?.[tagName];

    // Compute extra styles
    const computedExtraStyles =
      typeof extraStyles === "function"
        ? extraStyles(props)
        : extraStyles ?? {};

    const mergedStyles = {
      ...themedStyles,
      ...computedExtraStyles,
      ...(props.style as CSSProperties),
    };

    // Remove nulls/undefined
    const cleanStyles = Object.fromEntries(
      Object.entries(mergedStyles).filter(
        ([, value]) => value !== null && value !== undefined
      )
    ) as CSSProperties;

    // 🔑 Resolve variables (including nested inside strings)
    const finalStyles = resolveVariables(cleanStyles, variables);

    return <Component {...props} style={finalStyles} />;
  };

  Themed.displayName = `Themed(${tagName})`;
  return Themed;
}
