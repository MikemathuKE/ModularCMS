// src/app/api/register-domain/route.ts
import { NextResponse } from "next/server";
import { dbConnect, getTenantConnection } from "@/lib/mongodb";
import { Tenant } from "@/models/Tenant";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { defaultTheme } from "@/theme/DefaultTheme";

// Models for initializing tenant DB
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: { type: String, default: "admin" },
});

const ThemeSchema = new mongoose.Schema({
  name: String,
  settings: Object,
});

const LayoutSchema = new mongoose.Schema({
  name: String,
  structure: Object,
});

export async function POST(req: Request) {
  try {
    const { slug, domain, adminEmail, adminPassword } = await req.json();

    if (!domain || !adminEmail || !adminPassword)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );

    await dbConnect();

    // Check if domain already exists
    const existing = await Tenant.findOne({ domain });
    if (existing) {
      return NextResponse.json(
        { error: "Domain already registered" },
        { status: 400 }
      );
    }

    // Create tenant metadata
    const dbName = slug.replace(/\./g, "_");
    const tenant = await Tenant.create({ slug, domain, dbName });

    // Connect to tenant DB
    const tenantConn = await getTenantConnection(slug);

    // Create models in tenant DB
    const User = tenantConn.model("User", UserSchema);
    const Theme = tenantConn.model("Theme", ThemeSchema);
    const Layout = tenantConn.model("Layout", LayoutSchema);

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await User.create({
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    // Initialize defaults
    await Theme.create({
      name: "Default Theme",
      slug: "default",
      json: defaultTheme,
      active: true,
      layout: "default",
    });

    await Layout.create({
      name: "default",
      structure: {
        topbar: {
          component: "",
          children: [],
        },
        sidebar: null,
        sections: null,
      },
    });

    return NextResponse.json({ success: true, domain: tenant.domain });
  } catch (error: any) {
    console.error("Error registering domain:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
