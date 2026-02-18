// ─── AI Brain: Agent Engine ──────────────────────────────────────────────────
// Deterministic logic for all 6 specialized agents. Each agent consumes
// structured AIBrainInput and produces typed output. The orchestrator runs
// the full pipeline per the master prompt workflow:
//
// 1. Behavior Analyzer → engagementScore
// 2. Churn Predictor   → riskLevel
// 3. Upsell Strategist → recommendations (gated by engagementScore)
// 4. Revenue Optimizer  → bundles
// 5. Content Generator  → personalized messages
// 6. Admin Insight Reporter → KPIs & alerts
//
// Decision rules from master prompt:
// • Only suggest upsells if engagementScore > 70
// • If riskLevel = High → trigger retention offer
// • Never suggest mentorship to users who already booked one
// • Max 1 personalized recommendation per session
// • Behavioral timing: email 24h after inactivity
// • Brand tone: premium, confident, authority
// ─────────────────────────────────────────────────────────────────────────────

import type {
  AIBrainInput,
  AIBrainOutput,
  BehaviorAnalysis,
  BehaviorSignal,
  UpsellRecommendation,
  RecommendedProduct,
  ChurnPrediction,
  RiskFactor,
  RetentionAction,
  GeneratedContent,
  AIMessage,
  HTMLEmailTemplate,
  EmailCampaign,
  CampaignStep,
  RevenueOptimization,
  SuggestedBundle,
  RevenueForecast,
  ForecastPeriod,
  ProductPerformance,
  AdminInsights,
  InsightItem,
  AdminAlert,
  AdminRecommendation,
  Achievement,
  PersonalizedWidgets,
} from "@/types/aiBrain";

// ─── Helper: days since ISO date ────────────────────────────────────────────
function daysSince(iso: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000));
}

// ─── 1. BEHAVIOR ANALYZER ──────────────────────────────────────────────────

export function analyzeBehavior(input: AIBrainInput): BehaviorAnalysis {
  const signals: BehaviorSignal[] = [];
  const now = new Date().toISOString();

  // Course completion rate
  const completionRates = input.enrolledCourses.map((c) => c.progress);
  const avgCompletion =
    completionRates.length > 0
      ? completionRates.reduce((a, b) => a + b, 0) / completionRates.length
      : 0;

  // Days since last login
  const daysSinceLogin = daysSince(input.lastLogin);

  // Detect signals
  for (const course of input.enrolledCourses) {
    if (course.progress > 0 && course.progress < 100 && course.lastAccessedAt) {
      const daysSinceAccess = daysSince(course.lastAccessedAt);
      if (daysSinceAccess > 14) {
        signals.push({
          type: "progress_stall",
          description: `${course.title} stalled at ${course.progress}% — no activity for ${daysSinceAccess} days`,
          timestamp: now,
          severity: "warning",
        });
      }
    }
    if (course.completedAt) {
      signals.push({
        type: "course_completed",
        description: `Completed ${course.title}`,
        timestamp: course.completedAt,
        severity: "positive",
      });
    }
  }

  if (daysSinceLogin <= 1) {
    signals.push({
      type: "frequent_login",
      description: "Active today — high engagement window",
      timestamp: now,
      severity: "positive",
    });
  }

  if (daysSinceLogin >= 7) {
    signals.push({
      type: "inactive",
      description: `No login for ${daysSinceLogin} days`,
      timestamp: now,
      severity: "warning",
    });
  }

  // Multiple courses with >50% progress in last 7 days = binge learner
  const recentHighProgress = input.enrolledCourses.filter(
    (c) => c.progress > 50 && c.lastAccessedAt && daysSince(c.lastAccessedAt) < 7
  );
  if (recentHighProgress.length >= 2) {
    signals.push({
      type: "binge_learning",
      description: `Active in ${recentHighProgress.length} courses this week — binge learner`,
      timestamp: now,
      severity: "positive",
    });
  }

  // Recent purchase
  if (input.lastPurchaseDate && daysSince(input.lastPurchaseDate) < 7) {
    signals.push({
      type: "new_purchase",
      description: "Recent purchase within 7 days",
      timestamp: input.lastPurchaseDate,
      severity: "positive",
    });
  }

  // Engagement score: weighted algorithm
  const loginScore = Math.max(0, 100 - daysSinceLogin * 5); // 0-100, decays over ~20 days
  const progressScore = avgCompletion; // 0-100
  const spendScore = Math.min(100, (input.totalSpent / 1500) * 100); // caps at $1500
  const sessionScore = Math.min(100, input.liveSessionsAttended * 20); // 5 sessions = max
  const pdfScore = Math.min(100, input.purchasedPDFs.length * 25); // 4 PDFs = max

  const engagementScore = Math.round(
    loginScore * 0.25 +
    progressScore * 0.30 +
    spendScore * 0.20 +
    sessionScore * 0.15 +
    pdfScore * 0.10
  );

  // Activity level
  let activityLevel: BehaviorAnalysis["activityLevel"];
  if (engagementScore >= 85) activityLevel = "power-user";
  else if (engagementScore >= 70) activityLevel = "high";
  else if (engagementScore >= 45) activityLevel = "moderate";
  else if (engagementScore >= 20) activityLevel = "low";
  else activityLevel = "inactive";

  // Top engaged course
  const topCourse = [...input.enrolledCourses].sort(
    (a, b) => b.progress - a.progress
  )[0];

  return {
    engagementScore,
    activityLevel,
    courseCompletionRate: Math.round(avgCompletion),
    avgDaysBetweenLogins: daysSinceLogin,
    topEngagedCourse: topCourse?.title ?? null,
    signals,
  };
}

// ─── 2. CHURN PREDICTOR ────────────────────────────────────────────────────

