"use client";
// ─── UserProfileCard ────────────────────────────────────────────────────────
// Compact card for the admin AI Brain user list — shows user + key AI metrics.
// ─────────────────────────────────────────────────────────────────────────────

import type { AIBrainOutput } from "@/types/aiBrain";
import EngagementGauge from "./EngagementGauge";
import RiskBadge from "./RiskBadge";

interface Props {
  output: AIBrainOutput;
  isSelected: boolean;
  onSelect: () => void;
}

export default function UserProfileCard({ output, isSelected, onSelect }: Props) {
  const { behavior, churn, upsell, fullName } = output;
  const userName = fullName;

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
        isSelected
          ? "bg-[#FFC857]/5 border-[#FFC857]/30 shadow-[0_0_20px_rgba(255,200,87,0.05)]"
          : "bg-white/[0.02] border-white/5 hover:border-white/15"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Engagement gauge — small */}
        <EngagementGauge score={behavior.engagementScore} size="sm" showLabel={false} />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{userName}</p>
          <p className="text-[10px] text-white/30 mt-0.5">
            {behavior.activityLevel} · {behavior.courseCompletionRate}% completion
          </p>
          <div className="mt-1.5 flex items-center gap-2 flex-wrap">
            <RiskBadge level={churn.riskLevel} compact />
            {upsell.recommendedProducts.length > 0 && (
              <span className="text-[10px] text-[#1CE7D0]/80 bg-[#1CE7D0]/10 px-2 py-0.5 rounded-full font-semibold">
                {upsell.recommendedProducts.length} upsell
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
