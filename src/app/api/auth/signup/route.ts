// ─── Auth API Routes ─────────────────────────────────────────────────────────
// Sign up, sign in, sign out endpoints
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";
import { FREE_COURSE_ID, isFreeCourseOfferActive } from "@/lib/freeOffer";

interface SignupBody {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  country?: string;
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? "User";
  const lastName = parts.slice(1).join(" ") || "User";
  return { firstName, lastName };
}

async function assignGroupAndMarkCompleted(
  userId: string,
  email: string,
  fullName: string,
  phone: string,
  desiredPassword: string
): Promise<{ inviteUrl: string | null; groupName: string | null }> {
  const serviceRole = createServiceRoleClient();
  const { firstName, lastName } = splitName(fullName);

  const { data: existingRequest } = await serviceRole
    .from("tiktok_requests")
    .select("id, group_id, status")
    .eq("user_id", userId)
    .eq("course_id", FREE_COURSE_ID)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let requestId = existingRequest?.id ?? null;
  let groupId = existingRequest?.group_id ?? null;

  if (!requestId) {
    const { data: createdRequest, error: createRequestError } = await serviceRole
      .from("tiktok_requests")
      .insert({
        user_id: userId,
        course_id: FREE_COURSE_ID,
        full_name: fullName,
        first_name: firstName,
        last_name: lastName,
        date_of_birth: "2000-01-01",
        email,
        phone,
        desired_password: desiredPassword,
        status: "pending",
      })
      .select("id")
      .single();

    if (createRequestError) {
      throw createRequestError;
    }

    requestId = createdRequest.id;
  }

  if (!groupId) {
    const { data: groups } = await serviceRole
      .from("tiktok_groups")
      .select("id, name, max_members")
      .order("order_index", { ascending: true });

    const { data: members } = await serviceRole
      .from("tiktok_group_members")
      .select("group_id");

    const countMap = new Map<string, number>();
    (members || []).forEach((member: { group_id: string }) => {
      countMap.set(member.group_id, (countMap.get(member.group_id) || 0) + 1);
    });

    const targetGroup = (groups || []).find(
      (group: { id: string; max_members: number | null }) =>
        (countMap.get(group.id) || 0) < (group.max_members || 250)
    );

    if (!targetGroup) {
      await serviceRole
        .from("tiktok_requests")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", requestId);

      return { inviteUrl: null, groupName: null };
    }

    const position = (countMap.get(targetGroup.id) || 0) + 1;

    const { error: insertMemberError } = await serviceRole
      .from("tiktok_group_members")
      .insert({
        group_id: targetGroup.id,
        request_id: requestId,
        user_id: userId,
        position,
      });

    if (!insertMemberError) {
      groupId = targetGroup.id;
    }
  }

  if (groupId) {
    await serviceRole
      .from("tiktok_requests")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        group_id: groupId,
      })
      .eq("id", requestId);
  }

  const { data: group } = groupId
    ? await serviceRole
        .from("tiktok_groups")
        .select("name, invite_url")
        .eq("id", groupId)
        .single()
    : { data: null };

  return {
    inviteUrl: group?.invite_url ?? null,
    groupName: group?.name ?? null,
  };
}

async function sendSignupWelcomeEmail(payload: {
  fullName: string;
  email: string;
  inviteUrl: string | null;
  dashboardUrl: string;
  groupName: string | null;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!resendApiKey || !fromEmail) {
    return false;
  }

  const firstName = payload.fullName.split(" ")[0] ?? "there";
  const inviteButton = payload.inviteUrl
    ? `<a href="${payload.inviteUrl}" style="display:inline-block;background:#25D366;color:#0D1B2A;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:700;margin-right:10px;">Join Your WhatsApp Group</a>`
    : "";

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0D1B2A;max-width:640px;">
      <h2 style="margin-bottom:8px;">Welcome to CreatorCashCow, ${firstName} ✅</h2>
      <p>Your account is ready and your course access is active.</p>
      ${payload.groupName ? `<p><strong>Assigned Group:</strong> ${payload.groupName}</p>` : ""}
      <p style="margin:18px 0;">
        ${inviteButton}
        <a href="${payload.dashboardUrl}" style="display:inline-block;background:#FFC857;color:#0D1B2A;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:700;">Log Into Dashboard</a>
      </p>
      <p>Please use the login details you created during signup, and change your password after first login for extra security.</p>
      <p>CreatorCashCow Team</p>
    </div>
  `;

  const text = [
    `Welcome to CreatorCashCow, ${firstName}!`,
    "",
    "Your account is ready and your course access is active.",
    payload.groupName ? `Assigned Group: ${payload.groupName}` : "",
    payload.inviteUrl ? `Join WhatsApp Group: ${payload.inviteUrl}` : "",
    `Log Into Dashboard: ${payload.dashboardUrl}`,
    "",
    "Please use the login details you created during signup, and change your password after first login for extra security.",
  ]
    .filter(Boolean)
    .join("\n");

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
        subject: "Welcome to CreatorCashCow — Your Access is Ready",
        html,
        text,
      }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SignupBody;
    const { email, password, fullName } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = (body.phone || "").trim();
    const normalizedCountry = (body.country || "").trim();
    const phoneWithCountry = normalizedCountry
      ? `${normalizedPhone} (${normalizedCountry})`
      : normalizedPhone;

    const supabase = await createServerSupabaseClient();

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          full_name: fullName || email.split("@")[0],
          phone: normalizedPhone,
          country: normalizedCountry,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const userId = data.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Failed to create user account" }, { status: 500 });
    }

    const serviceRole = createServiceRoleClient();
    let inviteUrl: string | null = null;
    let groupName: string | null = null;

    try {
      if (isFreeCourseOfferActive()) {
        await serviceRole
          .from("user_enrollments")
          .upsert(
            {
              user_id: userId,
              course_id: FREE_COURSE_ID,
              access_source: "promo",
            },
            { onConflict: "user_id,course_id" }
          );
      }

      const assignment = await assignGroupAndMarkCompleted(
        userId,
        normalizedEmail,
        fullName || normalizedEmail.split("@")[0],
        phoneWithCountry || "N/A",
        password
      );

      inviteUrl = assignment.inviteUrl;
      groupName = assignment.groupName;
    } catch (assignmentError) {
      console.error("Post-signup assignment error:", assignmentError);
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://creatorcashcow.org";
    const dashboardLoginUrl = `${appUrl}/login?redirect=/dashboard`;

    const emailSent = await sendSignupWelcomeEmail({
      fullName: fullName || normalizedEmail,
      email: normalizedEmail,
      inviteUrl,
      dashboardUrl: dashboardLoginUrl,
      groupName,
    });

    return NextResponse.json({
      message: "Sign up successful! Please check your email to verify your account.",
      user: data.user,
      assignedWhatsappLink: inviteUrl,
      assignedGroupName: groupName,
      dashboardLoginUrl,
      emailSent,
    });
  } catch (error: any) {
    console.error("Sign up error:", error);
    return NextResponse.json(
      { error: error.message || "Sign up failed" },
      { status: 500 }
    );
  }
}
