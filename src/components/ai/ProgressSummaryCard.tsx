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
    <div className="rounded-xl bg-white/[0.03] border border-white/5 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-base">📊</span>
        <h4 className="text-sm font-bold text-white">Your Progress</h4>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/[0.03] rounded-lg p-3">
          <p className="text-2xl font-bold text-white">{data.totalCompleted}</p>
          <p className="text-[10px] text-white/40">of {data.totalCoursesEnrolled} courses completed</p>
        </div>
        <div className="bg-white/[0.03] rounded-lg p-3">
          <p className="text-2xl font-bold text-[#FFC857]">{data.currentStreak}</p>
          <p className="text-[10px] text-white/40">day streak 🔥</p>
        </div>
        <div className="bg-white/[0.03] rounded-lg p-3">
          <p className="text-2xl font-bold text-[#1CE7D0]">Top {data.percentileRank}%</p>
          <p className="text-[10px] text-white/40">of all creators</p>
        </div>
        <div className="bg-white/[0.03] rounded-lg p-3">
          {/* Progress ring */}
          <p className="text-2xl font-bold text-white">
            {data.totalCoursesEnrolled > 0
              ? Math.round((data.totalCompleted / data.totalCoursesEnrolled) * 100)
              : 0}
            %
          </p>
          <p className="text-[10px] text-white/40">completion rate</p>
        </div>
      </div>

      {/* Nearest milestone */}
      <div className="flex items-center gap-2 bg-[#FFC857]/5 rounded-lg px-3 py-2 border border-[#FFC857]/10">
        <span className="text-sm">🎯</span>
        <p className="text-xs text-white/80">
          <span className="font-semibold text-[#FFC857]">Next milestone:</span>{" "}
          {data.nearestMilestone}
        </p>
      </div>
    </div>
  );
}
