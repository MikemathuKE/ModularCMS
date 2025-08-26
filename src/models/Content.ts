import mongoose, { Schema } from "mongoose";
import { ContentType } from "./ContentType"; // your existing content type model

export async function getContentModel(typeName: string, fields: any[]) {
  const schemaFields: any = {};

  // map fields to mongoose schema
  fields.forEach((f) => {
    switch (f.type) {
      case "String":
        schemaFields[f.name] = { type: String };
        break;
      case "Number":
        schemaFields[f.name] = { type: Number };
        break;
      case "Boolean":
        schemaFields[f.name] = { type: Boolean };
        break;
      case "Date":
        schemaFields[f.name] = { type: Date };
        break;
      case "Image":
      case "Video":
      case "Audio":
        schemaFields[f.name] = { type: String }; // store media registry ID / URL
        break;
      default:
        schemaFields[f.name] = { type: String };
    }
  });

  // add system fields
  schemaFields.createdAt = { type: Date, default: Date.now };
  schemaFields.updatedAt = { type: Date, default: Date.now };

  const schema = new Schema(schemaFields, { timestamps: true });

  const modelName = `Content_${typeName}`;
  return mongoose.models[modelName] || mongoose.model(modelName, schema);
}
