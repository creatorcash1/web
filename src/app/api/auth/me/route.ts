// ─── Current User API Route ──────────────────────────────────────────────────
// Returns currently authenticated user with profile data
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { getServerUser, getUserProfile } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getServerUser();
    
    if (!user) {
      return NextResponse.json({ user: null });
    }

    const profile = await getUserProfile(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        ...profile,
      },
    });
  } catch (error: any) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get user" },
      { status: 500 }
    );
  }
}
