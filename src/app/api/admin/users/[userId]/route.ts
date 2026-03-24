import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth";
import { createServiceRoleClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "cc@creatorcashcow.com";

async function requireAdmin() {
  const user = await getServerUser();
  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const isAdminByEmail = user.email === ADMIN_EMAIL;
  const isAdminByRole = user.role === "admin";

  if (isAdminByEmail || isAdminByRole) {
    return { user };
  }

  const supabase = await createServiceRoleClient();
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { user };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) {
    return auth.error;
  }

  const { userId } = await params;
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const body = (await request.json()) as { suspended?: boolean };
  if (typeof body.suspended !== "boolean") {
    return NextResponse.json({ error: "suspended must be boolean" }, { status: 400 });
  }

  const supabase = await createServiceRoleClient();
  const { error } = await supabase
    .from("users")
    .update({
      is_suspended: body.suspended,
      is_banned: false,
    })
    .eq("id", userId);

  if (error) {
    console.error("Admin user suspend update error", error);
    return NextResponse.json({ error: "Failed to update user status" }, { status: 500 });
  }

  return NextResponse.json({ success: true, userId, suspended: body.suspended });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) {
    return auth.error;
  }

  const { userId } = await params;
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const supabase = await createServiceRoleClient();

  // Try to remove profile row first; if constrained, fall back to soft-delete flags.
  let deletedProfile = false;
  const deleteProfileResult = await supabase.from("users").delete().eq("id", userId);

  if (deleteProfileResult.error) {
    const fallbackEmail = `deleted-${userId.slice(0, 8)}@creatorcashcow.local`;
    const { error: fallbackError } = await supabase
      .from("users")
      .update({
        full_name: "Deleted User",
        email: fallbackEmail,
        is_suspended: true,
        is_banned: true,
      })
      .eq("id", userId);

    if (fallbackError) {
      console.error("Admin delete user fallback error", fallbackError);
      return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
  } else {
    deletedProfile = true;
  }

  // Delete auth user account if possible.
  const authAdmin = (supabase.auth as any)?.admin;
  if (authAdmin?.deleteUser) {
    const { error: deleteAuthError } = await authAdmin.deleteUser(userId);
    if (deleteAuthError && !String(deleteAuthError.message || "").toLowerCase().includes("not found")) {
      console.error("Admin delete auth user error", deleteAuthError);
    }
  }

  return NextResponse.json({ success: true, userId, deletedProfile });
}
