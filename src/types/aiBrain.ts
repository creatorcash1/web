// ─── AI Brain Types ──────────────────────────────────────────────────────────
// Fully-typed interfaces for the Revenue-Optimized AI Brain.
// Covers all 6 agents: Behavior Analyzer, Upsell Strategist, Churn Predictor,
// Content Generator, Revenue Optimizer, Admin Insight Reporter.
// Follows AGENTS.md agent definitions and APIBACKEND.md schema.
// ─────────────────────────────────────────────────────────────────────────────

import type { PaymentStatus, PaymentMethod, BookingStatus } from "./dashboard";

export type { PaymentStatus, PaymentMethod, BookingStatus };

// ─── Agent Input ────────────────────────────────────────────────────────────

/** Raw user data fed into the AI Brain pipeline */
export interface AIBrainInput {
  userId: string;
  fullName: string;
  email: string;
  enrolledCourses: AIEnrolledCourse[];
  purchasedPDFs: AIPurchasedPDF[];
  mentorshipBooked: boolean;
  mentorshipCompleted: boolean;
  liveSessionsAttended: number;
  lastLogin: string; // ISO timestamp
  totalSpent: number;
  accountAge: number; // days since signup
  lastPurchaseDate: string | null;
  paymentHistory: AIPaymentRecord[];
}

export interface AIEnrolledCourse {
  courseId: string;
  title: string;
  progress: number; // 0-100
  enrolledAt: string;
  lastAccessedAt: string | null;
  completedAt: string | null;
}

export interface AIPurchasedPDF {
  pdfId: string;
  title: string;
  purchasedAt: string;
  downloaded: boolean;
}

export interface AIPaymentRecord {
  id: string;
  amount: number;
  date: string;
  itemType: "course" | "pdf" | "mentorship" | "bundle";
  status: PaymentStatus;
}

// ─── Agent Outputs ──────────────────────────────────────────────────────────

/** Behavior Analyzer: engagement scoring */
export interface BehaviorAnalysis {
  engagementScore: number; // 0-100
  activityLevel: "inactive" | "low" | "moderate" | "high" | "power-user";
  courseCompletionRate: number; // 0-100 avg across courses
  avgDaysBetweenLogins: number;
  topEngagedCourse: string | null;
  signals: BehaviorSignal[];
}

export interface BehaviorSignal {
  type: "progress_stall" | "frequent_login" | "binge_learning" | "inactive" | "new_purchase" | "course_completed";
  description: string;
  timestamp: string;
  severity: "info" | "warning" | "positive";
}

/** Upsell Strategist: product recommendations */
export interface UpsellRecommendation {
  recommendedProducts: RecommendedProduct[];
  reason: string;
  confidence: number; // 0-1
  maxRecommendationsShown: number; // always 1 per session
}

export interface RecommendedProduct {
  productId: string;
  productType: "course" | "pdf" | "mentorship" | "bundle";
  title: string;
  reason: string;
  price: number;
  discountedPrice: number | null;
  priority: number; // 1 = highest
}

/** Churn Predictor: risk assessment */
export interface ChurnPrediction {
  riskLevel: "low" | "medium" | "high";
  riskScore: number; // 0-100
  riskFactors: RiskFactor[];
  retentionAction: RetentionAction | null;
}

export interface RiskFactor {
  factor: string;
  weight: number; // 0-1, impact on score
  description: string;
}

export interface RetentionAction {
  type: "discount" | "free_mentorship_slot" | "email_nudge" | "progress_reminder" | "exclusive_content";
  description: string;
  discountPercent: number | null;
  urgency: "immediate" | "within_24h" | "within_week";
}

/** Content Generator: personalized messaging */
export interface GeneratedContent {
  messages: AIMessage[];
  htmlEmails: HTMLEmailTemplate[];
  campaigns: EmailCampaign[];
}

export interface AIMessage {
  id: string;
  type: "email" | "notification" | "banner" | "popup" | "sms";
  subject: string | null;
  content: string;
  cta: string | null;
  ctaUrl: string | null;
  tone: "encouraging" | "urgent" | "celebratory" | "educational";
  scheduledFor: string | null; // ISO — null means immediate
}

/** Branded HTML email template */
export interface HTMLEmailTemplate {
  id: string;
  subject: string;
  preheader: string;
  html: string; // Full responsive HTML with inline CSS
  plainText: string;
  category: "onboarding" | "retention" | "upsell" | "milestone" | "reengagement";
  scheduledFor: string | null;
}

/** Multi-step email campaign / drip sequence */
export interface EmailCampaign {
  campaignId: string;
  name: string;
  trigger: CampaignTrigger;
  status: "active" | "draft" | "paused";
  steps: CampaignStep[];
  enrolledUsers: number;
  completionRate: number; // 0-100
}

export type CampaignTrigger =
  | { type: "signup" }
  | { type: "inactivity"; days: number }
  | { type: "course_completion"; courseId: string }
  | { type: "purchase"; itemType: "course" | "pdf" | "mentorship" | "bundle" }
  | { type: "milestone"; event: string }
  | { type: "churn_risk"; riskLevel: "medium" | "high" };

