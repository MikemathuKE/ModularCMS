import { dbConnect } from "@/lib/mongodb";
import { Tenant } from "@/models/Tenant";

export async function GET(req: Request) {
  const { host } = await req.json();

  await dbConnect();

  const baseDomain = process.env.BASE_DOMAIN || "example.com";
  const subdomain = host.endsWith(baseDomain)
    ? host.replace(`.${baseDomain}`, "")
    : host;

  const tenant =
    (await Tenant.findOne({ domain: subdomain })) ||
    (await Tenant.findOne({ customDomain: host }));

  if (!tenant) return Response.json({ exists: false });

  return Response.json({ exists: true, slug: tenant.slug });
}
