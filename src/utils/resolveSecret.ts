// src/utils/resolveSecret.ts
import { getTenantConnection } from "@/lib/mongodb";
import { GetTenantSlug } from "@/utils/getTenantSlug";
import { getOrCreateSecretModel } from "@/models/Secret";

interface SecretValue {
  iv: string;
  content: string;
  tag: string;
}

/**
 * Resolves a secret reference (slug) into its actual value
 */
export async function resolveSecret(
  secretRef?: string,
  req?: Request,
): Promise<SecretValue | undefined> {
  if (!secretRef) return undefined;

  if (!req) {
    throw new Error("Request context required to resolve secrets");
  }

  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug) throw new Error("Tenant missing");

  const tenantConn = await getTenantConnection(tenantSlug);
  const Secret = getOrCreateSecretModel(tenantConn);

  const secret = await Secret.findOne({ slug: secretRef });
  if (!secret) throw new Error(`Secret not found: ${secretRef}`);

  return secret.value;
}
