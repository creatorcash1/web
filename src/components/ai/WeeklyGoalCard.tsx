"use client";
// ─── WeeklyGoalCard ─────────────────────────────────────────────────────────
// Displays weekly learning goal progress with motivational messaging.
// ─────────────────────────────────────────────────────────────────────────────

import type { WeeklyGoalWidget } from "@/types/aiBrain";

interface Props {
  data: WeeklyGoalWidget;
}

export default function WeeklyGoalCard({ data }: Props) {
  const progressWidth = Math.min(100, data.percentComplete);

  return (
    <div className="rounded-2xl bg-white border border-[#0D1B2A]/10 p-5 space-y-3 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-base">🎯</span>
        <h4 className="text-sm font-bold text-[#0D1B2A]">Weekly Goal</h4>
        <span className="ml-auto text-xs font-semibold text-[#0D1B2A]/70">
          {data.completedLessons}/{data.targetLessons} lessons
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-[#0D1B2A]/10 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${progressWidth}%`,
            background:
              progressWidth >= 100
                ? "linear-gradient(to right, #FFC857, #0D9488)"
                : progressWidth >= 50
                ? "linear-gradient(to right, #FFC857, #F59E0B)"
                : "linear-gradient(to right, #0D9488, #14B8A6)",
          }}
        />
      </div>

      {/* Motivation */}
      <p className="text-sm text-[#0D1B2A]/70 leading-relaxed">{data.motivationMessage}</p>

      {/* Percentage */}
      <p className="text-2xl font-bold text-center">
        <span className={progressWidth >= 100 ? "text-[#0D9488]" : "text-[#D97706]"}>
          {data.percentComplete}%
        </span>
      </p>
    </div>
  );
}
