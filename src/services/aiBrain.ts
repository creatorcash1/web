// ─── AI Brain Service Layer ──────────────────────────────────────────────────
// Mock data + fetch functions consumed by React Query.
// Converts admin/dashboard user data → AIBrainInput, runs the engine pipeline,
// and returns typed outputs. All computations are deterministic & client-side.
// Cache: 5 min staleTime via React Query config in Providers.tsx.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  AIBrainInput,
  AIBrainOutput,
  AIBrainDashboardData,
  AIBrainHealth,
  EmailCampaign,
} from "@/types/aiBrain";
import {
  runAIBrainPipeline,
  reportAdminInsights,
  analyzeBehavior,
  predictChurn,
  computeGlobalProductPerformance,
  computeGlobalForecast,
} from "./aiBrainEngine";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── Mock AI Brain Inputs (modelling 8 platform users) ──────────────────────

const MOCK_AI_INPUTS: AIBrainInput[] = [
  {
    userId: "u-001",
    fullName: "Jordan Mitchell",
    email: "jordan@example.com",
    enrolledCourses: [
      { courseId: "c-001", title: "UGC Mastery", progress: 75, enrolledAt: "2024-12-05T08:00:00Z", lastAccessedAt: "2025-01-10T14:00:00Z", completedAt: null },
      { courseId: "c-002", title: "TikTok Shop Blueprint", progress: 40, enrolledAt: "2024-12-10T09:00:00Z", lastAccessedAt: "2025-01-08T11:00:00Z", completedAt: null },
      { courseId: "c-003", title: "Dropshipping Accelerator", progress: 90, enrolledAt: "2025-01-02T12:00:00Z", lastAccessedAt: "2025-01-12T10:00:00Z", completedAt: null },
    ],
    purchasedPDFs: [
      { pdfId: "p-001", title: "Creator Monetization Cheat Sheet", purchasedAt: "2024-12-20T10:00:00Z", downloaded: true },
    ],
    mentorshipBooked: true,
    mentorshipCompleted: false,
    liveSessionsAttended: 3,
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2h ago
    totalSpent: 547,
    accountAge: 120,
    lastPurchaseDate: "2025-01-02T12:00:00Z",
    paymentHistory: [
      { id: "pay-001", amount: 399, date: "2024-12-05T08:00:00Z", itemType: "bundle", status: "success" },
      { id: "pay-002", amount: 29, date: "2024-12-20T10:00:00Z", itemType: "pdf", status: "success" },
      { id: "pay-003", amount: 119, date: "2025-01-02T12:00:00Z", itemType: "course", status: "success" },
    ],
  },
  {
    userId: "u-002",
    fullName: "Samantha Lee",
    email: "sam.lee@example.com",
    enrolledCourses: [
      { courseId: "c-001", title: "UGC Mastery", progress: 100, enrolledAt: "2024-10-02T08:15:00Z", lastAccessedAt: "2024-12-01T09:00:00Z", completedAt: "2024-12-01T09:00:00Z" },
      { courseId: "c-002", title: "TikTok Shop Blueprint", progress: 100, enrolledAt: "2024-10-15T09:00:00Z", lastAccessedAt: "2024-12-15T11:00:00Z", completedAt: "2024-12-15T11:00:00Z" },
      { courseId: "c-003", title: "Dropshipping Accelerator", progress: 65, enrolledAt: "2024-11-01T08:00:00Z", lastAccessedAt: "2025-01-11T14:00:00Z", completedAt: null },
      { courseId: "c-004", title: "Digital Product Empire", progress: 85, enrolledAt: "2024-11-20T10:00:00Z", lastAccessedAt: "2025-01-12T08:00:00Z", completedAt: null },
      { courseId: "c-005", title: "Platform Owner Playbook", progress: 30, enrolledAt: "2024-12-10T12:00:00Z", lastAccessedAt: "2025-01-09T16:00:00Z", completedAt: null },
    ],
    purchasedPDFs: [
      { pdfId: "p-001", title: "Creator Monetization Cheat Sheet", purchasedAt: "2024-10-05T08:00:00Z", downloaded: true },
      { pdfId: "p-002", title: "Brand Deal Email Templates", purchasedAt: "2024-10-20T10:00:00Z", downloaded: true },
      { pdfId: "p-003", title: "TikTok Algorithm Decoded", purchasedAt: "2024-11-15T09:00:00Z", downloaded: true },
    ],
    mentorshipBooked: true,
    mentorshipCompleted: true,
    liveSessionsAttended: 5,
    lastLogin: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    totalSpent: 1249,
    accountAge: 105,
    lastPurchaseDate: "2024-12-10T12:00:00Z",
    paymentHistory: [
      { id: "pay-004", amount: 799, date: "2024-10-02T08:15:00Z", itemType: "bundle", status: "success" },
      { id: "pay-005", amount: 19, date: "2024-10-20T10:00:00Z", itemType: "pdf", status: "success" },
      { id: "pay-006", amount: 39, date: "2024-11-15T09:00:00Z", itemType: "pdf", status: "success" },
      { id: "pay-007", amount: 349, date: "2024-12-10T12:00:00Z", itemType: "course", status: "success" },
    ],
  },
  {
    userId: "u-003",
    fullName: "Marcus Chen",
    email: "marcus.c@example.com",
    enrolledCourses: [
      { courseId: "c-001", title: "UGC Mastery", progress: 55, enrolledAt: "2024-10-20T16:45:00Z", lastAccessedAt: "2024-12-15T10:00:00Z", completedAt: null },
      { courseId: "c-004", title: "Digital Product Empire", progress: 20, enrolledAt: "2024-11-10T08:00:00Z", lastAccessedAt: "2024-12-01T14:00:00Z", completedAt: null },
    ],
    purchasedPDFs: [
      { pdfId: "p-001", title: "Creator Monetization Cheat Sheet", purchasedAt: "2024-10-25T08:00:00Z", downloaded: false },
    ],
    mentorshipBooked: false,
    mentorshipCompleted: false,
    liveSessionsAttended: 1,
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(), // 21 days ago
    totalSpent: 398,
    accountAge: 85,
    lastPurchaseDate: "2024-11-10T08:00:00Z",
    paymentHistory: [
      { id: "pay-008", amount: 199, date: "2024-10-20T16:45:00Z", itemType: "course", status: "success" },
      { id: "pay-009", amount: 199, date: "2024-11-10T08:00:00Z", itemType: "course", status: "success" },
    ],
  },
  {
    userId: "u-004",
    fullName: "Priya Patel",
    email: "priya@example.com",
    enrolledCourses: [
      { courseId: "c-001", title: "UGC Mastery", progress: 100, enrolledAt: "2024-11-05T12:00:00Z", lastAccessedAt: "2025-01-05T09:00:00Z", completedAt: "2025-01-05T09:00:00Z" },
      { courseId: "c-002", title: "TikTok Shop Blueprint", progress: 70, enrolledAt: "2024-11-20T10:00:00Z", lastAccessedAt: "2025-01-11T15:00:00Z", completedAt: null },
      { courseId: "c-003", title: "Dropshipping Accelerator", progress: 45, enrolledAt: "2024-12-05T08:00:00Z", lastAccessedAt: "2025-01-10T11:00:00Z", completedAt: null },
      { courseId: "c-005", title: "Platform Owner Playbook", progress: 15, enrolledAt: "2025-01-01T10:00:00Z", lastAccessedAt: "2025-01-08T16:00:00Z", completedAt: null },
    ],
    purchasedPDFs: [
      { pdfId: "p-001", title: "Creator Monetization Cheat Sheet", purchasedAt: "2024-11-08T08:00:00Z", downloaded: true },
      { pdfId: "p-002", title: "Brand Deal Email Templates", purchasedAt: "2024-12-01T10:00:00Z", downloaded: true },
    ],
    mentorshipBooked: false,
    mentorshipCompleted: false,
    liveSessionsAttended: 4,
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5h ago
    totalSpent: 897,
    accountAge: 70,
    lastPurchaseDate: "2025-01-01T10:00:00Z",
    paymentHistory: [
      { id: "pay-010", amount: 399, date: "2024-11-05T12:00:00Z", itemType: "bundle", status: "success" },
      { id: "pay-011", amount: 19, date: "2024-12-01T10:00:00Z", itemType: "pdf", status: "success" },
      { id: "pay-012", amount: 349, date: "2025-01-01T10:00:00Z", itemType: "course", status: "success" },
    ],
  },
  {
    userId: "u-005",
    fullName: "Tyler Brooks",
    email: "tyler.b@example.com",
    enrolledCourses: [
      { courseId: "c-001", title: "UGC Mastery", progress: 10, enrolledAt: "2024-11-15T09:20:00Z", lastAccessedAt: "2024-11-20T14:00:00Z", completedAt: null },
    ],
    purchasedPDFs: [],
    mentorshipBooked: false,
    mentorshipCompleted: false,
    liveSessionsAttended: 0,
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(), // 45 days ago
    totalSpent: 199,
    accountAge: 60,
    lastPurchaseDate: "2024-11-15T09:20:00Z",
    paymentHistory: [
      { id: "pay-013", amount: 199, date: "2024-11-15T09:20:00Z", itemType: "course", status: "success" },
    ],
  },
  {
    userId: "u-006",
    fullName: "Elena Rodriguez",
    email: "elena.r@example.com",
    enrolledCourses: [
      { courseId: "c-002", title: "TikTok Shop Blueprint", progress: 95, enrolledAt: "2024-12-01T11:10:00Z", lastAccessedAt: "2025-01-12T09:00:00Z", completedAt: null },
      { courseId: "c-003", title: "Dropshipping Accelerator", progress: 60, enrolledAt: "2024-12-15T08:00:00Z", lastAccessedAt: "2025-01-11T14:00:00Z", completedAt: null },
      { courseId: "c-004", title: "Digital Product Empire", progress: 35, enrolledAt: "2025-01-02T10:00:00Z", lastAccessedAt: "2025-01-10T16:00:00Z", completedAt: null },
    ],
    purchasedPDFs: [
      { pdfId: "p-003", title: "TikTok Algorithm Decoded", purchasedAt: "2024-12-05T08:00:00Z", downloaded: true },
    ],
    mentorshipBooked: false,
    mentorshipCompleted: false,
    liveSessionsAttended: 3,
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3h ago
    totalSpent: 746,
    accountAge: 44,
    lastPurchaseDate: "2025-01-02T10:00:00Z",
    paymentHistory: [
      { id: "pay-014", amount: 249, date: "2024-12-01T11:10:00Z", itemType: "course", status: "success" },
      { id: "pay-015", amount: 299, date: "2024-12-15T08:00:00Z", itemType: "course", status: "success" },
      { id: "pay-016", amount: 199, date: "2025-01-02T10:00:00Z", itemType: "course", status: "success" },
    ],
  },
  {
    userId: "u-008",
    fullName: "Aisha Johnson",
    email: "aisha.j@example.com",
    enrolledCourses: [
      { courseId: "c-001", title: "UGC Mastery", progress: 50, enrolledAt: "2024-12-18T14:30:00Z", lastAccessedAt: "2025-01-07T10:00:00Z", completedAt: null },
      { courseId: "c-005", title: "Platform Owner Playbook", progress: 25, enrolledAt: "2025-01-05T08:00:00Z", lastAccessedAt: "2025-01-09T12:00:00Z", completedAt: null },
    ],
    purchasedPDFs: [
      { pdfId: "p-002", title: "Brand Deal Email Templates", purchasedAt: "2024-12-20T10:00:00Z", downloaded: true },
    ],
    mentorshipBooked: false,
    mentorshipCompleted: false,
    liveSessionsAttended: 2,
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    totalSpent: 448,
    accountAge: 27,
    lastPurchaseDate: "2025-01-05T08:00:00Z",
    paymentHistory: [
      { id: "pay-017", amount: 199, date: "2024-12-18T14:30:00Z", itemType: "course", status: "success" },
      { id: "pay-018", amount: 19, date: "2024-12-20T10:00:00Z", itemType: "pdf", status: "success" },
      { id: "pay-019", amount: 349, date: "2025-01-05T08:00:00Z", itemType: "course", status: "success" },
    ],
  },
];

