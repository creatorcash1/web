import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function pickDailyMembers(members: any[], dailyCount = 25) {
  if (!members.length) return [];
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const start = (dayIndex * dailyCount) % members.length;
  const result: any[] = [];
  for (let i = 0; i < dailyCount && i < members.length; i++) {
    result.push(members[(start + i) % members.length]);
  }
  return result;
}

export async function POST(request: Request) {
  const user = await getServerUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { groupId } = await request.json();
  if (!groupId) {
    return NextResponse.json({ error: "groupId is required" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();

  const { data: members, error } = await supabase
    .from("tiktok_group_members")
    .select("position, request_id, users:user_id(full_name, email), tiktok_requests!inner(id, phone, first_name)")
    .eq("group_id", groupId)
    .order("position", { ascending: true });

  if (error) {
    console.error("Schedule fetch members error", error);
    return NextResponse.json({ error: "Failed to load members" }, { status: 500 });
  }

  const todays = pickDailyMembers(members || [], 25).map((m) => ({
    position: m.position,
    name: m.users?.full_name ?? m.tiktok_requests?.first_name ?? "Member",
    phone: m.tiktok_requests?.phone ?? "",
  }));

  return NextResponse.json({ members: todays });
}
