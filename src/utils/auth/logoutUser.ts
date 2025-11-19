// utils/auth/logoutUser.ts
import { NextResponse } from "next/server";

export async function logoutUser() {
  // Middleware cannot modify cookies directly,
  // but we can clear them by returning a response and merging headers.
  const res = NextResponse.json({ message: "Logged out" });
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
  res.cookies.set("email", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
  res.cookies.set("role", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
  return res;
}
