"use client";
// ─── ProgressSummaryCard ────────────────────────────────────────────────────
// User progress summary with stats, streak, percentile rank, and milestone.
// ─────────────────────────────────────────────────────────────────────────────

import type { ProgressSummaryWidget } from "@/types/aiBrain";

interface Props {
  data: ProgressSummaryWidget;
}

export default function ProgressSummaryCard({ data }: Props) {
  return (
    <div className="rounded-2xl bg-white border border-[#0D1B2A]/10 p-5 space-y-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-base">📊</span>
        <h4 className="text-sm font-bold text-[#0D1B2A]">Your Progress</h4>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#F7F8FA] rounded-xl p-3">
          <p className="text-2xl font-bold text-[#0D1B2A]">{data.totalCompleted}</p>
          <p className="text-xs text-[#0D1B2A]/60">of {data.totalCoursesEnrolled} courses completed</p>
        </div>
        <div className="bg-[#F7F8FA] rounded-xl p-3">
          <p className="text-2xl font-bold text-[#F59E0B]">{data.currentStreak}</p>
          <p className="text-xs text-[#0D1B2A]/60">day streak 🔥</p>
        </div>
        <div className="bg-[#F7F8FA] rounded-xl p-3">
          <p className="text-2xl font-bold text-[#0D9488]">Top {data.percentileRank}%</p>
          <p className="text-xs text-[#0D1B2A]/60">of all creators</p>
        </div>
        <div className="bg-[#F7F8FA] rounded-xl p-3">
          {/* Progress ring */}
          <p className="text-2xl font-bold text-[#0D1B2A]">
            {data.totalCoursesEnrolled > 0
              ? Math.round((data.totalCompleted / data.totalCoursesEnrolled) * 100)
              : 0}
            %
          </p>
          <p className="text-xs text-[#0D1B2A]/60">completion rate</p>
        </div>
      </div>

      {/* Nearest milestone */}
      <div className="flex items-center gap-2 bg-gradient-to-r from-[#FFC857]/15 to-[#FFC857]/5 rounded-xl px-4 py-3 border border-[#FFC857]/20">
        <span className="text-sm">🎯</span>
        <p className="text-sm text-[#0D1B2A]">
          <span className="font-semibold text-[#D97706]">Next milestone:</span>{" "}
          {data.nearestMilestone}
        </p>
      </div>
    </div>
  );
}
