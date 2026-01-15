import { Schema, model, models, Types, Connection } from "mongoose";

export type PrimitiveFieldType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "image"
  | "video"
  | "audio";

export interface ContentTypeFieldBase {
  name: string; // field key
  label?: string; // UI label
  required?: boolean;
}

/** Primitive leaf field */
export interface PrimitiveField extends ContentTypeFieldBase {
  kind: "primitive";
  type: PrimitiveFieldType;
}

/** Nested object */
export interface ObjectField extends ContentTypeFieldBase {
  kind: "object";
  fields: ContentTypeField[]; // recursive
}

/** List / array */
export interface ListField extends ContentTypeFieldBase {
  kind: "list";
  of: ContentTypeField; // schema of items
}

export type ContentTypeField = PrimitiveField | ObjectField | ListField;

/**
 * Content Types define a schema (field model) and meta.
 * We'll generate a collection per content type using a dynamic model.
 */
export interface ContentTypeDoc {
  _id: Types.ObjectId;
  name: string; // e.g., "Blog Post"
  slug: string; // e.g., "blogPost" -> collection: content_blogPost
  fields: Array<ContentTypeField>;
  updatedAt: Date;
  createdAt: Date;
}

export const ContentTypeSchema = new Schema<ContentTypeDoc>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    fields: {
      type: [Schema.Types.Mixed],
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

export function getOrCreateContentTypeModel(conn: Connection | any) {
  return (
    conn.models["ContentType"] || conn.model("ContentType", ContentTypeSchema)
  );
}

export const ContentType =
  models.ContentType || model<ContentTypeDoc>("ContentType", ContentTypeSchema);
