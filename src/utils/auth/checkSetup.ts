// utils/auth/checkSetup.ts
import { getTenantConnection } from "@/lib/mongodb";
import { getOrCreateUserModel } from "@/models/User";

export async function checkSetup() {
  const tenantSlug = process.env.DEFAULT_TENANT || "main";
  const tenantConn = await getTenantConnection(tenantSlug); // default tenant
  const User = getOrCreateUserModel(tenantConn);
  const admin = await User.findOne({ role: "superuser" });
  return { adminExists: !!admin };
}