// ─── Fetch Functions ────────────────────────────────────────────────────────

/** Run AI Brain pipeline for a single user (user dashboard) */
export async function fetchAIBrainForUser(userId: string): Promise<AIBrainOutput | null> {
  await delay(300);

  const input = MOCK_AI_INPUTS.find((u) => u.userId === userId);
  if (!input) return null;

  return runAIBrainPipeline(input);
}

/** Run AI Brain pipeline for all users (admin AI Brain section) */
export async function fetchAIBrainDashboard(): Promise<AIBrainDashboardData> {
  await delay(500);

  const startTime = Date.now();
  const userProfiles = MOCK_AI_INPUTS.map((input) => runAIBrainPipeline(input));
  const processingTime = Date.now() - startTime;

  // Aggregate for admin insights
  const allData = MOCK_AI_INPUTS.map((input) => ({
    input,
    behavior: analyzeBehavior(input),
    churn: predictChurn(input, analyzeBehavior(input)),
  }));

  const globalInsights = reportAdminInsights(allData);

  // Global forecasting & product performance
  const forecast = computeGlobalForecast(MOCK_AI_INPUTS);
  const productPerformance = computeGlobalProductPerformance(MOCK_AI_INPUTS);

  // Aggregate all campaigns across users (deduplicate by campaign name)
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
    totalUsersAnalyzed: MOCK_AI_INPUTS.length,
    avgProcessingTimeMs: Math.round(processingTime / MOCK_AI_INPUTS.length),
    cacheHitRate: 78,
    apiCallsToday: 142,
    apiCallsLimit: 1000,
  };

  return { userProfiles, globalInsights, brainHealth, forecast, productPerformance, campaigns };
}