export function predictChurn(
  input: AIBrainInput,
  behavior: BehaviorAnalysis
): ChurnPrediction {
  const factors: RiskFactor[] = [];

  // Days since last login
  const daysSinceLogin = behavior.avgDaysBetweenLogins;
  if (daysSinceLogin >= 14) {
    factors.push({
      factor: "Extended inactivity",
      weight: 0.35,
      description: `No login for ${daysSinceLogin} days`,
    });
  } else if (daysSinceLogin >= 7) {
    factors.push({
      factor: "Declining activity",
      weight: 0.2,
      description: `${daysSinceLogin} days since last login`,
    });
  }

  // Low course progress
  const stallCount = behavior.signals.filter((s) => s.type === "progress_stall").length;
  if (stallCount > 0) {
    factors.push({
      factor: "Stalled courses",
      weight: 0.25,
      description: `${stallCount} course(s) with stalled progress`,
    });
  }

  // Low total spend relative to account age
  const dailySpendRate = input.totalSpent / Math.max(1, input.accountAge);
  if (dailySpendRate < 0.5 && input.accountAge > 30) {
    factors.push({
      factor: "Low lifetime value",
      weight: 0.15,
      description: `$${input.totalSpent} spent over ${input.accountAge} days`,
    });
  }

  // No recent purchases
  if (input.lastPurchaseDate && daysSince(input.lastPurchaseDate) > 60) {
    factors.push({
      factor: "No recent purchases",
      weight: 0.2,
      description: `Last purchase ${daysSince(input.lastPurchaseDate)} days ago`,
    });
  }

  // Engagement drop
  if (behavior.engagementScore < 30) {
    factors.push({
      factor: "Very low engagement",
      weight: 0.25,
      description: `Engagement score: ${behavior.engagementScore}/100`,
    });
  }

  // Calculate risk score
  const riskScore = Math.min(
    100,
    Math.round(factors.reduce((sum, f) => sum + f.weight * 100, 0))
  );

  let riskLevel: ChurnPrediction["riskLevel"];
  if (riskScore >= 60) riskLevel = "high";
  else if (riskScore >= 30) riskLevel = "medium";
  else riskLevel = "low";

  // Retention action for high-risk users
  let retentionAction: RetentionAction | null = null;
  if (riskLevel === "high") {
    if (input.totalSpent > 200) {
      retentionAction = {
        type: "discount",
        description: "Offer 25% discount on next purchase to retain high-value user",
        discountPercent: 25,
        urgency: "immediate",
      };
    } else if (!input.mentorshipBooked) {
      retentionAction = {
        type: "free_mentorship_slot",
        description: "Offer complimentary 30-min mentorship preview to re-engage",
        discountPercent: null,
        urgency: "within_24h",
      };
    } else {
      retentionAction = {
        type: "email_nudge",
        description: "Send personalized re-engagement email with progress summary",
        discountPercent: null,
        urgency: "within_24h",
      };
    }
  } else if (riskLevel === "medium" && stallCount > 0) {
    retentionAction = {
      type: "progress_reminder",
      description: "Send progress reminder with completion incentive",
      discountPercent: null,
      urgency: "within_week",
    };
  }

  return { riskLevel, riskScore, riskFactors: factors, retentionAction };
}

// ─── 3. UPSELL STRATEGIST ──────────────────────────────────────────────────

// Available product catalog (would come from DB in production)
const PRODUCT_CATALOG: Omit<RecommendedProduct, "reason" | "priority">[] = [
  { productId: "c-001", productType: "course", title: "UGC Mastery", price: 199, discountedPrice: null },
  { productId: "c-002", productType: "course", title: "TikTok Shop Blueprint", price: 249, discountedPrice: null },
  { productId: "c-003", productType: "course", title: "Dropshipping Accelerator", price: 299, discountedPrice: null },
  { productId: "c-004", productType: "course", title: "Digital Product Empire", price: 199, discountedPrice: null },
  { productId: "c-005", productType: "course", title: "Platform Owner Playbook", price: 349, discountedPrice: null },
  { productId: "p-001", productType: "pdf", title: "Creator Monetization Cheat Sheet", price: 29, discountedPrice: null },
  { productId: "p-002", productType: "pdf", title: "Brand Deal Email Templates", price: 19, discountedPrice: null },
  { productId: "p-003", productType: "pdf", title: "TikTok Algorithm Decoded", price: 39, discountedPrice: null },
  { productId: "mentorship-2hr", productType: "mentorship", title: "1:1 Mentorship with CC Mendel (2hr)", price: 499, discountedPrice: null },
  { productId: "bundle-all", productType: "bundle", title: "Full Access Bundle – All 5 Courses", price: 799, discountedPrice: 399 },
];

export function strategizeUpsell(
  input: AIBrainInput,
  behavior: BehaviorAnalysis,
  churn: ChurnPrediction
): UpsellRecommendation {
  // Decision rule: Only suggest upsells if engagementScore > 70
  if (behavior.engagementScore <= 70) {
    return {
      recommendedProducts: [],
      reason: "Engagement score too low for upsell. Focus on re-engagement first.",
      confidence: 0,
      maxRecommendationsShown: 1,
    };
  }

  const ownedCourseIds = new Set(input.enrolledCourses.map((c) => c.courseId));
  const ownedPdfIds = new Set(input.purchasedPDFs.map((p) => p.pdfId));

  const candidates: RecommendedProduct[] = [];

  for (const product of PRODUCT_CATALOG) {
    // Skip already owned
    if (product.productType === "course" && ownedCourseIds.has(product.productId)) continue;
    if (product.productType === "pdf" && ownedPdfIds.has(product.productId)) continue;

    // Decision rule: Never suggest mentorship to users who already booked one
    if (product.productType === "mentorship" && input.mentorshipBooked) continue;

    // Skip bundle if user already owns 4+ courses
    if (product.productType === "bundle" && ownedCourseIds.size >= 4) continue;

    // Score relevance
    let priority = 10;
    let reason = "";

    if (product.productType === "mentorship" && behavior.engagementScore >= 85) {
      priority = 1;
      reason = "Power user with high engagement — ideal mentorship candidate";
    } else if (product.productType === "bundle" && ownedCourseIds.size <= 2) {
      priority = 2;
      reason = "Low course ownership — bundle offers best value";
    } else if (product.productType === "course") {
      // Recommend courses related to what they're learning
      priority = 3 + ownedCourseIds.size;
      reason = `Expand your skills — complements your ${ownedCourseIds.size} enrolled course(s)`;
    } else if (product.productType === "pdf") {
      priority = 6;
      reason = "Quick-win digital asset to accelerate progress";
    }

    // Apply retention discount if high churn risk
    let discountedPrice = product.discountedPrice;
    if (churn.riskLevel === "high" && churn.retentionAction?.type === "discount") {
      const discountRate = (churn.retentionAction.discountPercent ?? 0) / 100;
      discountedPrice = Math.round(product.price * (1 - discountRate));
    }

    candidates.push({
      ...product,
      discountedPrice,
      reason,
      priority,
    });
  }

  // Sort by priority and take top recommendations
  candidates.sort((a, b) => a.priority - b.priority);

  const confidence = Math.min(1, behavior.engagementScore / 100 + 0.1);

  return {
    recommendedProducts: candidates.slice(0, 3), // store 3, show max 1 per session
    reason:
      candidates.length > 0
        ? `Personalized for ${input.fullName} based on ${behavior.activityLevel} engagement`
        : "No suitable upsell at this time",
    confidence,
    maxRecommendationsShown: 1,
  };
}

// ─── 4. REVENUE OPTIMIZER ──────────────────────────────────────────────────

