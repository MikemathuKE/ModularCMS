// responsiveStyles.ts
import { CSSProperties } from "react";
import { LayoutPresets, breakpoints, LayoutType } from "./layoutPresets";

export type ResponsiveLayout =
  | LayoutType
  | Partial<Record<keyof typeof breakpoints, LayoutType>>;

export function getResponsiveStyles(
  layout?: ResponsiveLayout,
  gap?: string
): CSSProperties & Record<string, any> {
  const base: Record<string, any> = {};

  if (!layout) return base;

  if (typeof layout === "string") {
    Object.assign(base, LayoutPresets[layout]);
  } else {
    for (const [key, layoutName] of Object.entries(layout)) {
      if (!layoutName) continue;
      const bp = breakpoints[key as keyof typeof breakpoints];
      const query = `@media (min-width: ${bp}px)`;
      base[query] = LayoutPresets[layoutName];
    }
  }

  if (gap) base.gap = gap;
  return base;
}
