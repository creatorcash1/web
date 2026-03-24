import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getServerUser } from "@/lib/auth";
import type { AIBrainInput, EmailCampaign, AIBrainHealth } from "@/types/aiBrain";
import {
  runAIBrainPipeline,
  reportAdminInsights,
  analyzeBehavior,
  predictChurn,
  computeGlobalForecast,
  computeGlobalProductPerformance,
} from "@/services/aiBrainEngine";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "cc@creatorcashcow.com";

function daysSince(isoDate: string | null | undefined): number {
  if (!isoDate) return 0;
  const created = new Date(isoDate).getTime();
  if (Number.isNaN(created)) return 0;
  const diff = Date.now() - created;
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export async function GET() {
  try {
    const authUser = await getServerUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createServiceRoleClient();
    const isAdminEmail = authUser.email === ADMIN_EMAIL;

    if (!isAdminEmail) {
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", authUser.id)
        .maybeSingle();

      if (profile?.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const [
      usersResult,
      coursesResult,
      pdfsResult,
      enrollmentsResult,
      pdfPurchasesResult,
      bookingsResult,
      paymentsResult,
      attendanceResult,
    ] = await Promise.all([
      supabase
        .from("users")
        .select("id, full_name, email, created_at, updated_at, last_login")
        .order("created_at", { ascending: false }),
      supabase.from("courses").select("id, title"),
      supabase.from("pdfs").select("id, title"),
      supabase
        .from("user_enrollments")
        .select("user_id, course_id, created_at, progress, last_accessed_at, completed_at"),
      supabase
        .from("user_pdf_purchases")
        .select("user_id, pdf_id, created_at, downloaded, downloaded_at"),
      supabase.from("mentorship_bookings").select("user_id, status"),
      supabase
        .from("payments")
        .select("id, user_id, amount, created_at, item_type, status")
        .order("created_at", { ascending: false }),
      supabase.from("live_session_attendance").select("user_id"),
    ]);

    const users = usersResult.data ?? [];
    const courses = coursesResult.data ?? [];
    const pdfs = pdfsResult.data ?? [];
    const enrollments = enrollmentsResult.data ?? [];
    const pdfPurchases = pdfPurchasesResult.data ?? [];
    const bookings = bookingsResult.data ?? [];
    const payments = paymentsResult.data ?? [];
    const attendance = attendanceResult.error ? [] : attendanceResult.data ?? [];

    const courseTitleMap = new Map<string, string>();
    courses.forEach((course: any) => {
      courseTitleMap.set(course.id, course.title || "Course");
    });

    const pdfTitleMap = new Map<string, string>();
    pdfs.forEach((pdf: any) => {
      pdfTitleMap.set(pdf.id, pdf.title || "PDF");
    });

    const enrollmentsByUser = new Map<string, any[]>();
    enrollments.forEach((enrollment: any) => {
      const list = enrollmentsByUser.get(enrollment.user_id) ?? [];
      list.push(enrollment);
      enrollmentsByUser.set(enrollment.user_id, list);
    });

    const pdfPurchasesByUser = new Map<string, any[]>();
    pdfPurchases.forEach((purchase: any) => {
      const list = pdfPurchasesByUser.get(purchase.user_id) ?? [];
      list.push(purchase);
      pdfPurchasesByUser.set(purchase.user_id, list);
    });

    const bookingsByUser = new Map<string, any[]>();
    bookings.forEach((booking: any) => {
      const list = bookingsByUser.get(booking.user_id) ?? [];
      list.push(booking);
      bookingsByUser.set(booking.user_id, list);
    });

    const paymentsByUser = new Map<string, any[]>();
    payments.forEach((payment: any) => {
      const list = paymentsByUser.get(payment.user_id) ?? [];
      list.push(payment);
      paymentsByUser.set(payment.user_id, list);
    });

    const attendanceCountByUser = new Map<string, number>();
    attendance.forEach((row: any) => {
      const current = attendanceCountByUser.get(row.user_id) ?? 0;
      attendanceCountByUser.set(row.user_id, current + 1);
    });

    const inputs: AIBrainInput[] = users.map((user: any) => {
      const userEnrollments = enrollmentsByUser.get(user.id) ?? [];
      const userPdfPurchases = pdfPurchasesByUser.get(user.id) ?? [];
      const userBookings = bookingsByUser.get(user.id) ?? [];
      const userPayments = paymentsByUser.get(user.id) ?? [];

      const successfulPayments = userPayments.filter((payment: any) => payment.status === "success");
      const totalSpent = successfulPayments.reduce(
        (sum: number, payment: any) => sum + (Number(payment.amount) || 0),
        0
      );
      const lastPurchaseDate = successfulPayments[0]?.created_at ?? null;

      return {
        userId: user.id,
        fullName: user.full_name || user.email?.split("@")[0] || "User",
        email: user.email,
        enrolledCourses: userEnrollments.map((enrollment: any) => ({
          courseId: enrollment.course_id,
          title: courseTitleMap.get(enrollment.course_id) || "Course",
          progress: Number(enrollment.progress) || 0,
          enrolledAt: enrollment.created_at || user.created_at || new Date().toISOString(),
          lastAccessedAt: enrollment.last_accessed_at || enrollment.updated_at || null,
          completedAt: enrollment.completed_at || null,
        })),
        purchasedPDFs: userPdfPurchases.map((purchase: any) => ({
          pdfId: purchase.pdf_id,
          title: pdfTitleMap.get(purchase.pdf_id) || "PDF",
          purchasedAt: purchase.created_at || user.created_at || new Date().toISOString(),
          downloaded: Boolean(purchase.downloaded || purchase.downloaded_at),
        })),
        mentorshipBooked: userBookings.length > 0,
        mentorshipCompleted: userBookings.some((booking: any) => booking.status === "completed"),
        liveSessionsAttended: attendanceCountByUser.get(user.id) ?? 0,
        lastLogin: user.last_login || user.updated_at || user.created_at || new Date().toISOString(),
        totalSpent,
        accountAge: daysSince(user.created_at),
        lastPurchaseDate,
        paymentHistory: userPayments.map((payment: any) => ({
          id: payment.id,
          amount: Number(payment.amount) || 0,
          date: payment.created_at || new Date().toISOString(),
          itemType:
            payment.item_type === "course" ||
            payment.item_type === "pdf" ||
            payment.item_type === "mentorship" ||
            payment.item_type === "bundle"
              ? payment.item_type
              : "course",
          status: payment.status || "pending",
        })),
      };
    });

    const startTime = Date.now();
    const userProfiles = inputs.map((input) => runAIBrainPipeline(input));
    const processingTime = Date.now() - startTime;

    const allData = inputs.map((input) => {
      const behavior = analyzeBehavior(input);
      return {
        input,
        behavior,
        churn: predictChurn(input, behavior),
      };
    });

    const globalInsights = reportAdminInsights(allData);
    const forecast = computeGlobalForecast(inputs);
    const productPerformance = computeGlobalProductPerformance(inputs);

    const campaignMap = new Map<string, EmailCampaign>();
    for (const profile of userProfiles) {
      for (const campaign of profile.content.campaigns) {
        const existing = campaignMap.get(campaign.name);
        if (existing) {
          existing.enrolledUsers += campaign.enrolledUsers;
        } else {
          campaignMap.set(campaign.name, { ...campaign, enrolledUsers: campaign.enrolledUsers });
        }
      }
    }
    const campaigns = Array.from(campaignMap.values());

    const brainHealth: AIBrainHealth = {
      status: "operational",
      lastRun: new Date().toISOString(),
      totalUsersAnalyzed: inputs.length,
      avgProcessingTimeMs: inputs.length > 0 ? Math.round(processingTime / inputs.length) : 0,
      cacheHitRate: 0,
      apiCallsToday: 0,
      apiCallsLimit: 1000,
    };

    return NextResponse.json({
      userProfiles,
      globalInsights,
      brainHealth,
      forecast,
      productPerformance,
      campaigns,
    });
  } catch (error: any) {
    console.error("Admin AI Brain error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load AI Brain data" },
      { status: 500 }
    );
  }
}