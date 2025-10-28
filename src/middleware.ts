import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { dbConnect } from "@/lib/mongodb";
import { Tenant } from "@/models/Tenant";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const secretKey = new TextEncoder().encode(JWT_SECRET);

async function verifyJWT(token?: string) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch {
    return null;
  }
}

// Helper: Extract subdomain safely
function extractSubdomain(host: string) {
  // Remove port (e.g., "tenant.localhost:3000" → "tenant.localhost")
  const cleanHost = host.split(":")[0];
  const parts = cleanHost.split(".");

  // For localhost or custom domain setup
  if (cleanHost.endsWith("localhost")) {
    return parts.length > 1 ? parts[0] : null; // tenant.localhost
  }

  // For standard domains: tenant.example.com
  if (parts.length > 2) {
    return parts[0]; // tenant
  }

  return null;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/login";

  // 🔒 Protect /admin routes
  if (isAdminRoute) {
    const valid = await verifyJWT(token);
    if (!valid) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 🚫 Redirect logged-in users away from /login
  if (isLoginRoute) {
    const valid = await verifyJWT(token);
    if (valid) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  const hostname = req.headers.get("host") || "";
  const url = req.nextUrl.clone();

  try {
    await dbConnect();

    const subdomain = extractSubdomain(hostname);
    let tenant = null;

    if (subdomain) {
      // Try subdomain-based lookup
      tenant = await Tenant.findOne({ domain: subdomain });
    } else {
      // Try full custom domain lookup (for custom domains)
      tenant = await Tenant.findOne({ domain: hostname });
    }

    if (!tenant) {
      console.warn(`No tenant found for host: ${hostname}`);
      url.pathname = "/register-domain";
      return NextResponse.redirect(url);
    }

    const response = NextResponse.next();
    response.headers.set("x-tenant", "tenant_" + tenant.slug);
    return response;
  } catch (err) {
    console.error("Middleware tenant lookup error:", err);
    url.pathname = "/register-domain";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
  runtime: "nodejs",
};
