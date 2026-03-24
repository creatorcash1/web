import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getServerUser } from "@/lib/auth";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "cc@creatorcashcow.com";
const MAX_GROUPS = 50;
const MEMBERS_PER_GROUP = 250;

// Creative 3-word group names (no numbers)
const GROUP_NAMES = [
  "TikTok Scale Room",
  "Build on TikTok",
  "Creator Growth Hub",
  "Viral Content Lab",
  "Content Creator Collective",
  "TikTok Monetize Masters",
  "Cash Flow Creators",
  "Digital Empire Builders",
  "Creator Success Circle",
  "TikTok Hustle House",
  "Revenue Stream Room",
  "Content Money Machine",
  "Creator Wealth Academy",
  "TikTok Business Builders",
  "Influence Income Insiders",
  "Brand Deal Bosses",
  "Creator Cash Collective",
  "TikTok Profit Pros",
  "Digital Creator Dynasty",
  "Monetization Master Class",
  "TikTok Wealth Warriors",
  "Content Creator Kings",
  "Revenue Generation Room",
  "Creator Economy Club",
  "TikTok Growth Gang",
  "Cash Cow Creators",
  "Digital Success Squad",
  "Creator Profit Playbook",
  "TikTok Money Makers",
  "Influence Income Academy",
  "Brand Builder Bosses",
  "Creator Scale Society",
  "TikTok Revenue Room",
  "Digital Wealth Warriors",
  "Content Monetize Masters",
  "Creator Cash Academy",
  "TikTok Empire Builders",
  "Revenue Creator Room",
  "Digital Creator Collective",
  "Monetization Success Squad",
  "TikTok Profit Playbook",
  "Creator Wealth Warriors",
  "Cash Flow Academy",
  "TikTok Scale Society",
  "Digital Money Makers",
  "Creator Growth Gang",
  "TikTok Cash Collective",
  "Revenue Master Class",
  "Digital Profit Pros",
  "Creator Income Insiders",
];

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

    // Create missing groups with creative names
    const groupsToCreate = [];
    for (let i = existingCount; i < MAX_GROUPS; i++) {
      const orderIndex = i + 1;
      groupsToCreate.push({
        name: GROUP_NAMES[i] || `Creator Room ${orderIndex}`,
        order_index: orderIndex,
        max_members: MEMBERS_PER_GROUP,
        // Set first group's invite URL
        invite_url: i === 0 ? "https://chat.whatsapp.com/Ijb4BK6cS2V49AjBEtivwW?mode=gi_t" : null,
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
