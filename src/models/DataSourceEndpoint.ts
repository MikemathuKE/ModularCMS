// models/DataSourceEndpoint.ts
import mongoose, { Schema, Document, Types, Connection } from "mongoose";

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

export interface IDataSourceEndpoint extends Document {
  name: string;
  dataSource: Types.ObjectId;
  path: string; // path relative to baseUrl
  method: HttpMethod;
  headers?: Record<string, string>;
  contentType?: Types.ObjectId; // ← VERY IMPORTANT
  queryParams?: Record<string, any>;
  bodyTemplate?: any;
  createdAt: Date;
  updatedAt: Date;
}

const DataSourceEndpointSchema = new Schema<IDataSourceEndpoint>(
  {
    name: { type: String, required: true },
    dataSource: {
      type: Schema.Types.ObjectId,
      ref: "DataSource",
      required: true,
    },
    path: { type: String, required: true },
    method: {
      type: String,
      enum: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
      default: "GET",
    },
    contentType: { type: String },
    headers: { type: Schema.Types.Mixed, default: {} },
    queryParams: { type: Schema.Types.Mixed, default: {} },
    bodyTemplate: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export function getOrCreateDataSourceEndpointsModel(conn: Connection | any) {
  if (!conn || !conn.models) {
    throw new Error("Invalid mongoose connection passed to DataSourceEndpoint");
  }
  return (
    conn.models["IDataSourceEndpoint"] ||
    conn.model("IDataSourceEndpoint", DataSourceEndpointSchema)
  );
}

// const DataSourceEndpoint =
//   mongoose.models.DataSourceEndpoint ||
//   mongoose.model("DataSourceEndpoint", DataSourceEndpointSchema);
