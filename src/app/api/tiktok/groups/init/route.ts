import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getServerUser } from "@/lib/auth";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "cc@creatorcashcow.com";
const MAX_GROUPS = 50;
const MEMBERS_PER_GROUP = 250;

/**
 * POST /api/tiktok/groups/init
 * Initialize 50 TikTok groups if not already created
 */
export async function POST() {
  try {
    // Check admin auth
    const authUser = await getServerUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = authUser.email === ADMIN_EMAIL;
    if (!isAdmin) {
      const supabase = await createServiceRoleClient();
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", authUser.id)
        .maybeSingle();

      if (profile?.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const supabase = await createServiceRoleClient();

    // Check how many groups exist
    const { count } = await supabase
      .from("tiktok_groups")
      .select("*", { count: "exact", head: true });

    const existingCount = count || 0;

    if (existingCount >= MAX_GROUPS) {
      return NextResponse.json({
        message: `All ${MAX_GROUPS} groups already exist`,
        created: 0,
        total: existingCount,
      });
    }

    // Create missing groups
    const groupsToCreate = [];
    for (let i = existingCount + 1; i <= MAX_GROUPS; i++) {
      groupsToCreate.push({
        name: `TikTok Group ${i}`,
        order_index: i,
        max_members: MEMBERS_PER_GROUP,
        invite_url: null,
      });
    }

    const { data: created, error } = await supabase
      .from("tiktok_groups")
      .insert(groupsToCreate)
      .select();

    if (error) {
      console.error("Error creating groups:", error);
      return NextResponse.json({ error: "Failed to create groups" }, { status: 500 });
    }

    return NextResponse.json({
      message: `Created ${created.length} new groups`,
      created: created.length,
      total: existingCount + created.length,
    });
  } catch (error: any) {
    console.error("Init groups error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initialize groups" },
      { status: 500 }
    );
  }
}
