"use client";
// ─── AIBrainSection ─────────────────────────────────────────────────────────
// Full admin section for the AI Brain: overview KPIs, user profiles list,
// per-user agent outputs, alerts, recommendations, system health.
// ─────────────────────────────────────────────────────────────────────────────

import { useQuery } from "@tanstack/react-query";
import { useAIBrainStore, type AIAgentTab } from "@/stores/aiBrainStore";
import { fetchAIBrainDashboard } from "@/services/aiBrain";
import type { AIBrainOutput } from "@/types/aiBrain";

import EngagementGauge from "@/components/ai/EngagementGauge";
import RiskBadge from "@/components/ai/RiskBadge";
import RecommendationCard from "@/components/ai/RecommendationCard";
import AIAlertBanner from "@/components/ai/AIAlertBanner";
import BrainHealthCard from "@/components/ai/BrainHealthCard";
import InsightCard from "@/components/ai/InsightCard";
import MessagePreview from "@/components/ai/MessagePreview";
import UserProfileCard from "@/components/ai/UserProfileCard";
import BundleCard from "@/components/ai/BundleCard";
import AIAdminRecommendationRow from "@/components/ai/AIAdminRecommendationRow";
import ForecastChart from "@/components/ai/ForecastChart";
import AchievementBadge from "@/components/ai/AchievementBadge";
import CampaignViewer from "@/components/ai/CampaignViewer";
import ProductPerformanceTable from "@/components/ai/ProductPerformanceTable";

