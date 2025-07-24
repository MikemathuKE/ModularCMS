import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const result = {
    componentStyles: {
      Button: {
        backgroundColor: "#222",
        color: "#f0f0f0",
        padding: "12px 24px",
        borderRadius: "6px",
        border: "1px solid #555",
      },
    },
  };
  return NextResponse.json(result, { status: 200 });
}
