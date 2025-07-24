"use client";
import type { CSSProperties, ElementType } from "react";
import { createContext, useContext } from "react";
import { defaultTheme } from "@/theme/DefaultTheme";
import { CommonProps } from "./globals";

// Only allow string | number | null | undefined
type NullableCSSValue = string | number | null | undefined;
type SafeCSSProperties = Partial<Record<keyof CSSProperties, NullableCSSValue>>;

type StyleInput<Props = unknown> =
  | SafeCSSProperties
  | ((props: Props) => SafeCSSProperties)
  | undefined;

export type ComponentStyleMap = Record<string, Partial<CSSProperties>>;

export interface AppTheme {
  componentStyles: ComponentStyleMap;
}

export const ThemeContext = createContext<AppTheme | null>(defaultTheme);

export const useTheme = () => useContext(ThemeContext);

// Main function
export function createStyledComponent<Props extends CommonProps>(
  Component: ElementType,
  tagNameOverride: string, //override of tag name
  extraStyles?: StyleInput<Props>
) {
  const tagName =
    tagNameOverride ||
    (typeof Component === "string"
      ? Component
      : Component.displayName || Component.name || "Component");

  const Themed = (props: Props & { theme?: AppTheme }) => {
    const contextTheme = useTheme();
    const themedStyles = contextTheme?.componentStyles?.[tagName];

    // Determine computed extra styles
    const computedExtraStyles =
      typeof extraStyles === "function"
        ? extraStyles(props)
        : extraStyles ?? {};

    const mergedStyles = {
      ...themedStyles,
      ...computedExtraStyles,
      ...(props.style as CSSProperties),
    };

    // Remove nulls and undefined
    const cleanStyles = Object.fromEntries(
      Object.entries(mergedStyles).filter(
        ([, value]) => value !== null && value !== undefined
      )
    ) as CSSProperties;

    return <Component {...props} style={cleanStyles} />;
  };

  Themed.displayName = `Themed(${tagName})`;
  return Themed;
}
