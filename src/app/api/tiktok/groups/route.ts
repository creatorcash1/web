import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const user = await getServerUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = await createServerSupabaseClient();
  const { data: groups, error } = await supabase
    .from("tiktok_groups")
    .select("id, name, order_index, max_members, invite_url")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Fetch groups error", error);
    return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 });
  }

  const { data: counts } = await supabase
    .from("tiktok_group_members")
    .select("group_id");

  const countMap = new Map<string, number>();
  (counts || []).forEach((c: any) => {
    countMap.set(c.group_id, (countMap.get(c.group_id) || 0) + 1);
  });

  const withCounts = (groups || []).map((g: any) => ({
    ...g,
    member_count: countMap.get(g.id) || 0,
  }));

  return NextResponse.json({ groups: withCounts });
}

export async function PATCH(request: Request) {
  const user = await getServerUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as { groupId?: string; inviteUrl?: string };
  const groupId = body.groupId;

  if (!groupId) {
    return NextResponse.json({ error: "groupId is required" }, { status: 400 });
  }

  const inviteUrl = body.inviteUrl?.trim() ?? null;

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("tiktok_groups")
    .update({ invite_url: inviteUrl })
    .eq("id", groupId);

  if (error) {
    console.error("Update group invite URL error", error);
    return NextResponse.json({ error: "Failed to update invite URL" }, { status: 500 });
  }

  return NextResponse.json({ success: true, groupId, inviteUrl });
}
