import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function assignGroup(supabase: any, userId: string, requestId: string) {
  // Find current counts per group
  const { data: groups } = await supabase
    .from("tiktok_groups")
    .select("id, name, order_index, max_members, invite_url")
    .order("order_index", { ascending: true });

  const { data: counts } = await supabase
    .from("tiktok_group_members")
    .select("group_id");

  const countMap = new Map<string, number>();
  (counts || []).forEach((c: any) => {
    countMap.set(c.group_id, (countMap.get(c.group_id) || 0) + 1);
  });

  const targetGroup = (groups || []).find((g: any) => (countMap.get(g.id) || 0) < (g.max_members || 250));

  if (!targetGroup) {
    throw new Error("All groups are full");
  }

  const position = (countMap.get(targetGroup.id) || 0) + 1;

  const { error: memberError } = await supabase.from("tiktok_group_members").insert({
    group_id: targetGroup.id,
    request_id: requestId,
    user_id: userId,
    position,
  });

  if (memberError) throw memberError;

  return { groupId: targetGroup.id, position, groupName: targetGroup.name, inviteUrl: targetGroup.invite_url };
}

async function notifyCompletion(payload: {
  requestId: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  groupId: string;
  groupName: string;
  position: number;
  inviteUrl: string | null;
}) {
  const webhookUrl = process.env.TIKTOK_REQUEST_WEBHOOK_URL;
  if (!webhookUrl) return false;

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "tiktok_request_completed",
        occurredAt: new Date().toISOString(),
        payload,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Completion webhook error", error);
    return false;
  }
}

export async function POST(request: Request) {
  const user = await getServerUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { requestId } = await request.json();
  if (!requestId) {
    return NextResponse.json({ error: "requestId is required" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();

  const { data: requestRow } = await supabase
    .from("tiktok_requests")
    .select("id, user_id, status, full_name, email, phone")
    .eq("id", requestId)
    .single();

  if (!requestRow) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  if (requestRow.status === "completed") {
    return NextResponse.json({ success: true, message: "Already completed" });
  }

  // Assign to group
  const { groupId, position, groupName, inviteUrl } = await assignGroup(supabase, requestRow.user_id, requestId);

  const { error } = await supabase
    .from("tiktok_requests")
    .update({ status: "completed", completed_at: new Date().toISOString(), group_id: groupId })
    .eq("id", requestId);

  if (error) {
    console.error("Complete tiktok request error", error);
    return NextResponse.json({ error: "Failed to mark completed" }, { status: 500 });
  }

  const notified = await notifyCompletion({
    requestId,
    userId: requestRow.user_id,
    fullName: requestRow.full_name,
    email: requestRow.email,
    phone: requestRow.phone,
    groupId,
    groupName,
    position,
    inviteUrl: inviteUrl ?? null,
  });

  return NextResponse.json({ success: true, groupId, position, groupName, inviteUrl, notified });
}
