import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const secretKey = new TextEncoder().encode(JWT_SECRET);

async function verifyJWT(token?: string) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (err) {
    return null;
  }
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
