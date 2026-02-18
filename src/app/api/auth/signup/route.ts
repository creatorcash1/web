// ─── Auth API Routes ─────────────────────────────────────────────────────────
// Sign up, sign in, sign out endpoints
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || email.split("@")[0],
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: "Sign up successful! Please check your email to verify your account.",
      user: data.user,
    });
  } catch (error: any) {
    console.error("Sign up error:", error);
    return NextResponse.json(
      { error: error.message || "Sign up failed" },
      { status: 500 }
    );
  }
}
