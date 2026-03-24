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

async function sendCompletionEmail(payload: {
  fullName: string;
  email: string;
  groupName: string;
  inviteUrl: string | null;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!resendApiKey || !fromEmail) {
    console.warn("Resend email skipped: missing RESEND_API_KEY or RESEND_FROM_EMAIL");
    return false;
  }

  const firstName = payload.fullName.split(" ")[0] ?? "there";
  const inviteBlock = payload.inviteUrl
    ? `\nJoin your TikTok group here: ${payload.inviteUrl}\n`
    : "\nYour group invite link will be shared with you shortly by the team.\n";

  const subject = "Your TikTok account is ready";
  const text = [
    `Hi ${firstName},`,
    "",
    "Great news — your TikTok account setup is complete.",
    "",
    "Please log in using the same login details you submitted in your request.",
    "For security, change your password immediately after your first login.",
    "",
    `Assigned group: ${payload.groupName}`,
    inviteBlock,
    "If you need help, reply to this email and our team will support you.",
    "",
    "CreatorCashCow Team",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0D1B2A; max-width: 620px;">
      <h2 style="margin: 0 0 12px;">Your TikTok account is ready ✅</h2>
      <p>Hi ${firstName},</p>
      <p>Great news — your TikTok account setup is complete.</p>
      <p>Please log in using the same login details you submitted in your request.<br />
      For security, <strong>change your password immediately</strong> after your first login.</p>
      <p><strong>Assigned group:</strong> ${payload.groupName}</p>
      ${payload.inviteUrl
        ? `<p><strong>Group invite:</strong> <a href="${payload.inviteUrl}">${payload.inviteUrl}</a></p>`
        : `<p>Your group invite link will be shared with you shortly by the team.</p>`}
      <p>If you need help, reply to this email and our team will support you.</p>
      <p style="margin-top: 20px;">CreatorCashCow Team</p>
    </div>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [payload.email],
        subject,
        text,
        html,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resend email error:", errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Send completion email error", error);
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

  const emailSent = await sendCompletionEmail({
    fullName: requestRow.full_name,
    email: requestRow.email,
    groupName,
    inviteUrl: inviteUrl ?? null,
  });

  return NextResponse.json({ success: true, groupId, position, groupName, inviteUrl, notified, emailSent });
}