import {
  CpuChipIcon,
  EyeIcon,
  ShieldExclamationIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  ChatBubbleBottomCenterTextIcon,
  LightBulbIcon,
  ChartBarIcon,
  EnvelopeIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

const AGENT_TABS: { key: AIAgentTab; label: string; Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }[] = [
  { key: "overview", label: "Overview", Icon: CpuChipIcon },
  { key: "behavior", label: "Behavior", Icon: EyeIcon },
  { key: "churn", label: "Churn", Icon: ShieldExclamationIcon },
  { key: "upsell", label: "Upsell", Icon: SparklesIcon },
  { key: "revenue", label: "Revenue", Icon: CurrencyDollarIcon },
  { key: "forecast", label: "Forecast", Icon: ChartBarIcon },
  { key: "content", label: "Content", Icon: ChatBubbleBottomCenterTextIcon },
  { key: "campaigns", label: "Campaigns", Icon: EnvelopeIcon },
  { key: "achievements", label: "Achievements", Icon: TrophyIcon },
  { key: "insights", label: "Insights", Icon: LightBulbIcon },
];

export default function AIBrainSection() {
  const selectedUserId = useAIBrainStore((s) => s.selectedUserId);
  const setSelectedUserId = useAIBrainStore((s) => s.setSelectedUserId);
  const activeTab = useAIBrainStore((s) => s.activeAgentTab);
  const setActiveTab = useAIBrainStore((s) => s.setActiveAgentTab);
  const dismissedAlerts = useAIBrainStore((s) => s.dismissedAlerts);
  const dismissAlert = useAIBrainStore((s) => s.dismissAlert);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["ai-brain-dashboard"],
    queryFn: fetchAIBrainDashboard,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-2 border-[#1CE7D0] border-t-transparent rounded-full animate-spin" />
        <p className="text-white/40 text-sm">Running AI Brain analysis…</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 text-sm mb-3">Failed to load AI Brain data.</p>
      </div>
    );
  }

  const { userProfiles, globalInsights, brainHealth, forecast, productPerformance, campaigns } = data;
  const selectedProfile = selectedUserId
    ? userProfiles.find((p) => p.userId === selectedUserId) ?? null
    : null;

  // Active alerts (not dismissed)
  const activeAlerts = globalInsights.alerts.filter(
    (a) => !dismissedAlerts.has(a.id)
  );

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ──────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">🧠</span>
        <div>
          <h2 className="text-xl font-bold text-white font-(family-name:--font-montserrat)">
            AI Brain
          </h2>
          <p className="text-xs text-white/40">
            Revenue-Optimized Intelligence · {userProfiles.length} users analyzed
          </p>
        </div>
      </div>

      {/* ── Alerts ──────────────────────────────────── */}
      {activeAlerts.length > 0 && (
        <div className="space-y-2">
          {activeAlerts.map((alert) => (
            <AIAlertBanner
              key={alert.id}
              alert={alert}
              onDismiss={() => dismissAlert(alert.id)}
              onAction={() => {
                // Navigate to relevant view based on alert type
                if (alert.id === "alert-churn") {
                  // Find first high-risk user and select them
                  const highRisk = userProfiles.find((p) => p.churn.riskLevel === "high");
                  if (highRisk) {
                    setSelectedUserId(highRisk.userId);
                    setActiveTab("churn");
                  }
                } else if (alert.id === "alert-inactive") {
                  setActiveTab("campaigns");
                  setSelectedUserId(null);
                } else if (alert.id === "alert-engagement") {
                  setActiveTab("forecast");
                  setSelectedUserId(null);
                }
              }}
            />
          ))}
        </div>
      )}

      {/* ── Top-level KPIs ──────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {globalInsights.insights.map((insight) => (
          <InsightCard key={insight.metric} insight={insight} />
        ))}
      </div>

      {/* ── Main layout: user list + detail panel ──── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* User list */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-2">
          <h3 className="text-xs uppercase tracking-wider text-white/30 font-semibold mb-2">
            User Profiles ({userProfiles.length})
          </h3>
          <div className="space-y-2 max-h-150 overflow-y-auto pr-1 custom-scrollbar">
            {userProfiles.map((profile) => (
              <UserProfileCard
                key={profile.userId}
                output={profile}
                isSelected={profile.userId === selectedUserId}
                onSelect={() => setSelectedUserId(profile.userId)}
              />
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-8 xl:col-span-9">
          {selectedProfile ? (
            <UserDetailPanel
              profile={selectedProfile}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          ) : (
            <div className="grid gap-6">
              {/* No user selected — show global view */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BrainHealthCard health={brainHealth} />
                <div className="bg-[#0D1B2A] border border-white/10 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-white font-(family-name:--font-montserrat) mb-3">
                    Quick Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Stat
                      label="High Risk"
                      value={userProfiles.filter((p) => p.churn.riskLevel === "high").length.toString()}
                      color="text-red-400"
                    />
                    <Stat
                      label="Upsell Ready"
                      value={userProfiles.filter((p) => p.upsell.recommendedProducts.length > 0).length.toString()}
                      color="text-[#1CE7D0]"
                    />
                    <Stat
                      label="Active"
                      value={userProfiles.filter((p) => p.behavior.activityLevel === "high" || p.behavior.activityLevel === "power-user").length.toString()}
                      color="text-emerald-400"
                    />
                    <Stat
                      label="Inactive"
                      value={userProfiles.filter((p) => p.behavior.activityLevel === "inactive").length.toString()}
                      color="text-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-white/30 font-semibold mb-3">
                  AI Recommendations
                </h3>
                <div className="space-y-2">
                  {globalInsights.recommendations.map((rec) => (
                    <AIAdminRecommendationRow key={rec.id} rec={rec} />
                  ))}
                </div>
              </div>

              {/* Global Revenue Forecast */}
              <div className="bg-[#0D1B2A] border border-white/10 rounded-xl p-5">
                <ForecastChart forecast={forecast} />
              </div>

              {/* Product Performance */}
              <div className="bg-[#0D1B2A] border border-white/10 rounded-xl p-5">
                <ProductPerformanceTable products={productPerformance} />
              </div>

              {/* Email Campaigns */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-white/30 font-semibold mb-3">
                  Email Campaigns ({campaigns.length})
                </h3>
                <CampaignViewer campaigns={campaigns} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── User Detail Panel ──────────────────────────────────────────────────────

function UserDetailPanel({
  profile,
  activeTab,
  setActiveTab,
}: {
  profile: AIBrainOutput;
  activeTab: AIAgentTab;
  setActiveTab: (tab: AIAgentTab) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {AGENT_TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === key
                ? "bg-[#FFC857]/10 text-[#FFC857] border border-[#FFC857]/20"
                : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-100">
        {activeTab === "overview" && <OverviewTab profile={profile} />}
        {activeTab === "behavior" && <BehaviorTab profile={profile} />}
        {activeTab === "churn" && <ChurnTab profile={profile} />}
        {activeTab === "upsell" && <UpsellTab profile={profile} />}
        {activeTab === "revenue" && <RevenueTab profile={profile} />}
        {activeTab === "forecast" && <ForecastTabContent profile={profile} />}
        {activeTab === "content" && <ContentTab profile={profile} />}
        {activeTab === "campaigns" && <CampaignsTabContent profile={profile} />}
        {activeTab === "achievements" && <AchievementsTabContent profile={profile} />}
        {activeTab === "insights" && <InsightsTab profile={profile} />}
      </div>
    </div>
  );
}

// ─── Tab: Overview ──────────────────────────────────────────────────────────

function OverviewTab({ profile }: { profile: AIBrainOutput }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Engagement */}
      <div className="bg-[#0D1B2A] border border-white/10 rounded-xl p-5 flex flex-col items-center gap-3">
        <EngagementGauge score={profile.behavior.engagementScore} size="lg" />
        <p className="text-xs text-white/40">Engagement Score</p>
      </div>

      {/* Risk */}
      <div className="bg-[#0D1B2A] border border-white/10 rounded-xl p-5">
        <p className="text-xs text-white/30 mb-3">Churn Risk</p>
        <div className="flex items-center gap-3 mb-3">
          <RiskBadge level={profile.churn.riskLevel} score={profile.churn.riskScore} />
        </div>
        {profile.churn.retentionAction && (
          <div className="bg-white/3 rounded-lg p-3 mt-2">
            <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Retention Action</p>
            <p className="text-xs text-white/70">{profile.churn.retentionAction.description}</p>
          </div>
        )}
      </div>

      {/* Upsell summary */}
      <div className="bg-[#0D1B2A] border border-white/10 rounded-xl p-5">
        <p className="text-xs text-white/30 mb-3">Upsell</p>
        {profile.upsell.recommendedProducts.length > 0 ? (
          <>
            <p className="text-sm font-bold text-white mb-1">
              {profile.upsell.recommendedProducts[0].title}
            </p>
            <p className="text-xs text-white/40 mb-2">
              {profile.upsell.recommendedProducts[0].reason}
            </p>
            <p className="text-[10px] text-white/20">
              Confidence: {Math.round(profile.upsell.confidence * 100)}%
            </p>
          </>
        ) : (
          <p className="text-xs text-white/30 italic">{profile.upsell.reason}</p>
        )}
      </div>
    </div>
  );
}

// ─── Tab: Behavior ──────────────────────────────────────────────────────────

function BehaviorTab({ profile }: { profile: AIBrainOutput }) {
  const { behavior } = profile;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MiniStat label="Engagement" value={`${behavior.engagementScore}/100`} />
        <MiniStat label="Activity Level" value={behavior.activityLevel} />
        <MiniStat label="Course Progress" value={`${behavior.courseCompletionRate}%`} />
        <MiniStat label="Top Course" value={behavior.topEngagedCourse ?? "—"} />
      </div>

      <h4 className="text-xs uppercase tracking-wider text-white/30 font-semibold">
        Behavioral Signals ({behavior.signals.length})
      </h4>
      <div className="space-y-2">
        {behavior.signals.map((sig, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 bg-white/2 border rounded-lg p-3 ${
              sig.severity === "positive"
                ? "border-emerald-500/10"
                : sig.severity === "warning"
                ? "border-amber-500/10"
                : "border-white/5"
            }`}
          >
            <span className="text-xs mt-0.5">
              {sig.severity === "positive" ? "✅" : sig.severity === "warning" ? "⚠️" : "ℹ️"}
            </span>
            <div>
              <p className="text-xs text-white/70">{sig.description}</p>
              <p className="text-[10px] text-white/20 mt-0.5">{sig.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Churn ─────────────────────────────────────────────────────────────

function ChurnTab({ profile }: { profile: AIBrainOutput }) {
  const { churn } = profile;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <RiskBadge level={churn.riskLevel} score={churn.riskScore} />
      </div>

      <h4 className="text-xs uppercase tracking-wider text-white/30 font-semibold">
        Risk Factors ({churn.riskFactors.length})
      </h4>
      <div className="space-y-2">
        {churn.riskFactors.map((f, i) => (
          <div key={i} className="bg-white/2 border border-white/5 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-bold text-white">{f.factor}</p>
              <span className="text-[10px] text-red-400 font-semibold">
                Weight: {Math.round(f.weight * 100)}%
              </span>
            </div>
            <p className="text-xs text-white/40">{f.description}</p>
          </div>
        ))}
        {churn.riskFactors.length === 0 && (
          <p className="text-xs text-white/30 italic">No risk factors detected — user is healthy.</p>
        )}
      </div>

      {churn.retentionAction && (
        <>
          <h4 className="text-xs uppercase tracking-wider text-white/30 font-semibold">
            Retention Action
          </h4>
          <div className="bg-[#FFC857]/5 border border-[#FFC857]/20 rounded-xl p-4">
            <p className="text-sm font-bold text-[#FFC857] mb-1">{churn.retentionAction.type.replace(/_/g, " ")}</p>
            <p className="text-xs text-white/60">{churn.retentionAction.description}</p>
            <p className="text-[10px] text-white/30 mt-2">
              Urgency: {churn.retentionAction.urgency.replace(/_/g, " ")}
              {churn.retentionAction.discountPercent && ` · ${churn.retentionAction.discountPercent}% discount`}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Tab: Upsell ────────────────────────────────────────────────────────────

function UpsellTab({ profile }: { profile: AIBrainOutput }) {
  const { upsell } = profile;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-white/40">{upsell.reason}</p>
        <span className="text-xs text-white/20">
          Confidence: {Math.round(upsell.confidence * 100)}%
        </span>
      </div>

      {upsell.recommendedProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {upsell.recommendedProducts.map((p) => (
            <RecommendationCard key={p.productId} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white/2 rounded-xl border border-white/5">
          <p className="text-white/30 text-sm">No upsell recommendations for this user.</p>
          <p className="text-white/15 text-xs mt-1">
            Engagement score must be above 70 to trigger upsell suggestions.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Revenue ───────────────────────────────────────────────────────────

function RevenueTab({ profile }: { profile: AIBrainOutput }) {
  const { revenue } = profile;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <MiniStat
          label="Est. Revenue Impact"
          value={`$${revenue.estimatedRevenueImpact}`}
        />
        <MiniStat
          label="Suggested Bundles"
          value={revenue.suggestedPriceBundles.length.toString()}
        />
      </div>

      {revenue.suggestedPriceBundles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {revenue.suggestedPriceBundles.map((b) => (
            <BundleCard key={b.bundleId} bundle={b} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white/2 rounded-xl border border-white/5">
          <p className="text-white/30 text-sm">No bundle suggestions for this user.</p>
        </div>
      )}

      {/* Product Performance for this user */}
      {revenue.productPerformance.length > 0 && (
        <div className="bg-[#0D1B2A] border border-white/10 rounded-xl p-5">
          <ProductPerformanceTable products={revenue.productPerformance} />
        </div>
      )}
    </div>
  );
}

// ─── Tab: Forecast ──────────────────────────────────────────────────────────

function ForecastTabContent({ profile }: { profile: AIBrainOutput }) {
  return (
    <div className="space-y-4">
      <div className="bg-[#0D1B2A] border border-white/10 rounded-xl p-5">
        <ForecastChart forecast={profile.revenue.forecast} />
      </div>
    </div>
  );
}

// ─── Tab: Campaigns ─────────────────────────────────────────────────────────

function CampaignsTabContent({ profile }: { profile: AIBrainOutput }) {
  const { campaigns, htmlEmails } = profile.content;
  return (
    <div className="space-y-6">
      {/* Active campaigns */}
      <div>
        <h4 className="text-xs uppercase tracking-wider text-white/30 font-semibold mb-3">
          Drip Sequences ({campaigns.length})
        </h4>
        <CampaignViewer campaigns={campaigns} />
      </div>

      {/* HTML email previews */}
      {htmlEmails.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-white/30 font-semibold mb-3">
            HTML Email Templates ({htmlEmails.length})
          </h4>
          <div className="space-y-3">
            {htmlEmails.map((email) => (
              <div
                key={email.id}
                className="bg-white/2 border border-white/5 rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-white">{email.subject}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    email.category === "retention" ? "text-red-400 bg-red-400/10" :
                    email.category === "upsell" ? "text-[#FFC857] bg-[#FFC857]/10" :
                    email.category === "milestone" ? "text-[#1CE7D0] bg-[#1CE7D0]/10" :
                    email.category === "reengagement" ? "text-purple-400 bg-purple-400/10" :
                    "text-white/40 bg-white/5"
                  }`}>
                    {email.category}
                  </span>
                </div>
                <p className="text-xs text-white/40">{email.preheader}</p>
                {email.scheduledFor && (
                  <p className="text-[10px] text-white/20">
                    Scheduled: {new Date(email.scheduledFor).toLocaleString()}
                  </p>
                )}
                {/* Plain text preview */}
                <div className="bg-white/2 rounded-lg p-3 mt-2">
                  <p className="text-[10px] text-white/20 uppercase tracking-wider mb-1">Preview</p>
                  <p className="text-xs text-white/50 whitespace-pre-line leading-relaxed">{email.plainText}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Achievements ──────────────────────────────────────────────────────

function AchievementsTabContent({ profile }: { profile: AIBrainOutput }) {
  const earned = profile.achievements.filter((a) => a.earnedAt);
  const locked = profile.achievements.filter((a) => !a.earnedAt);

  return (
    <div className="space-y-6">
      {/* Earned */}
      <div>
        <h4 className="text-xs uppercase tracking-wider text-white/30 font-semibold mb-3">
          Earned ({earned.length})
        </h4>
        {earned.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            {earned.map((a) => (
              <AchievementBadge key={a.id} achievement={a} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-white/30 italic">No achievements earned yet.</p>
        )}
      </div>

      {/* Locked / In Progress */}
      {locked.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-white/30 font-semibold mb-3">
            In Progress ({locked.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            {locked.map((a) => (
              <AchievementBadge key={a.id} achievement={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Content ───────────────────────────────────────────────────────────

function ContentTab({ profile }: { profile: AIBrainOutput }) {
  const { content } = profile;
  return (
    <div className="space-y-3">
      <p className="text-xs text-white/40">
        {content.messages.length} AI-generated message{content.messages.length !== 1 ? "s" : ""}
      </p>
      {content.messages.length > 0 ? (
        content.messages.map((msg) => (
          <MessagePreview key={msg.id} message={msg} />
        ))
      ) : (
        <div className="text-center py-12 bg-white/2 rounded-xl border border-white/5">
          <p className="text-white/30 text-sm">No messages generated for this user.</p>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Insights ──────────────────────────────────────────────────────────

function InsightsTab({ profile }: { profile: AIBrainOutput }) {
  const { adminInsights } = profile;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {adminInsights.insights.slice(0, 3).map((ins) => (
          <InsightCard key={ins.metric} insight={ins} />
        ))}
      </div>
      <div className="space-y-2">
        {adminInsights.recommendations.map((rec) => (
          <AIAdminRecommendationRow key={rec.id} rec={rec} />
        ))}
      </div>
    </div>
  );
}

// ─── Mini helpers ───────────────────────────────────────────────────────────

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-white/3 rounded-lg px-3 py-2">
      <p className="text-[10px] text-white/30 mb-0.5">{label}</p>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/3 rounded-lg px-3 py-2.5 flex-1">
      <p className="text-[10px] text-white/30 mb-0.5">{label}</p>
      <p className="text-sm font-bold text-white truncate">{value}</p>
    </div>
  );
}