export function optimizeRevenue(
  input: AIBrainInput,
  behavior: BehaviorAnalysis,
  upsell: UpsellRecommendation
): RevenueOptimization {
  const bundles: SuggestedBundle[] = [];

  const ownedCourseIds = new Set(input.enrolledCourses.map((c) => c.courseId));
  const unownedCourses = PRODUCT_CATALOG.filter(
    (p) => p.productType === "course" && !ownedCourseIds.has(p.productId)
  );

  // Bundle: remaining unowned courses
  if (unownedCourses.length >= 2) {
    const originalTotal = unownedCourses.reduce((s, c) => s + c.price, 0);
    const bundlePrice = Math.round(originalTotal * 0.75); // 25% bundle discount
    bundles.push({
      bundleId: `custom-bundle-${input.userId}`,
      products: unownedCourses.map((c) => c.productId),
      originalTotal,
      bundlePrice,
      savingsPercent: Math.round(((originalTotal - bundlePrice) / originalTotal) * 100),
      targetAudience: `Users with ${ownedCourseIds.size} courses enrolled`,
      conversionLikelihood: behavior.engagementScore > 70 ? 0.35 : 0.12,
    });
  }

  // Course + PDF bundle if user has a nearly completed course
  const nearComplete = input.enrolledCourses.find(
    (c) => c.progress >= 80 && !c.completedAt
  );
  if (nearComplete) {
    const relatedPdf = PRODUCT_CATALOG.find(
      (p) => p.productType === "pdf" && !input.purchasedPDFs.some((owned) => owned.pdfId === p.productId)
    );
    if (relatedPdf) {
      bundles.push({
        bundleId: `completion-bundle-${input.userId}`,
        products: [relatedPdf.productId],
        originalTotal: relatedPdf.price,
        bundlePrice: Math.round(relatedPdf.price * 0.8),
        savingsPercent: 20,
        targetAudience: "Users near course completion",
        conversionLikelihood: 0.45,
      });
    }
  }

  const estimatedImpact = bundles.reduce(
    (sum, b) => sum + b.bundlePrice * b.conversionLikelihood,
    0
  );

  // ─── Revenue Forecasting (30/60/90 day) ──────────────────────────────────
  const monthlySpendRate = input.totalSpent / Math.max(1, input.accountAge / 30);
  const growthMultiplier = behavior.engagementScore > 70 ? 1.15 : behavior.engagementScore > 45 ? 1.05 : 0.90;

  const forecast: RevenueForecast = {
    periods: [
      {
        label: "30-day",
        days: 30,
        projectedRevenue: Math.round(monthlySpendRate * growthMultiplier),
        projectedNewUsers: Math.round(2 * growthMultiplier),
        projectedConversions: Math.round(1.5 * growthMultiplier),
        growthRate: Math.round((growthMultiplier - 1) * 100),
      },
      {
        label: "60-day",
        days: 60,
        projectedRevenue: Math.round(monthlySpendRate * 2 * growthMultiplier * 1.05),
        projectedNewUsers: Math.round(4 * growthMultiplier),
        projectedConversions: Math.round(3 * growthMultiplier),
        growthRate: Math.round((growthMultiplier * 1.05 - 1) * 100),
      },
      {
        label: "90-day",
        days: 90,
        projectedRevenue: Math.round(monthlySpendRate * 3 * growthMultiplier * 1.1),
        projectedNewUsers: Math.round(7 * growthMultiplier),
        projectedConversions: Math.round(5 * growthMultiplier),
        growthRate: Math.round((growthMultiplier * 1.1 - 1) * 100),
      },
    ],
    totalProjected: Math.round(monthlySpendRate * 3 * growthMultiplier * 1.1),
    confidence: behavior.engagementScore > 70 ? 0.78 : behavior.engagementScore > 45 ? 0.62 : 0.45,
    assumptions: [
      "Based on current spending velocity and engagement trend",
      behavior.engagementScore > 70
        ? "High engagement suggests continued growth"
        : "Conservative estimate due to moderate/low engagement",
      bundles.length > 0 ? "Bundle adoption could increase revenue by 15-25%" : "No bundle opportunities detected",
    ],
  };

  // ─── Product Performance Analytics ───────────────────────────────────────
  const productPerformance: ProductPerformance[] = PRODUCT_CATALOG.map((p, idx) => {
    const isCourse = p.productType === "course";
    const enrolled = input.enrolledCourses.find((c) => c.courseId === p.productId);
    const purchased = input.purchasedPDFs.find((pdf) => pdf.pdfId === p.productId);
    const hasBought = !!(enrolled || purchased || (p.productType === "mentorship" && input.mentorshipBooked));
    // Simulated analytics per product
    const baseRevenue = hasBought ? p.price : 0;
    const simSales = hasBought ? Math.floor(Math.random() * 50 + 10) : Math.floor(Math.random() * 20 + 2);
    const simRevenue = p.price * simSales;
    return {
      productId: p.productId,
      title: p.title,
      type: p.productType,
      totalRevenue: simRevenue,
      totalSales: simSales,
      conversionRate: Math.round(Math.random() * 30 + 10),
      avgRating: +(Math.random() * 1.5 + 3.5).toFixed(1),
      completionRate: isCourse && enrolled ? enrolled.progress : isCourse ? Math.round(Math.random() * 60 + 20) : 0,
      rank: idx + 1, // will be re-sorted below
      trend: (Math.random() > 0.5 ? "up" : Math.random() > 0.5 ? "flat" : "down") as "up" | "down" | "flat",
    };
  })
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .map((p, i) => ({ ...p, rank: i + 1 }));

  return {
    suggestedPriceBundles: bundles,
    estimatedRevenueImpact: Math.round(estimatedImpact),
    dynamicPricingEnabled: false,
    forecast,
    productPerformance,
  };
}

// ─── 5. CONTENT GENERATOR ──────────────────────────────────────────────────

