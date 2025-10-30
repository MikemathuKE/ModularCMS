import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITenant extends Document {
  slug: string; // e.g. "myblog"
  domain?: string; // e.g. "myblog.example.com"
  customDomain?: string; // e.g. "myblog.com"
  createdAt: Date;
  updatedAt: Date;
}

const TenantSchema = new Schema<ITenant>(
  {
    slug: { type: String, required: true, unique: true },
    domain: { type: String, unique: true },
    customDomain: { type: String, unique: true },
  },
  { timestamps: true }
);

// Prevent model recompilation in dev hot reload
export const Tenant: Model<ITenant> =
  mongoose.models.Tenant || mongoose.model<ITenant>("Tenant", TenantSchema);
