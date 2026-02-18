import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();

  if (!payload?.event) {
    return NextResponse.json({ error: "event is required" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    receivedAt: new Date().toISOString(),
  });
}
