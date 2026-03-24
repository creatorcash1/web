import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth";
import { createServiceRoleClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "cc@creatorcashcow.com";

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
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createServiceRoleClient();
  const isAdminByEmail = user.email === ADMIN_EMAIL;
  const isAdminByRole = user.role === "admin";

  if (!isAdminByEmail && !isAdminByRole) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const { groupId } = await request.json();
  if (!groupId) {
    return NextResponse.json({ error: "groupId is required" }, { status: 400 });
  }

  const { data: members, error } = await supabase
    .from("tiktok_group_members")
    .select("position, user_id, request_id")
    .eq("group_id", groupId)
    .order("position", { ascending: true });

  if (error) {
    console.error("Schedule fetch members error", error);
    return NextResponse.json({ error: "Failed to load members" }, { status: 500 });
  }

  if (!members || members.length === 0) {
    return NextResponse.json({ members: [] });
  }

  const userIds = Array.from(new Set(members.map((member: any) => member.user_id).filter(Boolean)));
  const requestIds = Array.from(new Set(members.map((member: any) => member.request_id).filter(Boolean)));

  const [usersResult, requestsResult] = await Promise.all([
    userIds.length > 0
      ? supabase.from("users").select("id, full_name, email").in("id", userIds)
      : Promise.resolve({ data: [], error: null } as any),
    requestIds.length > 0
      ? supabase.from("tiktok_requests").select("id, first_name, full_name, phone").in("id", requestIds)
      : Promise.resolve({ data: [], error: null } as any),
  ]);

  if (usersResult.error) {
    console.error("Schedule fetch users error", usersResult.error);
    return NextResponse.json({ error: "Failed to load schedule users" }, { status: 500 });
  }

  if (requestsResult.error) {
    console.error("Schedule fetch requests error", requestsResult.error);
    return NextResponse.json({ error: "Failed to load schedule requests" }, { status: 500 });
  }

  const userMap = new Map<string, any>();
  (usersResult.data || []).forEach((row: any) => {
    userMap.set(row.id, row);
  });

  const requestMap = new Map<string, any>();
  (requestsResult.data || []).forEach((row: any) => {
    requestMap.set(row.id, row);
  });

  const todays = pickDailyMembers(members || [], 25).map((m) => ({
    position: m.position,
    name:
      userMap.get(m.user_id)?.full_name ??
      requestMap.get(m.request_id)?.full_name ??
      requestMap.get(m.request_id)?.first_name ??
      "Member",
    phone: requestMap.get(m.request_id)?.phone ?? "",
  }));

  return NextResponse.json({ members: todays });
}
