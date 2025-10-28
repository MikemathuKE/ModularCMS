import { dbConnect, getTenantConnection } from "@/lib/mongodb";
import { Tenant } from "@/models/Tenant";
import UserSchema from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { subdomain, email, password, customDomain } = await req.json();

  await dbConnect();

  const existing = await Tenant.findOne({
    $or: [{ slug: subdomain }, { customDomain }],
  });

  if (existing)
    return Response.json({ error: "Tenant already exists" }, { status: 400 });

  // Create Tenant entry in central DB
  const tenant = await Tenant.create({
    slug: subdomain,
    domain: `${subdomain}.${process.env.BASE_DOMAIN}`,
    customDomain,
  });

  // Initialize tenant-specific DB
  const tenantConn = await getTenantConnection(subdomain);
  const User = tenantConn.model("User", UserSchema);

  const hashed = await bcrypt.hash(password, 10);
  await User.create({
    email,
    password: hashed,
    role: "admin",
  });

  await tenantConn.collection("settings").insertOne({
    theme: "default",
    layout: "default",
  });

  return Response.json({
    message: "Tenant created successfully",
    slug: tenant.slug,
  });
}
