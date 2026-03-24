import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth";
import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";

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

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) {
    return auth.error;
  }

  const supabase = await createServiceRoleClient();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const query = supabase.from("tiktok_requests").select("*").order("created_at", { ascending: true });

  if (status) {
    query.eq("status", status);
  }

  const { data: requests, error } = await query;
  if (error) {
    console.error("Fetch tiktok requests error", error);
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }

  if (!requests || requests.length === 0) {
    return NextResponse.json({ requests: [] });
  }

  const userIds = Array.from(new Set(requests.map((request: any) => request.user_id).filter(Boolean)));
  const groupIds = Array.from(new Set(requests.map((request: any) => request.group_id).filter(Boolean)));

  const [usersResult, groupsResult] = await Promise.all([
    userIds.length > 0
      ? supabase.from("users").select("id, full_name, email").in("id", userIds)
      : Promise.resolve({ data: [], error: null } as any),
    groupIds.length > 0
      ? supabase.from("tiktok_groups").select("id, name, invite_url").in("id", groupIds)
      : Promise.resolve({ data: [], error: null } as any),
  ]);

  if (usersResult.error) {
    console.error("Fetch tiktok request users error", usersResult.error);
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }

  if (groupsResult.error) {
    console.error("Fetch tiktok request groups error", groupsResult.error);
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }

  const usersMap = new Map<string, any>();
  (usersResult.data || []).forEach((row: any) => usersMap.set(row.id, row));

  const groupsMap = new Map<string, any>();
  (groupsResult.data || []).forEach((row: any) => groupsMap.set(row.id, row));

  const hydratedRequests = requests.map((request: any) => ({
    ...request,
    users: usersMap.get(request.user_id)
      ? {
          full_name: usersMap.get(request.user_id).full_name,
          email: usersMap.get(request.user_id).email,
        }
      : null,
    tiktok_groups: groupsMap.get(request.group_id)
      ? {
          name: groupsMap.get(request.group_id).name,
          invite_url: groupsMap.get(request.group_id).invite_url,
        }
      : null,
  }));

  return NextResponse.json({ requests: hydratedRequests });
}

export async function POST(request: Request) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      courseId,
      fullName,
      firstName,
      lastName,
      dateOfBirth,
      email,
      phone,
      desiredPassword,
    } = body;

    if (!courseId || !fullName || !firstName || !lastName || !dateOfBirth || !email || !phone || !desiredPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    // Ensure user is promo-enrolled in course
    const { data: enrollment } = await supabase
      .from("user_enrollments")
      .select("access_source")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .single();

    if (!enrollment || enrollment.access_source !== "promo") {
      return NextResponse.json({ error: "This action is only for promo users" }, { status: 403 });
    }

    const { error } = await supabase.from("tiktok_requests").insert({
      user_id: user.id,
      course_id: courseId,
      full_name: fullName,
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      email,
      phone,
      desired_password: desiredPassword,
      status: "pending",
    });

    if (error) {
      console.error("Create tiktok request error", error);
      return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("TikTok request error", error);
    return NextResponse.json({ error: error.message || "Failed to submit request" }, { status: 500 });
  }
}
