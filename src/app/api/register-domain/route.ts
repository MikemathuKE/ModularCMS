// src/app/api/register-domain/route.ts
import { NextResponse } from "next/server";
import { dbConnect, getTenantConnection } from "@/lib/mongodb";
import { Tenant } from "@/models/Tenant";
import bcrypt from "bcryptjs";
import { defaultTheme } from "@/theme/DefaultTheme";
import { getOrCreateLayoutModel } from "@/models/Layout";
import { getOrCreateThemeModel } from "@/models/Theme";
import { getOrCreatePageModel } from "@/models/Page";
import { getOrCreateUserModel } from "@/models/User";

export async function POST(req: Request) {
  const main_slug = process.env.DEFAULT_TENANT || "main";
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
    const tenant = await Tenant.create({
      slug,
      domain,
      dbName,
      customDomain: domain,
    });

    // Connect to tenant DB
    const tenantConn = await getTenantConnection(slug);

    // Create models in tenant DB
    const User = getOrCreateUserModel(tenantConn);
    const Theme = getOrCreateThemeModel(tenantConn);
    const Layout = getOrCreateLayoutModel(tenantConn);
    const Pages = getOrCreatePageModel(tenantConn);

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await User.create({
      email: adminEmail,
      password: hashedPassword,
      role: slug == main_slug ? "superuser" : "admin",
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
      config: {
        topbar: {
          component: "",
          children: [],
        },
        sidebar: null,
        sections: null,
      },
    });

    await Pages.create({
      name: "home",
      slug: "home",
    });

    return NextResponse.json({ success: true, domain: tenant.domain });
  } catch (error: unknown) {
    console.error("Error registering domain:", error);
    if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
