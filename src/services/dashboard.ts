// ─── Dashboard Service Layer ─────────────────────────────────────────────────
// Real dashboard data fetching via API routes (backed by Supabase)
// ─────────────────────────────────────────────────────────────────────────────

import type { DashboardData } from "@/types/dashboard";

/** Fetch dashboard data from API */
export async function fetchDashboardData(userId: string): Promise<DashboardData> {
  const response = await fetch(`/api/dashboard?userId=${userId}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return response.json();
}

// ═══ Legacy Mock Data (for reference during migration) ═══════════════════════
export const MOCK_LEGACY: DashboardData = {
  user: {
    id: "usr_001",
    full_name: "Jordan Mitchell",
    email: "jordan@creatorcashcow.com",
    role: "user",
    avatar_url: "https://i.pravatar.cc/128?img=12",
    created_at: "2025-11-02T10:30:00Z",
  },

  stats: {
    enrolled_courses: 4,
    avg_progress: 62,
    active_bookings: 1,
    digital_assets: 7,
  },

  courses: [
    {
      id: "crs_001",
      title: "UGC Mastery",
      description:
        "Land brand deals, create scroll-stopping content, and build a UGC portfolio that brands pay for.",
      thumbnail_url:
        "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=480&auto=format&fit=crop&q=80",
      progress: 75,
      enrolled_at: "2025-12-05T08:00:00Z",
      completed_at: null,
    },
    {
      id: "crs_002",
      title: "Dropshipping Profits",
      description:
        "Launch a profitable online store from scratch with no inventory — proven strategies.",
      thumbnail_url:
        "https://images.unsplash.com/photo-1556740758-90de940a6939?w=480&auto=format&fit=crop&q=80",
      progress: 40,
      enrolled_at: "2025-12-10T09:00:00Z",
      completed_at: null,
    },
    {
      id: "crs_003",
      title: "TikTok Shop Success",
      description:
        "Tap into the fastest-growing commerce platform with viral product strategies.",
      thumbnail_url:
        "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=480&auto=format&fit=crop&q=80",
      progress: 90,
      enrolled_at: "2026-01-02T12:00:00Z",
      completed_at: null,
    },
    {
      id: "crs_004",
      title: "Build Your Own Platform",
      description:
        "Create a branded digital platform that solves real problems and generates passive income.",
      thumbnail_url:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=480&auto=format&fit=crop&q=80",
      progress: 20,
      enrolled_at: "2026-01-15T14:00:00Z",
      completed_at: null,
    },
  ],

  live_sessions: [
    {
      id: "ls_001",
      title: "Live Q&A: Building Your First Digital Product",
      description: "CC Mendel answers your biggest questions live.",
      scheduled_date: "2026-02-25T19:00:00Z",
      is_replay_available: false,
      replay_url: null,
    },
    {
      id: "ls_002",
      title: "Replay: TikTok Shop Winning Products Workshop",
      description:
        "Product research breakdown — watch the full replay now.",
      scheduled_date: "2026-02-01T18:00:00Z",
      is_replay_available: true,
      replay_url: "https://example.com/replay/ls_002",
    },
  ],

  pdfs: [
    {
      id: "pdf_001",
      title: "The Creator Revenue Blueprint",
      description: "50-page guide to building 5 income streams from scratch.",
      cover_url:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=320&auto=format&fit=crop&q=80",
      download_url: "#",
      purchased_at: "2025-12-20T10:00:00Z",
    },
    {
      id: "pdf_002",
      title: "UGC Pitch Template Pack",
      description: "Ready-to-send pitch emails for 10 brand niches.",
      cover_url:
        "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=320&auto=format&fit=crop&q=80",
      download_url: "#",
      purchased_at: "2026-01-05T15:00:00Z",
    },
    {
      id: "pdf_003",
      title: "Dropship Product Cheat Sheet",
      description: "Top 30 winning product ideas with supplier links.",
      cover_url:
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=320&auto=format&fit=crop&q=80",
      download_url: "#",
      purchased_at: "2026-01-18T11:00:00Z",
    },
  ],

  bookings: [
    {
      id: "bk_001",
      mentor_name: "CC Mendel",
      scheduled_date: "2026-03-05T16:00:00Z",
      duration_minutes: 120,
      status: "confirmed",
      payment_status: "success",
      meeting_url: "https://zoom.us/j/placeholder",
    },
  ],

  payments: [
    {
      id: "pay_001",
      date: "2025-12-05T08:00:00Z",
      item: "Full Access Bundle",
      amount: 399,
      currency: "USD",
      status: "success",
      method: "stripe",
      invoice_url: "#",
    },
    {
      id: "pay_002",
      date: "2025-12-20T10:00:00Z",
      item: "The Creator Revenue Blueprint (PDF)",
      amount: 29,
      currency: "USD",
      status: "success",
      method: "paypal",
      invoice_url: "#",
    },
    {
      id: "pay_003",
      date: "2026-01-05T15:00:00Z",
      item: "UGC Pitch Template Pack (PDF)",
      amount: 19,
      currency: "USD",
      status: "success",
      method: "stripe",
      invoice_url: "#",
    },
    {
      id: "pay_004",
      date: "2026-01-18T11:00:00Z",
      item: "Dropship Product Cheat Sheet (PDF)",
      amount: 14,
      currency: "USD",
      status: "success",
      method: "stripe",
      invoice_url: "#",
    },
    {
      id: "pay_005",
      date: "2026-02-10T09:00:00Z",
      item: "1:1 Mentorship — CC Mendel (2 hrs)",
      amount: 950,
      currency: "USD",
      status: "success",
      method: "stripe",
      invoice_url: "#",
    },
  ],
};

// Note: Legacy mock removed - fetchDashboardData is now implemented at the top as a real API call
