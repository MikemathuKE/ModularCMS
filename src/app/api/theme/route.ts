import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const result = {};
  return NextResponse.json(result, { status: 200 });
}
