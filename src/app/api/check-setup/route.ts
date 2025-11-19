// src/app/api/check-setup/route.ts
import { NextResponse } from "next/server";
import { getTenantConnection } from "@/lib/mongodb";
import { getOrCreateUserModel } from "@/models/User";

// src/app/api/register-domain/route.ts

const tenantSlug = process.env.DEFAULT_TENANT || "main";
export async function GET(req: Request) {
  try {
    const tenantConn = await getTenantConnection(tenantSlug); // default tenant
    const User = getOrCreateUserModel(tenantConn);
    const admin = await User.findOne({ role: "superuser" });
    return NextResponse.json({ adminExists: !!admin });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ adminExists: false });
  }
}
