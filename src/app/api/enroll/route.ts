import { NextResponse } from "next/server";

interface Body {
  userId?: string;
  productId?: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as Body;

  if (!body.userId || !body.productId) {
    return NextResponse.json({ error: "userId and productId are required" }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    userId: body.userId,
    productId: body.productId,
    enrolledAt: new Date().toISOString(),
  });
}