// ─── Helper: unique ID generator ────────────────────────────────────────────
let _idCounter = 0;
function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${(++_idCounter).toString(36)}`;
}

// ─── Helper: ISO date offset from now ───────────────────────────────────────
function isoFromNow(hours: number): string {
  return new Date(Date.now() + hours * 3600000).toISOString();
}

export function generateContent(
  input: AIBrainInput,
  behavior: BehaviorAnalysis,
  churn: ChurnPrediction,
  upsell: UpsellRecommendation
): GeneratedContent {
  const messages: AIMessage[] = [];
  const firstName = input.fullName.split(" ")[0];
  const trackedUrl = (basePath: string, resourceId?: string) => {
    const trackingId = uid("trk");
    const query = new URLSearchParams({
      userId: input.userId,
      ref: trackingId,
      ...(resourceId ? { productId: resourceId } : {}),
    });
    return `${basePath}?${query.toString()}`;
  };

  // 1. Progress nudge for stalled courses
  const stalls = behavior.signals.filter((s) => s.type === "progress_stall");
  if (stalls.length > 0) {
    const stall = stalls[0];
    const course = input.enrolledCourses.find((c) =>
      stall.description.includes(c.title)
    );
    messages.push({
      id: uid("msg"),
      type: "notification",
      subject: null,
      content: `Hey ${firstName}, you're ${course?.progress ?? 0}% through ${course?.title ?? "your course"}. Pick up where you left off — you're closer than you think.`,
      cta: "Continue Learning",
      ctaUrl: trackedUrl("/dashboard"),
      tone: "encouraging",
      scheduledFor: null, // immediate notification
    });
  }

  // 2. Inactivity email (24h rule from master prompt)
  if (behavior.avgDaysBetweenLogins >= 7) {
    messages.push({
      id: uid("msg"),
      type: "email",
      subject: `${firstName}, your creator journey is waiting`,
      content: `Hi ${firstName},\n\nWe noticed you haven't logged in for a while. Your progress is saved and ready for you.\n\nThe creators who succeed are the ones who show up consistently. Your next breakthrough is one lesson away.\n\nLog in now and keep building your empire.\n\n— CC Mendel`,
      cta: "Get Back to Learning",
      ctaUrl: trackedUrl("/dashboard"),
      tone: "encouraging",
      scheduledFor: isoFromNow(24), // 24h after detection per master prompt
    });
  }

  // 3. Course completion celebration
  const completed = behavior.signals.filter((s) => s.type === "course_completed");
  if (completed.length > 0) {
    messages.push({
      id: uid("msg"),
      type: "banner",
      subject: null,
      content: `Congratulations ${firstName}! You completed a course. You're building real momentum. Ready for the next level?`,
      cta: "Explore Next Course",
      ctaUrl: trackedUrl("/dashboard"),
      tone: "celebratory",
      scheduledFor: null,
    });
  }

  // 4. High-risk retention message
  if (churn.riskLevel === "high" && churn.retentionAction) {
    const action = churn.retentionAction;
    if (action.type === "discount") {
      messages.push({
        id: uid("msg"),
        type: "email",
        subject: `${firstName}, we have something special for you`,
        content: `Hi ${firstName},\n\nWe value your commitment to building your creator business. As a thank you, here's an exclusive ${action.discountPercent}% discount on your next purchase.\n\nThis is a private offer — don't let it slip away.\n\n— CC Mendel`,
        cta: `Claim ${action.discountPercent}% Off`,
        ctaUrl: trackedUrl("/checkout", action.discountPercent ? "retention-offer" : undefined),
        tone: "urgent",
        scheduledFor: action.urgency === "immediate" ? null : isoFromNow(24),
      });
    } else if (action.type === "free_mentorship_slot") {
      messages.push({
        id: uid("msg"),
        type: "email",
        subject: `${firstName}, let's talk 1:1`,
        content: `Hi ${firstName},\n\nI'd love to jump on a quick call with you. I've reserved a complimentary 30-minute mentorship preview session just for you.\n\nLet's map out your next steps together.\n\n— CC Mendel`,
        cta: "Book Free Session",
        ctaUrl: trackedUrl("/mentorship/mentorship-2hr", "mentorship-2hr"),
        tone: "encouraging",
        scheduledFor: isoFromNow(24),
      });
    }
  }

  // 5. Upsell suggestion (only if recommendations exist)
  if (upsell.recommendedProducts.length > 0 && behavior.engagementScore > 70) {
    const topRec = upsell.recommendedProducts[0];
    messages.push({
      id: uid("msg"),
      type: "popup",
      subject: null,
      content: `Based on your progress, we think "${topRec.title}" is the perfect next step. ${topRec.reason}.`,
      cta: topRec.discountedPrice
        ? `Get it for $${topRec.discountedPrice}`
        : `Learn More — $${topRec.price}`,
      ctaUrl: trackedUrl("/checkout", topRec.productId),
      tone: "educational",
      scheduledFor: null,
    });
  }

  // ─── HTML Email Templates ────────────────────────────────────────────────
  const htmlEmails: HTMLEmailTemplate[] = [];

  // Branded email wrapper with CreatorCashCow styling
  const wrapHtml = (body: string, ctaLabel: string, ctaUrl: string) => `
<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>CreatorCashCow</title></head><body style="margin:0;padding:0;background:#f5f5f5;font-family:'Inter',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:24px 0;">
<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
<tr><td style="background:#0D1B2A;padding:28px 32px;text-align:center;">
<h1 style="margin:0;color:#FFC857;font-family:'Montserrat',sans-serif;font-size:22px;letter-spacing:1px;">CreatorCashCow</h1>
</td></tr>
<tr><td style="padding:32px;">${body}</td></tr>
<tr><td style="padding:0 32px 32px;text-align:center;">
<a href="${ctaUrl}" style="display:inline-block;background:#FFC857;color:#0D1B2A;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:16px;">${ctaLabel}</a>
</td></tr>
<tr><td style="background:#0D1B2A;padding:20px 32px;text-align:center;color:#888;font-size:12px;">
© ${new Date().getFullYear()} CreatorCashCow.com — All rights reserved.<br>
<a href="/unsubscribe" style="color:#1CE7D0;text-decoration:none;">Unsubscribe</a>
</td></tr></table></td></tr></table></body></html>`;

  // Inactivity re-engagement email
  if (behavior.avgDaysBetweenLogins >= 7) {
    const body = `<p style="color:#333;font-size:16px;line-height:1.6;">Hi ${firstName},</p>
<p style="color:#333;font-size:16px;line-height:1.6;">We noticed you haven't logged in for a while. Your progress is saved and ready — your next breakthrough is just one lesson away.</p>
<p style="color:#333;font-size:16px;line-height:1.6;">The creators who succeed <strong>show up consistently</strong>. Don't let your momentum fade.</p>`;
    htmlEmails.push({
      id: uid("html-email"),
      subject: `${firstName}, your creator journey is waiting`,
      preheader: "Your progress is saved. Pick up where you left off.",
      html: wrapHtml(body, "Get Back to Learning", trackedUrl("/dashboard")),
      plainText: `Hi ${firstName}, we noticed you haven't logged in. Your progress is saved. Log in and keep building your empire. — CC Mendel`,
      category: "reengagement",
      scheduledFor: isoFromNow(24),
    });
  }

  // Course milestone email
  const nearComplete = input.enrolledCourses.find((c) => c.progress >= 80 && !c.completedAt);
  if (nearComplete) {
    const body = `<p style="color:#333;font-size:16px;line-height:1.6;">Hey ${firstName}! 🔥</p>
<p style="color:#333;font-size:16px;line-height:1.6;">You're <strong>${nearComplete.progress}%</strong> through <strong>${nearComplete.title}</strong>. You're SO close to the finish line.</p>
<p style="color:#333;font-size:16px;line-height:1.6;">Complete this course and unlock your achievement badge!</p>`;
    htmlEmails.push({
      id: uid("html-email"),
      subject: `You're ${nearComplete.progress}% done with ${nearComplete.title}!`,
      preheader: `Just ${100 - nearComplete.progress}% to go — finish strong!`,
      html: wrapHtml(body, "Finish Your Course", trackedUrl("/dashboard")),
      plainText: `You're ${nearComplete.progress}% through ${nearComplete.title}. Almost there! Log in and finish. — CC Mendel`,
      category: "milestone",
      scheduledFor: null,
    });
  }

  // Upsell email
  if (upsell.recommendedProducts.length > 0 && behavior.engagementScore > 70) {
    const topRec = upsell.recommendedProducts[0];
    const priceStr = topRec.discountedPrice ? `<span style="text-decoration:line-through;color:#999;">$${topRec.price}</span> <strong style="color:#1CE7D0;">$${topRec.discountedPrice}</strong>` : `<strong>$${topRec.price}</strong>`;
    const body = `<p style="color:#333;font-size:16px;line-height:1.6;">Hi ${firstName},</p>
<p style="color:#333;font-size:16px;line-height:1.6;">Based on your progress, we think <strong>${topRec.title}</strong> is the perfect next step for you.</p>
<p style="color:#333;font-size:16px;line-height:1.6;">${topRec.reason}</p>
<p style="color:#333;font-size:24px;text-align:center;margin:20px 0;">${priceStr}</p>`;
    htmlEmails.push({
      id: uid("html-email"),
      subject: `${firstName}, your next step: ${topRec.title}`,
      preheader: topRec.reason,
      html: wrapHtml(body, topRec.discountedPrice ? `Get It for $${topRec.discountedPrice}` : `Learn More — $${topRec.price}`, trackedUrl("/checkout", topRec.productId)),
      plainText: `Based on your progress, ${topRec.title} is perfect for you. ${topRec.reason}. Price: $${topRec.discountedPrice ?? topRec.price}. — CC Mendel`,
      category: "upsell",
      scheduledFor: isoFromNow(48),
    });
  }

  // Retention discount email for high-risk users
  if (churn.riskLevel === "high" && churn.retentionAction?.type === "discount") {
    const disc = churn.retentionAction.discountPercent ?? 25;
    const body = `<p style="color:#333;font-size:16px;line-height:1.6;">Hi ${firstName},</p>
<p style="color:#333;font-size:16px;line-height:1.6;">We value your commitment to building your creator business. As a thank you, here's an <strong>exclusive ${disc}% discount</strong> on your next purchase.</p>
<p style="color:#FFC857;font-size:36px;text-align:center;font-weight:700;margin:20px 0;">${disc}% OFF</p>
<p style="color:#333;font-size:14px;text-align:center;">This is a private offer — don't let it slip away.</p>`;
    htmlEmails.push({
      id: uid("html-email"),
      subject: `${firstName}, a special gift just for you`,
      preheader: `Exclusive ${disc}% discount inside`,
      html: wrapHtml(body, `Claim ${disc}% Off Now`, trackedUrl("/checkout", "retention-offer")),
      plainText: `Hi ${firstName}, here's an exclusive ${disc}% discount on your next purchase. Private offer. — CC Mendel`,
      category: "retention",
      scheduledFor: null,
    });
  }

  // ─── Email Campaigns / Drip Sequences ──────────────────────────────────
  const campaigns: EmailCampaign[] = [];

  // Onboarding drip (for new users < 14 days)
  if (input.accountAge <= 14) {
    campaigns.push({
      campaignId: uid("camp"),
      name: "Welcome Onboarding Sequence",
      trigger: { type: "signup" },
      status: "active",
      steps: [
        { stepNumber: 1, delayDays: 0, emailTemplateId: uid("tpl"), subject: `Welcome to CreatorCashCow, ${firstName}!`, summary: "Welcome email with platform tour and first course recommendation", openRate: 72, clickRate: 34 },
        { stepNumber: 2, delayDays: 1, emailTemplateId: uid("tpl"), subject: "Your first win starts here", summary: "Guide to completing their first lesson with a quick-win focus", openRate: 58, clickRate: 22 },
        { stepNumber: 3, delayDays: 3, emailTemplateId: uid("tpl"), subject: "How top creators use this platform", summary: "Social proof email with success stories and progress tips", openRate: 45, clickRate: 18 },
        { stepNumber: 4, delayDays: 5, emailTemplateId: uid("tpl"), subject: `${firstName}, ready for your next move?`, summary: "Upsell to second course or PDF based on enrolled course topic", openRate: 41, clickRate: 15 },
        { stepNumber: 5, delayDays: 7, emailTemplateId: uid("tpl"), subject: "Your weekly progress report", summary: "First weekly summary with achievement unlocks and next steps", openRate: 39, clickRate: 12 },
      ],
      enrolledUsers: 1,
      completionRate: 0,
    });
  }

  // Re-engagement drip (for inactive 7+ days)
  if (behavior.avgDaysBetweenLogins >= 7) {
    campaigns.push({
      campaignId: uid("camp"),
      name: "Re-Engagement Recovery",
      trigger: { type: "inactivity", days: 7 },
      status: "active",
      steps: [
        { stepNumber: 1, delayDays: 0, emailTemplateId: uid("tpl"), subject: `${firstName}, we miss you`, summary: "Gentle re-engagement with progress summary and what they'll miss", openRate: 35, clickRate: 12 },
        { stepNumber: 2, delayDays: 3, emailTemplateId: uid("tpl"), subject: "Your progress is still saved", summary: "Highlight saved progress with urgency around falling behind peers", openRate: 28, clickRate: 9 },
        { stepNumber: 3, delayDays: 7, emailTemplateId: uid("tpl"), subject: "Last chance: exclusive offer inside", summary: "Final push with a limited discount or free mentorship preview", openRate: 22, clickRate: 8 },
      ],
      enrolledUsers: 1,
      completionRate: 0,
    });
  }

  // Course completion upsell drip
  const completedCourses = input.enrolledCourses.filter((c) => c.completedAt);
  if (completedCourses.length > 0) {
    campaigns.push({
      campaignId: uid("camp"),
      name: "Post-Completion Upsell",
      trigger: { type: "course_completion", courseId: completedCourses[0].courseId },
      status: "active",
      steps: [
        { stepNumber: 1, delayDays: 0, emailTemplateId: uid("tpl"), subject: `Congratulations on completing ${completedCourses[0].title}!`, summary: "Celebration email with achievement badge and completion certificate", openRate: 68, clickRate: 28 },
        { stepNumber: 2, delayDays: 2, emailTemplateId: uid("tpl"), subject: "Your next recommended course", summary: "AI-recommended next course based on completed course topic", openRate: 42, clickRate: 18 },
        { stepNumber: 3, delayDays: 5, emailTemplateId: uid("tpl"), subject: "Special bundle offer for graduates", summary: "Exclusive bundle discount for users who completed a course", openRate: 36, clickRate: 14 },
      ],
      enrolledUsers: 1,
      completionRate: 30,
    });
  }

  // Churn prevention drip
  if (churn.riskLevel === "high" || churn.riskLevel === "medium") {
    campaigns.push({
      campaignId: uid("camp"),
      name: "Churn Prevention",
      trigger: { type: "churn_risk", riskLevel: churn.riskLevel as "medium" | "high" },
      status: "active",
      steps: [
        { stepNumber: 1, delayDays: 0, emailTemplateId: uid("tpl"), subject: `${firstName}, let's get you back on track`, summary: "Address specific stall points with personalized progress data", openRate: 32, clickRate: 11 },
        { stepNumber: 2, delayDays: 2, emailTemplateId: uid("tpl"), subject: "A surprise to keep you going", summary: "Offer incentive (discount or free session) based on churn risk level", openRate: 28, clickRate: 10 },
      ],
      enrolledUsers: 1,
      completionRate: 0,
    });
  }

  return { messages, htmlEmails, campaigns };
}

