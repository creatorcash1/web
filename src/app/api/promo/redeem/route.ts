import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { promoCode, productId } = await request.json();

    if (!promoCode || !productId) {
      return NextResponse.json({ error: "promoCode and productId are required" }, { status: 400 });
    }

    const expectedCode = process.env.PROMO_CODE?.trim();
    if (!expectedCode) {
      return NextResponse.json({ error: "Promo code not configured" }, { status: 500 });
    }

    if (promoCode !== expectedCode) {
      return NextResponse.json({ error: "Invalid promo code" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    // Ensure course exists
    const { data: course } = await supabase
      .from("courses")
      .select("id, title")
      .eq("id", productId)
      .single();

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Upsert enrollment with promo source
    const { error: enrollError } = await supabase
      .from("user_enrollments")
      .upsert({ user_id: user.id, course_id: productId, access_source: "promo" }, { onConflict: "user_id,course_id" });

    if (enrollError) {
      console.error("Enrollment error", enrollError);
      return NextResponse.json({ error: "Failed to enroll user" }, { status: 500 });
    }

    // Record promo redemption (ignore conflicts)
    await supabase
      .from("promo_redemptions")
      .upsert({ user_id: user.id, product_id: productId, promo_code: promoCode }, { onConflict: "user_id,product_id" });

    return NextResponse.json({ success: true, productId, promoCode });
  } catch (error: any) {
    console.error("Promo redeem error", error);
    return NextResponse.json({ error: error.message || "Failed to redeem promo" }, { status: 500 });
  }
}
