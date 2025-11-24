import "dotenv/config";
import bcrypt from "bcryptjs";
import { dbConnect } from "../lib/mongodb";
import User from "../models/User";

export async function seedAdmin() {
  await dbConnect();

  const email = "info@mikemathuke.com";
  const password = "admin123";
  const hash = await bcrypt.hash(password, 10);

  const existing = await User.findOne({ email });
  if (existing) {
    process.exit(0);
  }

  await User.create({ email, password: hash, role: "admin" });
  process.exit(0);
}

seedAdmin();
