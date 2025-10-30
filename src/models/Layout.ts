import mongoose, { Schema, Document, models } from "mongoose";
import { JSONNode } from "@/renderer/JsonRenderer";

export interface LayoutConfig {
  topbar?: JSONNode | null;
  sidebar?: JSONNode | null;
  footer?: JSONNode | null;
}

export interface LayoutDocument extends Document {
  name: string;
  config: LayoutConfig;
}

export const LayoutSchema = new Schema<LayoutDocument>({
  name: { type: String, required: true, unique: true },
  config: { type: Schema.Types.Mixed, required: true },
});

export function getOrCreateLayoutModel(conn: Connection | any) {
  return conn.models["Layout"] || conn.model("Layout", LayoutSchema);
}

export default models.Layout ||
  mongoose.model<LayoutDocument>("Layout", LayoutSchema);
