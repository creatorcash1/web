import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getServerUser } from "@/lib/auth";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "cc@creatorcashcow.com";

export async function GET() {
  try {
    // Check admin auth
    const authUser = await getServerUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = authUser.email === ADMIN_EMAIL;
    if (!isAdmin) {
      // Also check users table for role
      const supabase = await createServiceRoleClient();
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", authUser.id)
        .maybeSingle();

      if (profile?.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const supabase = await createServiceRoleClient();

    // ─── Fetch Users ────────────────────────────────────────────────────
    const { data: usersRaw } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    // Get enrollment counts per user
    const { data: enrollments } = await supabase
      .from("user_enrollments")
      .select("user_id, course_id");

    const enrollmentCountMap = new Map<string, number>();
    (enrollments ?? []).forEach((e: any) => {
      enrollmentCountMap.set(e.user_id, (enrollmentCountMap.get(e.user_id) || 0) + 1);
    });

    // Get payment totals per user
    const { data: payments } = await supabase
      .from("payments")
      .select("user_id, amount, status")
      .eq("status", "success");

    const spentMap = new Map<string, number>();
    (payments ?? []).forEach((p: any) => {
      if (p.status === "success") {
        spentMap.set(p.user_id, (spentMap.get(p.user_id) || 0) + (p.amount || 0));
      }
    });

    const users = (usersRaw ?? []).map((u: any) => ({
      id: u.id,
      full_name: u.full_name || u.email?.split("@")[0] || "User",
      email: u.email,
      role: u.role || "user",
      avatar_url: u.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${u.full_name || u.email}`,
      created_at: u.created_at,
      last_login: u.last_login || u.updated_at || null,
      enrolled_courses: enrollmentCountMap.get(u.id) || 0,
      total_spent: spentMap.get(u.id) || 0,
      status: u.is_suspended ? "suspended" : (u.is_banned ? "banned" : "active"),
    }));

    // ─── Fetch Courses ──────────────────────────────────────────────────
    const { data: coursesRaw } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    // Get enrollment counts per course
    const courseEnrollmentMap = new Map<string, number>();
    (enrollments ?? []).forEach((e: any) => {
      courseEnrollmentMap.set(e.course_id, (courseEnrollmentMap.get(e.course_id) || 0) + 1);
    });

    // Get revenue per course
    const { data: coursePayments } = await supabase
      .from("payments")
      .select("item_id, amount, status, item_type")
      .eq("item_type", "course")
      .eq("status", "success");

    const courseRevenueMap = new Map<string, number>();
    (coursePayments ?? []).forEach((p: any) => {
      courseRevenueMap.set(p.item_id, (courseRevenueMap.get(p.item_id) || 0) + (p.amount || 0));
    });

    const courses = (coursesRaw ?? []).map((c: any) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      price: c.price || 0,
      currency: c.currency || "USD",
      thumbnail_url: c.thumbnail_url || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop",
      modules: c.modules || [],
      enrollments: courseEnrollmentMap.get(c.id) || 0,
      revenue: courseRevenueMap.get(c.id) || 0,
      created_at: c.created_at,
      updated_at: c.updated_at,
      status: c.status || "published",
    }));

    // ─── Fetch PDFs ─────────────────────────────────────────────────────
    const { data: pdfsRaw } = await supabase
      .from("pdfs")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: pdfPurchases } = await supabase
      .from("user_pdf_purchases")
      .select("pdf_id");

    const pdfPurchaseMap = new Map<string, number>();
    (pdfPurchases ?? []).forEach((p: any) => {
      pdfPurchaseMap.set(p.pdf_id, (pdfPurchaseMap.get(p.pdf_id) || 0) + 1);
    });

    const { data: pdfPayments } = await supabase
      .from("payments")
      .select("item_id, amount, status")
      .eq("item_type", "pdf")
      .eq("status", "success");

    const pdfRevenueMap = new Map<string, number>();
    (pdfPayments ?? []).forEach((p: any) => {
      pdfRevenueMap.set(p.item_id, (pdfRevenueMap.get(p.item_id) || 0) + (p.amount || 0));
    });

    const pdfs = (pdfsRaw ?? []).map((p: any) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price || 0,
      currency: p.currency || "USD",
      cover_url: p.cover_url || "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=200&h=280&fit=crop",
      purchases: pdfPurchaseMap.get(p.id) || 0,
      revenue: pdfRevenueMap.get(p.id) || 0,
      created_at: p.created_at,
      status: p.status || "published",
    }));

    // ─── Fetch Live Sessions ────────────────────────────────────────────
    const { data: sessionsRaw } = await supabase
      .from("live_sessions")
      .select("*")
      .order("scheduled_date", { ascending: false });

    const liveSessions = (sessionsRaw ?? []).map((s: any) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      scheduled_date: s.scheduled_date,
      duration_minutes: s.duration_minutes || 60,
      attendees: s.attendees || 0,
      max_capacity: s.max_capacity || 100,
      is_replay_available: s.is_replay_available || false,
      replay_url: s.replay_url,
      status: s.status || "scheduled",
    }));

    // ─── Fetch Mentorship Bookings ──────────────────────────────────────
    const { data: bookingsRaw } = await supabase
      .from("mentorship_bookings")
      .select("*, users(full_name, email)")
      .order("scheduled_date", { ascending: false });

    const bookings = (bookingsRaw ?? []).map((b: any) => ({
      id: b.id,
      user_id: b.user_id,
      user_name: b.users?.full_name || "Unknown",
      user_email: b.users?.email || "",
      scheduled_date: b.scheduled_date,
      duration_minutes: b.duration_minutes || 120,
      status: b.status || "pending",
      payment_status: b.payment_status || "pending",
      amount: b.amount || 499,
      meeting_url: b.meeting_url,
      created_at: b.created_at,
    }));

    // ─── Fetch Payments ─────────────────────────────────────────────────
    const { data: allPayments } = await supabase
      .from("payments")
      .select("*, users(full_name, email)")
      .order("created_at", { ascending: false })
      .limit(100);

    const paymentsData = (allPayments ?? []).map((p: any) => ({
      id: p.id,
      user_id: p.user_id,
      user_name: p.users?.full_name || "Unknown",
      user_email: p.users?.email || "",
      date: p.created_at,
      item: p.item_name || p.item_type || "Purchase",
      item_type: p.item_type || "course",
      amount: p.amount || 0,
      currency: p.currency || "USD",
      status: p.status || "pending",
      method: p.method || "stripe",
      transaction_id: p.transaction_id || p.stripe_payment_intent_id || "",
      invoice_url: p.invoice_url || null,
    }));

    // ─── Calculate KPIs ─────────────────────────────────────────────────
    const totalRevenue = (allPayments ?? [])
      .filter((p: any) => p.status === "success")
      .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

    const totalUsers = users.length;
    const totalEnrollments = enrollments?.length || 0;
    const totalBookings = bookings.length;
    const totalPdfPurchases = pdfPurchases?.length || 0;
    const avgOrderValue = totalRevenue > 0 && paymentsData.length > 0 
      ? Math.round(totalRevenue / paymentsData.filter((p: any) => p.status === "success").length)
      : 0;

    const kpis = [
      { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, change: 0, trend: "up" as const, icon: "CurrencyDollarIcon" },
      { label: "Total Users", value: totalUsers.toString(), change: 0, trend: "up" as const, icon: "UsersIcon" },
      { label: "Active Enrollments", value: totalEnrollments.toString(), change: 0, trend: "up" as const, icon: "AcademicCapIcon" },
      { label: "Mentorship Bookings", value: totalBookings.toString(), change: 0, trend: "up" as const, icon: "CalendarDaysIcon" },
      { label: "PDF Downloads", value: totalPdfPurchases.toString(), change: 0, trend: "up" as const, icon: "DocumentArrowDownIcon" },
      { label: "Avg Order Value", value: `$${avgOrderValue}`, change: 0, trend: "up" as const, icon: "ShoppingCartIcon" },
    ];

    // ─── Content Blocks ─────────────────────────────────────────────────
    const { data: contentBlocksRaw } = await supabase
      .from("content_blocks")
      .select("*")
      .order("updated_at", { ascending: false });

    const contentBlocks = (contentBlocksRaw ?? []).map((c: any) => ({
      id: c.id,
      key: c.key,
      location: c.location || "landing",
      label: c.label || c.key,
      content: c.content,
      status: c.status || "published",
      updated_at: c.updated_at,
    }));

    // ─── Analytics (simplified from real data) ──────────────────────────
    const successfulPayments = paymentsData.filter((p: any) => p.status === "success");
    const mrr = Math.round(totalRevenue / 12); // Simplified MRR calculation
    const arr = totalRevenue;

    const analytics = {
      mrr,
      arr,
      churn_rate: 2.5, // Placeholder
      avg_order_value: avgOrderValue,
      revenue_over_time: [],
      user_growth: [],
      top_products: courses.slice(0, 5).map((c: any) => ({
        name: c.title,
        revenue: c.revenue,
        units: c.enrollments,
      })),
      conversion_funnel: {
        visitors: totalUsers * 10,
        signups: totalUsers,
        purchases: successfulPayments.length,
        repeat_customers: Math.floor(successfulPayments.length * 0.3),
      },
    };

    // ─── Settings ───────────────────────────────────────────────────────
    const settings = {
      site_name: "CreatorCashCow",
      tagline: "Build Your Creator Empire",
      support_email: "support@creatorcashcow.com",
      stripe_mode: process.env.STRIPE_SECRET_KEY?.startsWith("sk_live") ? "live" : "test",
      maintenance_mode: false,
      signup_enabled: true,
      mentorship_enabled: true,
      mentorship_price: 499,
      default_currency: "USD",
    };

    return NextResponse.json({
      kpis,
      users,
      courses,
      pdfs,
      live_sessions: liveSessions,
      bookings,
      payments: paymentsData,
      analytics,
      content_blocks: contentBlocks,
      settings,
    });
  } catch (error: any) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch admin data" },
      { status: 500 }
    );
  }
}