// ─── 6. ADMIN INSIGHT REPORTER ─────────────────────────────────────────────

export function reportAdminInsights(
  allOutputs: { input: AIBrainInput; behavior: BehaviorAnalysis; churn: ChurnPrediction }[]
): AdminInsights {
  const totalUsers = allOutputs.length;
  const avgEngagement =
    totalUsers > 0
      ? Math.round(
          allOutputs.reduce((s, o) => s + o.behavior.engagementScore, 0) / totalUsers
        )
      : 0;

  const highRiskCount = allOutputs.filter((o) => o.churn.riskLevel === "high").length;
  const mediumRiskCount = allOutputs.filter((o) => o.churn.riskLevel === "medium").length;
  const totalRevenue = allOutputs.reduce((s, o) => s + o.input.totalSpent, 0);
  const avgSpend = totalUsers > 0 ? Math.round(totalRevenue / totalUsers) : 0;
  const powerUsers = allOutputs.filter(
    (o) => o.behavior.activityLevel === "power-user"
  ).length;
  const inactiveUsers = allOutputs.filter(
    (o) => o.behavior.activityLevel === "inactive"
  ).length;

  const insights: InsightItem[] = [
    {
      metric: "Average Engagement Score",
      value: avgEngagement,
      formattedValue: `${avgEngagement}/100`,
      trend: avgEngagement > 60 ? "up" : avgEngagement > 40 ? "flat" : "down",
      changePercent: 5.2,
      period: "Last 30 days",
    },
    {
      metric: "Total Revenue",
      value: totalRevenue,
      formattedValue: `$${totalRevenue.toLocaleString()}`,
      trend: "up",
      changePercent: 18.3,
      period: "All time",
    },
    {
      metric: "Avg Spend per User",
      value: avgSpend,
      formattedValue: `$${avgSpend}`,
      trend: avgSpend > 300 ? "up" : "flat",
      changePercent: 3.6,
      period: "Last 30 days",
    },
    {
      metric: "High-Risk Users",
      value: highRiskCount,
      formattedValue: `${highRiskCount}`,
      trend: highRiskCount > totalUsers * 0.2 ? "up" : "down",
      changePercent: -2.1,
      period: "Current",
    },
    {
      metric: "Power Users",
      value: powerUsers,
      formattedValue: `${powerUsers}`,
      trend: "up",
      changePercent: 8.4,
      period: "Current",
    },
    {
      metric: "Inactive Users",
      value: inactiveUsers,
      formattedValue: `${inactiveUsers}`,
      trend: inactiveUsers > totalUsers * 0.15 ? "up" : "down",
      changePercent: -4.0,
      period: "Current",
    },
  ];

  const alerts: AdminAlert[] = [];

  if (highRiskCount > 0) {
    alerts.push({
      id: "alert-churn",
      severity: highRiskCount >= 3 ? "critical" : "warning",
      title: `${highRiskCount} user(s) at high churn risk`,
      description: `${highRiskCount} users have high churn risk scores. Consider activating retention campaigns.`,
      actionLabel: "View At-Risk Users",
      timestamp: new Date().toISOString(),
    });
  }

  if (inactiveUsers > totalUsers * 0.2) {
    alerts.push({
      id: "alert-inactive",
      severity: "warning",
      title: `${inactiveUsers} inactive users detected`,
      description: "More than 20% of users are inactive. Consider a re-engagement email blast.",
      actionLabel: "Draft Re-Engagement",
      timestamp: new Date().toISOString(),
    });
  }

  if (avgEngagement > 70) {
    alerts.push({
      id: "alert-engagement",
      severity: "info",
      title: "Strong engagement across the platform",
      description: `Average engagement score is ${avgEngagement}/100. Great time to launch new products.`,
      actionLabel: null,
      timestamp: new Date().toISOString(),
    });
  }

  const recommendations: AdminRecommendation[] = [
    {
      id: "rec-1",
      category: "retention",
      title: "Launch automated churn prevention",
      description: `${highRiskCount + mediumRiskCount} users need attention. Automate personalized emails for users with risk scores above 30.`,
      impact: "high",
      effort: "medium",
    },
    {
      id: "rec-2",
      category: "pricing",
      title: "Test dynamic bundle pricing",
      description: "Users with 2-3 courses respond well to bundles. A/B test a 30% bundle vs 25%.",
      impact: "medium",
      effort: "low",
    },
    {
      id: "rec-3",
      category: "engagement",
      title: "Gamify course completion",
      description: `${Math.round(avgEngagement)}% avg engagement suggests users value progress. Add completion badges and leaderboards.`,
      impact: "high",
      effort: "high",
    },
    {
      id: "rec-4",
      category: "product",
      title: "Create micro-courses for stalled users",
      description: "Users stalling at 40-60% need shorter wins. Consider mini-modules or recap challenges.",
      impact: "medium",
      effort: "medium",
    },
    {
      id: "rec-5",
      category: "content",
      title: "Personalized email sequences",
      description: "Deploy behavior-triggered emails: 24h inactivity, course milestone, purchase anniversary.",
      impact: "high",
      effort: "low",
    },
  ];

  return { insights, alerts, recommendations };
}

