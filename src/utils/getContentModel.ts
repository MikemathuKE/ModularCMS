import { Schema, model, models, Model } from "mongoose";
import { ContentTypeDoc } from "@/models/ContentType";

/**
 * Create a dynamic schema for the content type fields.
 * Each content type gets collection: content_<slug>
 */
export function getContentModel(ct: ContentTypeDoc): Model<any> {
  const modelName = `Content_${ct.slug}`; // Mongoose model cache key
  const collection = `content_${ct.slug}`; // Mongo collection name

  if (models[modelName]) return models[modelName];

  const schemaShape: Record<string, any> = {};
  for (const f of ct.fields) {
    let fieldType: any = Schema.Types.Mixed;
    if (f.type === "string") fieldType = String;
    if (f.type === "number") fieldType = Number;
    if (f.type === "boolean") fieldType = Boolean;
    if (f.type === "date") fieldType = Date;
    // "json" -> Mixed

    schemaShape[f.name] = { type: fieldType };
    if (f.required) schemaShape[f.name].required = true;
  }

  // Common fields (status, timestamps, etc.)
  schemaShape.published = { type: Boolean, default: false };
  schemaShape.slug = { type: String, index: true };

  const dynamicSchema = new Schema(schemaShape, { timestamps: true });
  return model(modelName, dynamicSchema, collection);
}
