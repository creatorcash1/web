// ─── Sign In API Route ───────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";

async function ensureAdminUserReady(email: string, password: string) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY for admin bootstrap");
  }

  const serviceRoleClient = createServiceRoleClient();
  let adminUserId: string | null = null;

  const { data: existingProfile } = await serviceRoleClient
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingProfile?.id) {
    adminUserId = existingProfile.id;
    const { error: updateError } = await serviceRoleClient.auth.admin.updateUserById(existingProfile.id, {
      password,
      email_confirm: true,
    });

    if (updateError) throw updateError;
  } else {
    const { data: createdUser, error: createError } = await serviceRoleClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: "Admin User",
      },
    });

    if (
      createError &&
      !/already registered|already exists/i.test(createError.message)
    ) {
      throw createError;
    }

    adminUserId = createdUser?.user?.id ?? null;

    if (!adminUserId) {
      const { data: listedUsers, error: listError } = await serviceRoleClient.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });

      if (listError) throw listError;

      const matchedUser = listedUsers.users.find(
        (user) => user.email?.toLowerCase() === email.toLowerCase()
      );
      adminUserId = matchedUser?.id ?? null;

      if (adminUserId) {
        const { error: updateExistingError } = await serviceRoleClient.auth.admin.updateUserById(adminUserId, {
          password,
          email_confirm: true,
        });

        if (updateExistingError) throw updateExistingError;
      }
    }
  }

  if (adminUserId) {
    const { error: upsertError } = await serviceRoleClient.from("users").upsert(
      {
        id: adminUserId,
        email,
        full_name: "Admin User",
        role: "admin",
      },
      { onConflict: "id" }
    );

    if (upsertError) throw upsertError;
  }
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedPassword = String(password);

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (
      adminEmail &&
      adminPassword &&
      normalizedEmail === adminEmail &&
      normalizedPassword === adminPassword
    ) {
      await ensureAdminUserReady(normalizedEmail, normalizedPassword);
    }

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: normalizedPassword,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({
      message: "Sign in successful",
      user: data.user,
      session: data.session,
    });
  } catch (error: any) {
    console.error("Sign in error:", error);
    return NextResponse.json(
      { error: error.message || "Sign in failed" },
      { status: 500 }
    );
  }
}