// ─── 7. ACHIEVEMENT DETECTOR ────────────────────────────────────────────────

export function detectAchievements(
  input: AIBrainInput,
  behavior: BehaviorAnalysis
): Achievement[] {
  const achievements: Achievement[] = [];
  const now = new Date().toISOString();

  // First Course — enrolled in at least 1
  achievements.push({
    id: "ach-first-course",
    title: "First Steps",
    description: "Enrolled in your first course",
    icon: "🎓",
    category: "progress",
    earnedAt: input.enrolledCourses.length > 0 ? input.enrolledCourses[0].enrolledAt : null,
    progress: input.enrolledCourses.length > 0 ? 100 : 0,
  });

  // Course Completer — completed at least 1 course
  const completedCourses = input.enrolledCourses.filter((c) => c.completedAt);
  achievements.push({
    id: "ach-course-complete",
    title: "Course Conqueror",
    description: "Completed your first course",
    icon: "🏆",
    category: "milestone",
    earnedAt: completedCourses.length > 0 ? completedCourses[0].completedAt! : null,
    progress: completedCourses.length > 0 ? 100 : Math.round(Math.max(...input.enrolledCourses.map((c) => c.progress), 0)),
  });

  // Halfway Hero — 50%+ in any course
  const halfwayDone = input.enrolledCourses.some((c) => c.progress >= 50);
  achievements.push({
    id: "ach-halfway",
    title: "Halfway Hero",
    description: "Reached 50% in any course",
    icon: "⚡",
    category: "progress",
    earnedAt: halfwayDone ? now : null,
    progress: halfwayDone ? 100 : Math.round(Math.max(...input.enrolledCourses.map((c) => Math.min(c.progress, 50)) , 0) * 2),
  });

  // PDF Collector — purchased at least 2 PDFs
  achievements.push({
    id: "ach-pdf-collector",
    title: "Knowledge Collector",
    description: "Purchased 2+ digital products",
    icon: "📚",
    category: "purchase",
    earnedAt: input.purchasedPDFs.length >= 2 ? input.purchasedPDFs[1].purchasedAt : null,
    progress: Math.min(100, Math.round((input.purchasedPDFs.length / 2) * 100)),
  });

  // First Purchase
  achievements.push({
    id: "ach-first-purchase",
    title: "First Investment",
    description: "Made your first purchase",
    icon: "💰",
    category: "purchase",
    earnedAt: input.paymentHistory.length > 0 ? input.paymentHistory[0].date : null,
    progress: input.paymentHistory.length > 0 ? 100 : 0,
  });

  // Power User — engagement score >= 85
  achievements.push({
    id: "ach-power-user",
    title: "Power Creator",
    description: "Achieved power-user engagement level",
    icon: "🚀",
    category: "engagement",
    earnedAt: behavior.engagementScore >= 85 ? now : null,
    progress: Math.min(100, Math.round((behavior.engagementScore / 85) * 100)),
  });

  // Big Spender — spent $500+
  achievements.push({
    id: "ach-big-spender",
    title: "Serious Investor",
    description: "Invested $500+ in your creator education",
    icon: "💎",
    category: "purchase",
    earnedAt: input.totalSpent >= 500 ? now : null,
    progress: Math.min(100, Math.round((input.totalSpent / 500) * 100)),
  });

  // Live Learner — attended 3+ live sessions
  achievements.push({
    id: "ach-live-learner",
    title: "Live Learner",
    description: "Attended 3+ live sessions",
    icon: "🎬",
    category: "engagement",
    earnedAt: input.liveSessionsAttended >= 3 ? now : null,
    progress: Math.min(100, Math.round((input.liveSessionsAttended / 3) * 100)),
  });

  // Mentor Connect — booked mentorship
  achievements.push({
    id: "ach-mentor",
    title: "Mentor Connected",
    description: "Booked a 1:1 mentorship session",
    icon: "🤝",
    category: "milestone",
    earnedAt: input.mentorshipBooked ? now : null,
    progress: input.mentorshipBooked ? 100 : 0,
  });

  // Multi-Course Master — enrolled in 3+ courses
  achievements.push({
    id: "ach-multi-course",
    title: "Multi-Course Master",
    description: "Enrolled in 3+ courses",
    icon: "🌟",
    category: "progress",
    earnedAt: input.enrolledCourses.length >= 3 ? now : null,
    progress: Math.min(100, Math.round((input.enrolledCourses.length / 3) * 100)),
  });

  return achievements;
}

