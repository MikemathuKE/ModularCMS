// src/utils/resolveDataSourceAuth.ts
import { DataSourceAuth } from "@/models/DataSource";
import { resolveSecret } from "@/utils/resolveSecret";

export async function resolveDataSourceAuth(
  auth: DataSourceAuth | undefined,
  req: Request
): Promise<{ headers: Record<string, string>; query: Record<string, string> }> {
  const headers: Record<string, string> = {};
  const query: Record<string, string> = {};

  if (!auth || auth.type === "none") {
    return { headers, query };
  }

  switch (auth.type) {
    case "apiKey": {
      const apiKey = await resolveSecret(auth.secretRef, req);
      if (!apiKey) throw new Error("API key secret missing");

      if (auth.apiKeyIn === "header") {
        headers[auth.apiKeyName || "x-api-key"] = apiKey;
      } else {
        query[auth.apiKeyName || "api_key"] = apiKey;
      }
      break;
    }

    case "bearer": {
      const token = await resolveSecret(auth.secretRef, req);
      if (!token) throw new Error("Bearer token missing");
      headers["Authorization"] = `Bearer ${token}`;
      break;
    }

    case "basic": {
      const username = await resolveSecret(auth.usernameRef, req);
      const password = await resolveSecret(auth.passwordRef, req);
      if (!username || !password)
        throw new Error("Basic auth credentials missing");

      const encoded = Buffer.from(`${username}:${password}`).toString("base64");
      headers["Authorization"] = `Basic ${encoded}`;
      break;
    }

    case "oauth2":
      throw new Error("OAuth2 not implemented yet");

    default:
      throw new Error(`Unsupported auth type: ${auth.type}`);
  }

  return { headers, query };
}
