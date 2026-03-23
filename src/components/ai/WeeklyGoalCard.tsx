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
    <div className="rounded-xl bg-white/3 border border-white/5 p-5 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-base">🎯</span>
        <h4 className="text-sm font-bold text-white">Weekly Goal</h4>
        <span className="ml-auto text-xs font-semibold text-white/60">
          {data.completedLessons}/{data.targetLessons} lessons
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${progressWidth}%`,
            background:
              progressWidth >= 100
                ? "linear-gradient(to right, #FFC857, #1CE7D0)"
                : progressWidth >= 50
                ? "linear-gradient(to right, #FFC857, #FFC857)"
                : "linear-gradient(to right, #1CE7D0, #1CE7D0)",
          }}
        />
      </div>

      {/* Motivation */}
      <p className="text-xs text-white/60 leading-relaxed">{data.motivationMessage}</p>

      {/* Percentage */}
      <p className="text-2xl font-bold text-center">
        <span className={progressWidth >= 100 ? "text-[#1CE7D0]" : "text-[#FFC857]"}>
          {data.percentComplete}%
        </span>
      </p>
    </div>
  );
}
