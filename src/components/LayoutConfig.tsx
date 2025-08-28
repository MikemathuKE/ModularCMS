import { JSONNode } from "@/renderer/JsonRenderer";

export interface LayoutConfig {
  topbar?: JSONNode | null;
  sidebar?: JSONNode | null;
  footer?: JSONNode | null;
}
