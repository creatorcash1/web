// ─── OverviewSection ─────────────────────────────────────────────────────────
// Dashboard home: AI personalized greeting, upsell banner, stat cards,
// progress summary, achievements, weekly goal, live session countdown,
// next course recommendation, and quick-access course strip.
// Follows FRONTEND.md design system and AGENTS.md AI integration spec.
// ─────────────────────────────────────────────────────────────────────────────
import { useQuery } from "@tanstack/react-query";
import {
  AcademicCapIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  FolderOpenIcon,
} from "@heroicons/react/24/outline";
import DashboardCard from "@/components/dashboard/DashboardCard";
import DashboardCourseCard from "@/components/dashboard/DashboardCourseCard";
import UpsellBanner from "@/components/ai/UpsellBanner";
import PersonalizedGreeting from "@/components/ai/PersonalizedGreeting";
import ProgressSummaryCard from "@/components/ai/ProgressSummaryCard";
import AchievementBadge from "@/components/ai/AchievementBadge";
import NextCourseWidget from "@/components/ai/NextCourseWidget";
import WeeklyGoalCard from "@/components/ai/WeeklyGoalCard";
import LiveSessionCountdown from "@/components/ai/LiveSessionCountdown";
import { useCTA } from "@/lib/useCTA";
import type { CTAResourceType } from "@/types/wiring";
import { useAIBrainStore } from "@/stores/aiBrainStore";
import { fetchAIBrainForUser } from "@/services/aiBrain";
import type { DashboardData } from "@/types/dashboard";

interface Props {
  data: DashboardData;
}

export default function OverviewSection({ data }: Props) {
  const { user, stats, courses } = data;

  // AI Brain integration
  const upsellDismissed = useAIBrainStore((s) => s.upsellDismissed);
  const setUpsellDismissed = useAIBrainStore((s) => s.setUpsellDismissed);

  const { data: aiData } = useQuery({
    queryKey: ["ai-brain-user", "u-001"],
    queryFn: () => fetchAIBrainForUser("u-001"),
    staleTime: 5 * 60 * 1000,
  });

  // Max 1 recommendation per session (master prompt rule)
  const topRecommendation =
    aiData?.upsell.recommendedProducts?.[0] ?? null;

  // Personalized widgets from AI Brain
  const widgets = aiData?.widgets ?? null;
  const achievements = aiData?.achievements ?? [];
  const earnedAchievements = achievements.filter((a) => a.earnedAt);

  // Order widgets by engagement score (higher engagement = more growth-focused layout)
  const engagementScore = aiData?.behavior.engagementScore ?? 0;

  const { handleCTA } = useCTA({
    location: "dashboard_overview",
    user: {
      userId: user.id,
      isAuthenticated: true,
      role: "user",
      enrolledCourseIds: data.courses.map((course) => course.id),
      purchasedPdfIds: data.pdfs.map((pdf) => pdf.id),
      mentorshipProductIds: data.bookings.length > 0 ? ["mentorship-2hr"] : [],
    },
  });

  const mapProductTypeToResource = (productType: string): CTAResourceType => {
    if (productType === "course") return "course";
    if (productType === "pdf") return "pdf";
    if (productType === "mentorship") return "mentorship";
    if (productType === "bundle") return "course";
    return "unknown";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── AI Personalized Greeting ─────────────────── */}
      {widgets && (
        <PersonalizedGreeting
          greeting={widgets.aiGreeting}
          streak={widgets.progressSummary.currentStreak}
        />
      )}

      {/* ── AI Upsell Banner ─────────────────────────── */}
      {topRecommendation && !upsellDismissed && (
        <UpsellBanner
          product={topRecommendation}
          onDismiss={() => setUpsellDismissed(true)}
          onView={() =>
            handleCTA({
              actionType: "navigate",
              resourceType: mapProductTypeToResource(topRecommendation.productType),
              resourceId: topRecommendation.productId,
              requiresAuth: true,
              requiresPurchase: false,
              analyticsEvent: "dashboard_upsell_view_now_clicked",
              fallbackRoute: "/dashboard",
            })
          }
        />
      )}

      {/* ── Stat cards ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <DashboardCard
          icon={<AcademicCapIcon className="w-6 h-6" />}
          label="Enrolled Courses"
          value={stats.enrolled_courses}
        />
        <DashboardCard
          icon={<ChartBarIcon className="w-6 h-6" />}
          label="Total Progress"
          value={stats.avg_progress}
          suffix="%"
        />
        <DashboardCard
          icon={<CalendarDaysIcon className="w-6 h-6" />}
          label="Active Mentorship"
          value={stats.active_bookings}
        />
        <DashboardCard
          icon={<FolderOpenIcon className="w-6 h-6" />}
          label="Digital Assets"
          value={stats.digital_assets}
        />
      </div>

      {/* ── AI Widgets Grid ──────────────────────────── */}
      {widgets && (
        <div className={`grid grid-cols-1 gap-4 ${engagementScore > 70 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          {/* Progress Summary — always first */}
          <ProgressSummaryCard data={widgets.progressSummary} />

          {/* Weekly Goal */}
          <WeeklyGoalCard data={widgets.weeklyGoal} />

          {/* Live Session Countdown — for high engagement users, show prominently */}
          {widgets.liveSessionCountdown && engagementScore > 45 && (
            <LiveSessionCountdown
              data={widgets.liveSessionCountdown}
              onAction={() =>
                handleCTA({
                  actionType: "navigate",
                  resourceType: "live",
                  resourceId: widgets.liveSessionCountdown?.sessionId,
                  requiresAuth: true,
                  requiresPurchase: false,
                  analyticsEvent: "dashboard_live_countdown_clicked",
                  fallbackRoute: "/dashboard/live",
                })
              }
            />
          )}

          {/* Next Course Recommendation */}
          {widgets.nextRecommendedCourse && (
            <NextCourseWidget
              data={widgets.nextRecommendedCourse}
              onAction={() =>
                handleCTA({
                  actionType: "navigate",
                  resourceType: "course",
                  resourceId: widgets.nextRecommendedCourse?.courseId,
                  requiresAuth: true,
                  requiresPurchase: false,
                  analyticsEvent: "dashboard_next_course_clicked",
                  fallbackRoute: "/dashboard/courses",
                })
              }
            />
          )}
        </div>
      )}

      {/* ── Achievements Row ─────────────────────────── */}
      {earnedAchievements.length > 0 && (
        <div>
          <h3 className="font-black text-[#0D1B2A] mb-4 text-lg flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600">🏆</span>
            Your Achievements
            <span className="text-xs font-semibold text-white bg-[#0D1B2A] px-2 py-1 rounded-full ml-2">
              {earnedAchievements.length}/{achievements.length}
            </span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {achievements.map((ach) => (
              <AchievementBadge key={ach.id} achievement={ach} compact />
            ))}
          </div>
        </div>
      )}

      {/* ── Recent courses ───────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-black text-[#0D1B2A] text-lg flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-teal-100 to-cyan-200 text-teal-600">🎯</span>
            Continue Learning
          </h3>
          <a href="/dashboard/courses" className="text-sm font-semibold text-[#1CE7D0] hover:text-[#0D1B2A] transition-colors">
            View all →
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.slice(0, 3).map((c) => (
            <DashboardCourseCard key={c.id} course={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
