import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};

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

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Skip internal APIs and Next.js static assets
  if (
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_next") ||
    url.pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  const isAdminRoute = url.pathname.startsWith("/admin");
  const isLoginRoute = url.pathname === "/admin/login";

  if (isLoginRoute) {
    const valid = await verifyJWT(token);
    if (valid) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  if (isAdminRoute && !isLoginRoute) {
    const valid = await verifyJWT(token);
    if (!valid) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Extract subdomain (e.g., tenant.example.com → tenant)
  const host = req.headers.get("host") || "";
  const [subdomain] = host.split(".");

  // Skip main domain
  if (!subdomain || subdomain === "www" || host.includes("localhost")) {
    return NextResponse.next();
  }

  try {
    // IMPORTANT: absolute URL (Edge runtime doesn’t know localhost implicitly)
    const res = await fetch(
      `${req.nextUrl.origin}/api/tenant/lookup?subdomain=${subdomain}`,
      {
        headers: { "x-internal-request": "middleware" },
      }
    );

    if (!res.ok) throw new Error(`Lookup failed: ${res.status}`);

    const tenant = await res.json();

    if (!tenant?.exists) {
      // Redirect to domain registration
      // return NextResponse.redirect(new URL("/admin/register-domain", req.url));
      return NextResponse.next();
    }

    // Attach tenant to request (optional)
    const response = NextResponse.next();
    response.headers.set("x-tenant", tenant.name);
    return response;
  } catch (error) {
    console.error("Tenant lookup error:", error);
    return NextResponse.next(); // fallback gracefully
  }
}