export interface CampaignStep {
  stepNumber: number;
  delayDays: number; // days after trigger (or previous step)
  emailTemplateId: string;
  subject: string;
  summary: string; // brief description of what this step does
  openRate: number; // 0-100 simulated
  clickRate: number; // 0-100 simulated
}

/** Revenue Optimizer: pricing & bundle suggestions */
export interface RevenueOptimization {
  suggestedPriceBundles: SuggestedBundle[];
  estimatedRevenueImpact: number; // projected $ increase
  dynamicPricingEnabled: boolean;
  forecast: RevenueForecast;
  productPerformance: ProductPerformance[];
}

export interface SuggestedBundle {
  bundleId: string;
  products: string[]; // product IDs
  originalTotal: number;
  bundlePrice: number;
  savingsPercent: number;
  targetAudience: string;
  conversionLikelihood: number; // 0-1
}

/** 30/60/90-day revenue projection */
export interface RevenueForecast {
  periods: ForecastPeriod[];
  totalProjected: number;
  confidence: number; // 0-1
  assumptions: string[];
}

export interface ForecastPeriod {
  label: string; // "30-day", "60-day", "90-day"
  days: number;
  projectedRevenue: number;
  projectedNewUsers: number;
  projectedConversions: number;
  growthRate: number; // percent
}

/** Per-product revenue analytics */
export interface ProductPerformance {
  productId: string;
  title: string;
  type: "course" | "pdf" | "mentorship" | "bundle";
  totalRevenue: number;
  totalSales: number;
  conversionRate: number; // 0-100
  avgRating: number; // 1-5
  completionRate: number; // 0-100 (courses only)
  rank: number; // 1 = top performer
  trend: "up" | "down" | "flat";
}

/** Admin Insight Reporter: KPI summaries */
export interface AdminInsights {
  insights: InsightItem[];
  alerts: AdminAlert[];
  recommendations: AdminRecommendation[];
}

export interface InsightItem {
  metric: string;
  value: number;
  formattedValue: string;
  trend: "up" | "down" | "flat";
  changePercent: number;
  period: string;
}

export interface AdminAlert {
  id: string;
  severity: "info" | "warning" | "critical";
  title: string;
  description: string;
  actionLabel: string | null;
  timestamp: string;
}

export interface AdminRecommendation {
  id: string;
  category: "pricing" | "content" | "engagement" | "product" | "retention";
  title: string;
  description: string;
  impact: "low" | "medium" | "high";
  effort: "low" | "medium" | "high";
}

// ─── Achievements / Gamification ────────────────────────────────────────────

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji
  category: "progress" | "engagement" | "purchase" | "milestone" | "social";
  earnedAt: string | null; // null = locked
  progress: number; // 0-100 toward earning
}

// ─── Personalized Dashboard Widgets ─────────────────────────────────────────

/** AI-generated personalized widget data for user dashboard */
export interface PersonalizedWidgets {
  aiGreeting: string; // Personalized AI-generated greeting based on behavior
  nextRecommendedCourse: NextCourseWidget | null;
  progressSummary: ProgressSummaryWidget;
  achievements: Achievement[];
  liveSessionCountdown: LiveSessionWidget | null;
  weeklyGoal: WeeklyGoalWidget;
}

export interface NextCourseWidget {
  courseId: string;
  title: string;
  reason: string; // why AI recommends this
  price: number;
  matchScore: number; // 0-100 how well it matches user's interests
}

export interface ProgressSummaryWidget {
  totalCoursesEnrolled: number;
  totalCompleted: number;
  currentStreak: number; // days in a row active
  percentileRank: number; // top X% of users
  nearestMilestone: string; // "Complete UGC Mastery (15% away)"
}

export interface LiveSessionWidget {
  sessionId: string;
  title: string;
  scheduledDate: string;
  hoursUntil: number;
}

export interface WeeklyGoalWidget {
  targetLessons: number;
  completedLessons: number;
  percentComplete: number;
  motivationMessage: string;
}

// ─── Combined AI Brain Output ───────────────────────────────────────────────

/** Full orchestrated output from the AI Brain pipeline */
export interface AIBrainOutput {
  userId: string;
  fullName: string;
  generatedAt: string; // ISO timestamp
  behavior: BehaviorAnalysis;
  upsell: UpsellRecommendation;
  churn: ChurnPrediction;
  content: GeneratedContent;
  revenue: RevenueOptimization;
  adminInsights: AdminInsights;
  widgets: PersonalizedWidgets;
  achievements: Achievement[];
}

// ─── AI Brain Dashboard Data ────────────────────────────────────────────────

/** Aggregated data for the AI Brain admin section */
export interface AIBrainDashboardData {
  /** Per-user AI outputs (latest for each user) */
  userProfiles: AIBrainOutput[];
  /** Global aggregate insights */
  globalInsights: AdminInsights;
  /** System health */
  brainHealth: AIBrainHealth;
  /** Revenue forecasting */
  forecast: RevenueForecast;
  /** Product performance rankings */
  productPerformance: ProductPerformance[];
  /** Email campaigns */
  campaigns: EmailCampaign[];
}

export interface AIBrainHealth {
  status: "operational" | "degraded" | "offline";
  lastRun: string;
  totalUsersAnalyzed: number;
  avgProcessingTimeMs: number;
  cacheHitRate: number; // 0-100
  apiCallsToday: number;
  apiCallsLimit: number;
}
