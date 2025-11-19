// src/app/api/cms/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect, getTenantConnection } from "@/lib/mongodb";
import { getOrCreateUserModel } from "@/models/User";
import { GetTenantSlug } from "@/utils/getTenantSlug";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  await dbConnect();
  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const User = getOrCreateUserModel(tenantConn);

  const users = await User.find({}, { password: 0 }); // exclude password
  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  const { email, password, role } = await req.json();

  if (!email || !password || !role) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (!["admin", "editor"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  await dbConnect();
  const tenantConn = await getTenantConnection(tenantSlug);
  const User = getOrCreateUserModel(tenantConn);

  const existing = await User.findOne({ email });
  if (existing)
    return NextResponse.json({ error: "User already exists" }, { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashedPassword, role });

  return NextResponse.json({
    user: { _id: user._id, email: user.email, role: user.role },
  });
}

export async function DELETE(req: Request) {
  const { email } = await req.json();
  if (!email)
    return NextResponse.json({ error: "Email required" }, { status: 400 });

  await dbConnect();

  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const User = getOrCreateUserModel(tenantConn);

  if (User.role == "superuser") {
    return Response.json(
      { error: "Superuser cannot be deleted!" },
      { status: 400 }
    );
  }

  await User.deleteOne({ email });
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const { oldPassword, newPassword } = await req.json();
  const email = req.cookies.get("email")?.value;

  if (!email || !oldPassword || !newPassword) {
    console.log(email);
    console.log(oldPassword);
    console.log(newPassword);
    return NextResponse.json(
      { error: "Email, old password, and new password are required" },
      { status: 400 }
    );
  }

  await dbConnect();

  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return NextResponse.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const User = getOrCreateUserModel(tenantConn);

  // Find the user
  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Verify old password
  const validOld = await bcrypt.compare(oldPassword, user.password);
  if (!validOld)
    return NextResponse.json(
      { error: "Old password is incorrect" },
      { status: 401 }
    );

  // Hash new password and update
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return NextResponse.json({ message: "Password updated successfully" });
}
