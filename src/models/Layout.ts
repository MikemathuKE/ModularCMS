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

const LayoutSchema = new Schema<LayoutDocument>({
  name: { type: String, required: true, unique: true },
  config: { type: Schema.Types.Mixed, required: true },
});

export default models.Layout ||
  mongoose.model<LayoutDocument>("Layout", LayoutSchema);
