import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth";
import { createServiceRoleClient } from "@/lib/supabase/server";

interface Body {
  productId?: string;
  accessSource?: "purchase" | "promo" | "admin_grant";
}

export async function POST(request: Request) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as Body;
    const productId = body.productId;
    const accessSource = body.accessSource ?? "purchase";

    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    // Ensure course exists
    const { data: course } = await supabase
      .from("courses")
      .select("id")
      .eq("id", productId)
      .maybeSingle();

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const { error } = await supabase
      .from("user_enrollments")
      .upsert({ user_id: user.id, course_id: productId, access_source: accessSource }, { onConflict: "user_id,course_id" });

    if (error) {
      console.error("Enroll error", error);
      return NextResponse.json({ error: "Failed to enroll user" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      productId,
      enrolledAt: new Date().toISOString(),
      accessSource,
    });
  } catch (error: any) {
    console.error("Enroll API error", error);
    return NextResponse.json({ error: error.message || "Failed to enroll" }, { status: 500 });
  }
}
