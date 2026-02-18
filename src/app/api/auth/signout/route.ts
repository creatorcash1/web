// ─── Sign Out API Route ──────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Sign out successful" });
  } catch (error: any) {
    console.error("Sign out error:", error);
    return NextResponse.json(
      { error: error.message || "Sign out failed" },
      { status: 500 }
    );
  }
}
