import type { CSSProperties } from "react";

export const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export interface CommonProps {
  id?: string;
  style?: CSSProperties;
}

export const TAB_WIDTH: number = 701;

export interface TableColumn {
  key: string;
  label: string;
}
