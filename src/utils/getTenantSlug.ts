import { dbConnect } from "@/lib/mongodb";
import { Tenant } from "@/models/Tenant";

export async function GetTenantSlug(host: string | null) {
  if (!host) return null;
  await dbConnect();

  const tenant = await Tenant.findOne({ domain: host });

  if (!tenant) return null;

  return tenant.slug;
}