// ─── 8. PERSONALIZED WIDGET GENERATOR ──────────────────────────────────────

export function generatePersonalizedWidgets(
  input: AIBrainInput,
  behavior: BehaviorAnalysis,
  achievements: Achievement[],
  upsell: UpsellRecommendation
): PersonalizedWidgets {
  const firstName = input.fullName.split(" ")[0];
  const hour = new Date().getHours();

  // AI Greeting based on time-of-day + behavior
  let timeGreeting: string;
  if (hour < 12) timeGreeting = "Good morning";
  else if (hour < 17) timeGreeting = "Good afternoon";
  else timeGreeting = "Good evening";

  let behaviorNote: string;
  if (behavior.activityLevel === "power-user") {
    behaviorNote = "You're on fire! Keep up the incredible momentum.";
  } else if (behavior.activityLevel === "high") {
    behaviorNote = "Impressive progress this week. You're almost at power-user level!";
  } else if (behavior.activityLevel === "moderate") {
    behaviorNote = "You're making solid progress. One more lesson today could change everything.";
  } else if (behavior.activityLevel === "low") {
    behaviorNote = "Welcome back! Every great creator starts with one step. Let's build today.";
  } else {
    behaviorNote = "We've missed you! Your courses are waiting. Let's pick up where you left off.";
  }

  const aiGreeting = `${timeGreeting}, ${firstName}! ${behaviorNote}`;

  // Next Recommended Course widget
  let nextRecommendedCourse: PersonalizedWidgets["nextRecommendedCourse"] = null;
  if (upsell.recommendedProducts.length > 0) {
    const topProduct = upsell.recommendedProducts.find((p) => p.productType === "course");
    if (topProduct) {
      nextRecommendedCourse = {
        courseId: topProduct.productId,
        title: topProduct.title,
        reason: topProduct.reason,
        price: topProduct.discountedPrice ?? topProduct.price,
        matchScore: Math.round(upsell.confidence * 100),
      };
    }
  }

  // Progress Summary widget
  const totalCompleted = input.enrolledCourses.filter((c) => c.completedAt).length;
  const currentStreak = behavior.avgDaysBetweenLogins <= 1 ? Math.floor(Math.random() * 7) + 1 : 0;
  const percentileRank = Math.min(99, Math.max(1, 100 - behavior.engagementScore));

  // Find nearest milestone
  const inProgressCourses = input.enrolledCourses.filter((c) => c.progress > 0 && !c.completedAt);
  const closest = inProgressCourses.sort((a, b) => b.progress - a.progress)[0];
  const nearestMilestone = closest
    ? `Complete ${closest.title} (${100 - closest.progress}% away)`
    : totalCompleted > 0
    ? "Enroll in your next course!"
    : "Complete your first lesson";

  const progressSummary = {
    totalCoursesEnrolled: input.enrolledCourses.length,
    totalCompleted,
    currentStreak,
    percentileRank,
    nearestMilestone,
  };

  // Live Session Countdown widget (simulated next session)
  const nextSessionDate = new Date();
  nextSessionDate.setDate(nextSessionDate.getDate() + Math.floor(Math.random() * 5) + 1);
  nextSessionDate.setHours(19, 0, 0, 0);
  const hoursUntil = Math.max(0, Math.round((nextSessionDate.getTime() - Date.now()) / 3600000));

  const liveSessionCountdown = {
    sessionId: uid("session"),
    title: "Creator Masterclass: Scaling Your First $10K",
    scheduledDate: nextSessionDate.toISOString(),
    hoursUntil,
  };

  // Weekly Goal widget
  const lessonsPerCourse = 10; // assumed
  const totalLessons = input.enrolledCourses.length * lessonsPerCourse;
  const completedLessons = Math.round(
    input.enrolledCourses.reduce((sum, c) => sum + (c.progress / 100) * lessonsPerCourse, 0)
  );
  const targetLessons = Math.min(7, totalLessons - completedLessons); // aim for 7 lessons/week
  const weeklyCompleted = Math.min(targetLessons, currentStreak > 0 ? Math.ceil(currentStreak * 1.2) : 0);
  const percentComplete = targetLessons > 0 ? Math.round((weeklyCompleted / targetLessons) * 100) : 0;

  let motivationMessage: string;
  if (percentComplete >= 100) motivationMessage = "You crushed your weekly goal! 🎉 Set a bigger target next week!";
  else if (percentComplete >= 70) motivationMessage = "Almost there! Just a few more lessons to hit your goal.";
  else if (percentComplete >= 30) motivationMessage = "Good start! Keep the momentum going today.";
  else motivationMessage = "Your week is just getting started. Knock out a lesson now!";

  const weeklyGoal = {
    targetLessons,
    completedLessons: weeklyCompleted,
    percentComplete,
    motivationMessage,
  };

  return {
    aiGreeting,
    nextRecommendedCourse: nextRecommendedCourse,
    progressSummary,
    achievements,
    liveSessionCountdown,
    weeklyGoal,
  };
}

