import { Schema, Types, Connection } from "mongoose";

export interface DataSourceAuth {
  type: "none" | "apiKey" | "bearer" | "basic" | "oauth2";
  apiKeyName?: string;
  apiKeyIn?: "header" | "query";
  secretRef?: string; // <-- Secret.slug
  usernameRef?: string; // optional secret
  passwordRef?: string; // optional secret
}

export interface DataSourceDoc extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  auth?: DataSourceAuth;
  createdAt: Date;
  updatedAt: Date;
}

const DataSourceAuthSchema = new Schema<DataSourceAuth>(
  {
    type: {
      type: String,
      enum: ["none", "apiKey", "bearer", "basic", "oauth2"],
      default: "none",
    },
    apiKeyName: String,
    apiKeyIn: { type: String, enum: ["header", "query"] },
    secretRef: String,
    usernameRef: String,
    passwordRef: String,
  },
  { _id: false }
);

export const DataSourceSchema = new Schema<DataSourceDoc>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    baseUrl: { type: String, required: true },
    defaultHeaders: { type: Schema.Types.Mixed, default: {} },
    auth: { type: DataSourceAuthSchema, default: { type: "none" } },
  },
  { timestamps: true }
);

export function getOrCreateDataSourceModel(conn: Connection | any) {
  if (!conn || !conn.models) {
    throw new Error("Invalid Mongoose connection passed to DataSource!");
  }
  return (
    conn.models["DataSource"] || conn.model("DataSource", DataSourceSchema)
  );
}

// const DataSource =
//   models.DataSource || model<DataSourceDoc>("DataSource", DataSourceSchema);
