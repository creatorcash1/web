import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const user = await getServerUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = await createServerSupabaseClient();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const query = supabase
    .from("tiktok_requests")
    .select("*, users(full_name, email), tiktok_groups(name, invite_url)")
    .order("created_at", { ascending: true });

  if (status) {
    query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Fetch tiktok requests error", error);
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }

  return NextResponse.json({ requests: data });
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
