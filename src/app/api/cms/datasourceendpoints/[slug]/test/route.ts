import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { getOrCreateDataSourceEndpointsModel } from "@/models/DataSourceEndpoint";
import { getTenantConnection } from "@/lib/mongodb";
import { GetTenantSlug } from "@/utils/getTenantSlug";
import { resolveSecret } from "@/utils/resolveSecret";
import { decrypt } from "@/lib/crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    await dbConnect();
    const tenantSlug = await GetTenantSlug(req.headers.get("host"));
    if (!tenantSlug)
      return Response.json({ error: "Tenant missing" }, { status: 400 });

    const tenantConn = await getTenantConnection(tenantSlug);
    const DataSourceEndpoint = getOrCreateDataSourceEndpointsModel(tenantConn);

    const endpoint = await DataSourceEndpoint.findOne({ slug })
      .populate("dataSource")
      .populate("bodyTemplate");

    if (!endpoint)
      return NextResponse.json(
        { error: "Endpoint not found" },
        { status: 404 },
      );

    const ds: any = endpoint.dataSource;

    if (!ds)
      return NextResponse.json(
        { error: "DataSource missing" },
        { status: 400 },
      );

    // 🌐 Build URL
    const url = new URL(ds.baseUrl + endpoint.path);

    // ➕ Query params
    if (endpoint.queryParams) {
      Object.entries(endpoint.queryParams).forEach(([k, v]) => {
        if (v !== undefined && v !== null)
          url.searchParams.append(k, String(v));
      });
    }

    // 📦 Merge headers
    const headers: Record<string, string> = {
      ...(ds.defaultHeaders || {}),
      ...(endpoint.headers || {}),
    };

    // 📛 Content type override
    if (endpoint.contentType) {
      headers["Content-Type"] = endpoint.contentType;
    }

    // 🔐 AUTH HANDLING
    if (ds.auth && ds.auth.type !== "none") {
      const auth = ds.auth;

      if (auth.type === "apiKey") {
        const key = await resolveSecret(auth.secretRef, req);

        if (key) {
          if (auth.apiKeyIn === "header") {
            headers[auth.apiKeyName || "x-api-key"] = decrypt(key);
          } else if (auth.apiKeyIn === "query") {
            url.searchParams.append(auth.apiKeyName || "api_key", decrypt(key));
          }
        }
      }

      if (auth.type === "bearer") {
        const token = await resolveSecret(auth.secretRef, req);
        if (token) headers["Authorization"] = `Bearer ${decrypt(token)}`;
      }

      if (auth.type === "basic") {
        const user = await resolveSecret(auth.usernameRef, req);
        const pass = await resolveSecret(auth.passwordRef, req);

        if (user && pass) {
          const encoded = Buffer.from(`${user}:${decrypt(pass)}`).toString(
            "base64",
          );

          headers["Authorization"] = `Basic ${encoded}`;
        }
      }

      // oauth2 later (token refresh etc)
    }

    // 📤 Build body
    let body: any = undefined;

    if (endpoint.bodyTemplate && !["GET", "HEAD"].includes(endpoint.method)) {
      if (headers["Content-Type"]?.includes("application/json")) {
        body = JSON.stringify(endpoint.bodyTemplate);
      } else if (
        headers["Content-Type"]?.includes("application/x-www-form-urlencoded")
      ) {
        body = new URLSearchParams(endpoint.bodyTemplate).toString();
      } else {
        body = endpoint.bodyTemplate;
      }
    }

    // ⏱ Execute request
    const start = Date.now();

    const response = await fetch(url.toString(), {
      method: endpoint.method,
      headers,
      body,
    });

    const durationMs = Date.now() - start;

    const rawText = await response.text();

    let parsedBody: any = rawText;
    try {
      parsedBody = JSON.parse(rawText);
    } catch {}

    const resHeaders: Record<string, string> = {};
    response.headers.forEach((v, k) => (resHeaders[k] = v));

    // ✅ Return normalized result
    return NextResponse.json({
      status: response.status,
      durationMs,
      headers: resHeaders,
      body: parsedBody,
      ok: response.ok,
      url: url.toString(),
      method: endpoint.method,
    });
  } catch (err: any) {
    console.error("Execution failed:", err);

    return NextResponse.json(
      {
        error: "Execution failed",
        message: err.message,
      },
      { status: 500 },
    );
  }
}
