import { Schema, Document, model, models, Connection } from "mongoose";

export interface UserDocument extends Document {
  email: string;
  password: string;
  role: "admin" | "editor" | "superuser";
  createdAt: Date;
}

export const UserSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed
    role: {
      type: String,
      enum: ["admin", "editor", "superuser"],
      default: "editor",
    },
  },
  { timestamps: true }
);

export function getOrCreateUserModel(conn: Connection | any) {
  return conn.models["User"] || conn.model("User", UserSchema);
}

const User = models.User || model("User", UserSchema);
export default User;
