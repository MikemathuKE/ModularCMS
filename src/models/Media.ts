import mongoose, { Schema, Document } from "mongoose";

export interface MediaDocument extends Document {
  filename: string;
  url: string;
  type: "image" | "video" | "audio";
  width?: number;
  height?: number;
  duration?: number;
  createdAt: Date;
}

const MediaSchema = new Schema<MediaDocument>(
  {
    filename: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, enum: ["image", "video", "audio"], required: true },
    width: Number,
    height: Number,
    duration: Number,
  },
  { timestamps: true }
);

export const Media =
  mongoose.models.Media || mongoose.model<MediaDocument>("Media", MediaSchema);