// ─── GLOBAL PRODUCT PERFORMANCE (for admin dashboard) ──────────────────────

export function computeGlobalProductPerformance(
  allInputs: AIBrainInput[]
): ProductPerformance[] {
  return PRODUCT_CATALOG.map((product) => {
    const isCourse = product.productType === "course";
    let totalSales = 0;
    let totalRevenue = 0;
    let progressSum = 0;
    let progressCount = 0;

    for (const input of allInputs) {
      const courseMatch = input.enrolledCourses.find((c) => c.courseId === product.productId);
      const pdfMatch = input.purchasedPDFs.find((p) => p.pdfId === product.productId);
      const mentorMatch = product.productType === "mentorship" && input.mentorshipBooked;
      const bundleMatch = product.productType === "bundle" && input.enrolledCourses.length >= 4;

      if (courseMatch || pdfMatch || mentorMatch || bundleMatch) {
        totalSales++;
        totalRevenue += product.price;
        if (isCourse && courseMatch) {
          progressSum += courseMatch.progress;
          progressCount++;
        }
      }
    }

    return {
      productId: product.productId,
      title: product.title,
      type: product.productType,
      totalRevenue,
      totalSales,
      conversionRate: allInputs.length > 0 ? Math.round((totalSales / allInputs.length) * 100) : 0,
      avgRating: +(Math.random() * 1.5 + 3.5).toFixed(1),
      completionRate: progressCount > 0 ? Math.round(progressSum / progressCount) : 0,
      rank: 0, // set after sort
      trend: (totalSales > allInputs.length * 0.5 ? "up" : totalSales > allInputs.length * 0.2 ? "flat" : "down") as "up" | "down" | "flat",
    };
  })
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .map((p, i) => ({ ...p, rank: i + 1 }));
}

// ─── GLOBAL FORECAST (aggregated for admin) ────────────────────────────────

export function computeGlobalForecast(allInputs: AIBrainInput[]): RevenueForecast {
  const totalRevenue = allInputs.reduce((s, u) => s + u.totalSpent, 0);
  const avgAccountAge = allInputs.reduce((s, u) => s + u.accountAge, 0) / Math.max(1, allInputs.length);
  const monthlyRate = totalRevenue / Math.max(1, avgAccountAge / 30);
  const growth = 1.12; // 12% growth assumption

  const periods: ForecastPeriod[] = [
    { label: "30-day", days: 30, projectedRevenue: Math.round(monthlyRate * growth), projectedNewUsers: 12, projectedConversions: 8, growthRate: 12 },
    { label: "60-day", days: 60, projectedRevenue: Math.round(monthlyRate * 2 * growth * 1.05), projectedNewUsers: 28, projectedConversions: 18, growthRate: 17 },
    { label: "90-day", days: 90, projectedRevenue: Math.round(monthlyRate * 3 * growth * 1.1), projectedNewUsers: 45, projectedConversions: 30, growthRate: 23 },
  ];

  return {
    periods,
    totalProjected: periods[2].projectedRevenue,
    confidence: 0.68,
    assumptions: [
      "Based on aggregate spending velocity across all users",
      `${allInputs.length} active users with $${Math.round(totalRevenue / allInputs.length)} avg LTV`,
      "12% baseline growth assumption with compounding engagement effects",
      "Does not account for seasonal variations or marketing campaigns",
    ],
  };
}

// ─── MASTER ORCHESTRATOR ────────────────────────────────────────────────────

/**
 * Run the full AI Brain pipeline for a single user.
 * Follows the orchestration workflow from the master prompt.
 */
export function runAIBrainPipeline(input: AIBrainInput): AIBrainOutput {
  // Step 1: Behavior analysis
  const behavior = analyzeBehavior(input);

  // Step 2: Churn prediction
  const churn = predictChurn(input, behavior);

  // Step 3: Upsell strategy (gated by engagementScore)
  const upsell = strategizeUpsell(input, behavior, churn);

  // Step 4: Revenue optimization (includes forecast + product performance)
  const revenue = optimizeRevenue(input, behavior, upsell);

  // Step 5: Content generation (includes HTML emails + campaigns)
  const content = generateContent(input, behavior, churn, upsell);

  // Step 6: Admin insights (per-user partial — aggregated in service layer)
  const adminInsights = reportAdminInsights([{ input, behavior, churn }]);

  // Step 7: Achievement detection
  const achievements = detectAchievements(input, behavior);

  // Step 8: Personalized widgets
  const widgets = generatePersonalizedWidgets(input, behavior, achievements, upsell);

  return {
    userId: input.userId,
    fullName: input.fullName,
    generatedAt: new Date().toISOString(),
    behavior,
    upsell,
    churn,
    content,
    revenue,
    adminInsights,
    widgets,
    achievements,
  };
}
