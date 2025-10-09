import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./lib/session";

export async function middleware(req: NextRequest) {
  const session = await getSession();

  // if (req.nextUrl.pathname.startsWith("/admin")) {
  //   if (!session?.expires || !session?.user_id) {
  //     return NextResponse.redirect(new URL("/login", req.url));
  //   }
  // }

  // console.log(session);
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
