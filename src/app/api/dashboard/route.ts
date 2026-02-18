// ─── Dashboard API Route ─────────────────────────────────────────────────────
// Returns dashboard data for authenticated user from Supabase
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { fetchDashboardData } from "@/lib/database";
import { getServerUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    // Get authenticated user
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get userId from query params (validate it matches authenticated user)
    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get("userId");

    if (requestedUserId && requestedUserId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch dashboard data
    const data = await fetchDashboardData(user.id);
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
