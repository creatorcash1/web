// ─── Supabase Database Service Layer ────────────────────────────────────────
// Real database operations replacing mock services
// ─────────────────────────────────────────────────────────────────────────────

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { DashboardData } from "@/types/dashboard";

/**
 * Fetch complete dashboard data for a user
 */
export async function fetchDashboardData(userId: string): Promise<DashboardData> {
  const supabase = await createServerSupabaseClient();

  // Fetch user profile
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (!user) throw new Error("User not found");

  // Fetch enrolled courses with progress
  const { data: enrollments } = await supabase
    .from("user_enrollments")
    .select(`
      *,
      courses:course_id (
        id,
        title,
        description,
        thumbnail_url,
        total_lessons
      )
    `)
    .eq("user_id", userId)
    .order("enrolled_at", { ascending: false });

  // Fetch purchased PDFs
  const { data: pdfPurchases } = await supabase
    .from("user_pdf_purchases")
    .select(`
      *,
      pdfs:pdf_id (
        id,
        title,
        description,
        price,
        thumbnail_url
      )
    `)
    .eq("user_id", userId)
    .order("purchased_at", { ascending: false });

  // Fetch mentorship bookings
  const { data: bookings } = await supabase
    .from("mentorship_bookings")
    .select(`
      *,
      mentorship_products:mentorship_product_id (
        id,
        title,
        description,
        price
      )
    `)
    .eq("user_id", userId)
    .order("scheduled_date", { ascending: false });

  // Fetch upcoming live sessions
  const { data: liveSessions } = await supabase
    .from("live_sessions")
    .select("*")
    .eq("is_active", true)
    .gte("scheduled_date", new Date().toISOString())
    .order("scheduled_date", { ascending: true })
    .limit(5);

  // Calculate stats
  const enrolledCourses = enrollments?.length ?? 0;
  const avgProgress = enrollments?.length
    ? enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length
    : 0;
  const activeBookings = bookings?.filter(b => b.status === "confirmed").length ?? 0;
  const digitalAssets = (pdfPurchases?.length ?? 0) + enrolledCourses;

  // Fetch user payments
  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  return {
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar_url || undefined,
      created_at: user.created_at,
    },
    stats: {
      enrolled_courses: enrolledCourses,
      avg_progress: Math.round(avgProgress),
      active_bookings: activeBookings,
      digital_assets: digitalAssets,
    },
    courses: (enrollments || []).map((e: any) => ({
      id: e.courses.id,
      title: e.courses.title,
      description: e.courses.description,
      thumbnail_url: e.courses.thumbnail_url,
      progress: e.progress || 0,
      enrolled_at: e.enrolled_at,
      completed_at: e.completed_at,
      access_source: e.access_source || "purchase",
    })),
    pdfs: (pdfPurchases || []).map((p: any) => ({
      id: p.pdfs.id,
      title: p.pdfs.title,
      description: p.pdfs.description,
      price: parseFloat(p.pdfs.price),
      cover_url: p.pdfs.thumbnail_url,
      download_url: p.pdfs.file_url,
      purchased_at: p.purchased_at,
    })),
    bookings: (bookings || []).map((b: any) => ({
      id: b.id,
      product_id: b.mentorship_product_id,
      product_title: b.mentorship_products?.title || "Mentorship Session",
      mentor_name: "CC Mendel",
      scheduled_date: b.scheduled_date,
      duration_minutes: b.duration_minutes,
      status: b.status,
      payment_status: "success" as const,
      meeting_url: b.meeting_url,
    })),
    live_sessions: (liveSessions || []).map((s: any) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      scheduled_date: s.scheduled_date,
      duration_minutes: s.duration_minutes,
      is_replay_available: Boolean(s.replay_url),
      replay_url: s.replay_url,
      meeting_url: s.meeting_url,
      thumbnail_url: s.thumbnail_url,
    })),
    payments: (payments || []).map((p: any) => ({
      id: p.id,
      date: p.created_at,
      item: `${p.product_type} - ${p.product_id}`,
      amount: parseFloat(p.amount),
      currency: p.currency,
      status: p.status,
      method: p.payment_method || "stripe",
      invoice_url: "#", // TODO: Add invoice generation
      product_type: p.product_type,
      product_id: p.product_id,
      created_at: p.created_at,
    })),
  };
}

/**
 * Fetch all courses from the catalog
 */
export async function fetchCourses() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Fetch single course by ID
 */
export async function fetchCourse(courseId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*, course_modules(*)")
    .eq("id", courseId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Fetch all PDFs from the catalog
 */
export async function fetchPDFs() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("pdfs")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Fetch single PDF by ID
 */
export async function fetchPDF(pdfId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("pdfs")
    .select("*")
    .eq("id", pdfId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Fetch mentorship products
 */
export async function fetchMentorshipProducts() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("mentorship_products")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false});

  if (error) throw error;
  return data || [];
}

/**
 * Fetch single mentorship product
 */
export async function fetchMentorshipProduct(productId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("mentorship_products")
    .select("*")
    .eq("id", productId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Check if user is enrolled in a course
 */
export async function isEnrolledInCourse(userId: string, courseId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("user_enrollments")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();

  return Boolean(data);
}

/**
 * Enroll user in a course (after payment)
 */
export async function enrollUserInCourse(userId: string, courseId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("user_enrollments")
    .insert({
      user_id: userId,
      course_id: courseId,
      progress: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Grant PDF access (after payment)
 */
export async function grantPDFAccess(userId: string, pdfId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("user_pdf_purchases")
    .insert({
      user_id: userId,
      pdf_id: pdfId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create mentorship booking (after payment)
 */
export async function createMentorshipBooking(
  userId: string,
  productId: string,
  scheduledDate: string,
  durationMinutes: number
) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("mentorship_bookings")
    .insert({
      user_id: userId,
      mentorship_product_id: productId,
      scheduled_date: scheduledDate,
      duration_minutes: durationMinutes,
      status: "confirmed",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Track analytics event
 */
export async function trackAnalyticsEvent(
  userId: string | null,
  eventName: string,
  eventData: Record<string, any>,
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    referrer?: string;
  }
) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("analytics_events")
    .insert({
      user_id: userId,
      event_name: eventName,
      event_data: eventData,
      user_agent: metadata?.userAgent,
      ip_address: metadata?.ipAddress,
      referrer: metadata?.referrer,
    });

  if (error) console.error("Analytics tracking error:", error);
}

/**
 * Record payment
 */
export async function recordPayment(
  userId: string,
  amount: number,
  currency: string,
  productType: string,
  productId: string,
  stripePaymentIntentId: string
) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("payments")
    .insert({
      user_id: userId,
      stripe_payment_intent_id: stripePaymentIntentId,
      amount,
      currency,
      status: "success",
      payment_method: "stripe",
      product_type: productType,
      product_id: productId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
