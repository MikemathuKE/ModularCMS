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
    console.log("⏭️ Admin already exists");
    process.exit(0);
  }

  await User.create({ email, password: hash, role: "admin" });
  console.log(`✅ Default admin created: ${email} / ${password}`);
  process.exit(0);
}

seedAdmin();
