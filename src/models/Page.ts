import mongoose, { Schema, Document, Model, Connection } from "mongoose";

export interface IPage extends Document {
  name: string;
  slug: string;
  layout: string;
  json: Record<string, any>;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

export const PageSchema = new Schema<IPage>(
  {
    name: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    layout: { type: String, required: true, default: "default" },
    json: { type: Object, default: { component: "", children: [] } },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
  },
  { timestamps: true }
);

// Ensure indexes exist in Mongo
PageSchema.index({ name: "text", slug: "text" }); // allows text search on both

export function getOrCreatePageModel(conn: Connection | any) {
  return conn.models["Page"] || conn.model("Page", PageSchema);
}

export const Page: Model<IPage> =
  mongoose.models.Page || mongoose.model<IPage>("Page", PageSchema);
