// models/Theme.ts
import mongoose, { Schema, model, models } from "mongoose";

const ThemeSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    json: { type: Object, required: true },
    active: { type: Boolean, default: false }, // <--- add this
    layout: { type: String, required: true, default: "default" },
  },
  { timestamps: true }
);

export const Theme = models.Theme || model("Theme", ThemeSchema);
export type ThemeDoc = mongoose.InferSchemaType<typeof ThemeSchema>;
