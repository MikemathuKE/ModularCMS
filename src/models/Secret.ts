import { Schema, model, models, Types, Connection } from "mongoose";

export interface SecretDoc {
  _id: Types.ObjectId;
  name: string; // e.g. "Stripe API Key"
  slug: string; // e.g. "stripe-api-key"
  value: {
    iv: string;
    content: string;
    tag: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const SecretSchema = new Schema<SecretDoc>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true },
);

export function getOrCreateSecretModel(conn: Connection | any) {
  return conn.models["Secret"] || conn.model("Secret", SecretSchema);
}

export const Secret = models.Secret || model<SecretDoc>("Secret", SecretSchema);
