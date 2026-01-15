// -----------------------------------------------------
// src/models/DataSourceExecutionLog.ts
// -----------------------------------------------------
import { Schema, Types } from "mongoose";

export interface DataSourceExecutionLogDoc {
  _id: Types.ObjectId;
  dataSourceSlug: string;
  endpointSlug: string;
  status: number;
  durationMs: number;
  success: boolean;
  error?: string;
  executedAt: Date;
}

export const DataSourceExecutionLogSchema =
  new Schema<DataSourceExecutionLogDoc>(
    {
      dataSourceSlug: { type: String, index: true },
      endpointSlug: { type: String, index: true },
      status: Number,
      durationMs: Number,
      success: Boolean,
      error: String,
      executedAt: { type: Date, default: Date.now },
    },
    { timestamps: false }
  );

export function getOrCreateExecutionLogModel(conn: Connection | any) {
  return (
    conn.models["DataSourceExecutionLog"] ||
    conn.model("DataSourceExecutionLog", DataSourceExecutionLogSchema)
  );
}
