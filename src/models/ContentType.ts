import { Schema, model, models, Types } from "mongoose";

/**
 * Content Types define a schema (field model) and meta.
 * We'll generate a collection per content type using a dynamic model.
 */
export interface ContentTypeDoc {
  _id: Types.ObjectId;
  name: string; // e.g., "Blog Post"
  slug: string; // e.g., "blogPost" -> collection: content_blogPost
  fields: Array<{
    name: string; // "title", "body", "image"
    type: "string" | "number" | "boolean" | "date" | "json";
    required?: boolean;
    // (Optional) validation bits you may add later
  }>;
  updatedAt: Date;
  createdAt: Date;
}

const ContentTypeSchema = new Schema<ContentTypeDoc>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    fields: [
      {
        name: { type: String, required: true },
        type: {
          type: String,
          enum: ["string", "number", "boolean", "date", "json"],
          required: true,
        },
        required: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

export const ContentType =
  models.ContentType || model<ContentTypeDoc>("ContentType", ContentTypeSchema);
