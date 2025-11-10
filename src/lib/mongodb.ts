import mongoose from "mongoose";
import { Tenant } from "@/models/Tenant";
import { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("MONGODB_URI not set");

declare global {
  var __mongooseConn__: Promise<typeof mongoose> | undefined;
  var __tenantConnections__: Record<string, Connection> | undefined;
}

export async function dbConnect() {
  if (!global.__mongooseConn__) {
    global.__mongooseConn__ = mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB,
    });
  }
  return global.__mongooseConn__;
}

/**
 * Dynamically connect to a tenant-specific database
 */
export async function getTenantConnection(
  tenantSlug: string
): Promise<Connection> {
  if (!tenantSlug) throw new Error("Tenant slug required");

  if (!global.__tenantConnections__) global.__tenantConnections__ = {};

  if (!global.__tenantConnections__[tenantSlug]) {
    const tenantDbName = `tenant_${tenantSlug}`;
    const connection = await mongoose
      .createConnection(MONGODB_URI, { dbName: tenantDbName })
      .asPromise();

    global.__tenantConnections__[tenantSlug] = connection;
  }

  return global.__tenantConnections__[tenantSlug];
}

export async function getTenantByDomain(hostname: string) {
  await dbConnect();

  const baseDomain = process.env.BASE_DOMAIN || "example.com";
  const subdomain = hostname.endsWith(baseDomain)
    ? hostname.replace(`.${baseDomain}`, "")
    : hostname;

  const tenant =
    (await Tenant.findOne({ domain: subdomain })) ||
    (await Tenant.findOne({ customDomain: hostname }));

  return tenant;
}
