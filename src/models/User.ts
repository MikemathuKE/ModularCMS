import { Schema, Document, model, models } from "mongoose";

export interface UserDocument extends Document {
  email: string;
  password: string;
  role: "admin" | "editor" | "viewer";
  createdAt: Date;
}

export const UserSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed
    role: {
      type: String,
      enum: ["admin", "editor", "viewer"],
      default: "viewer",
    },
  },
  { timestamps: true }
);

export function getOrCreateUserModel(conn: Connection | any) {
  return conn.models["User"] || conn.model("User", UserSchema);
}

const User = models.User || model("User", UserSchema);
export default User;
