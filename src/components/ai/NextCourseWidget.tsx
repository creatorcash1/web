"use client";
// ─── NextCourseWidget ───────────────────────────────────────────────────────
// AI-recommended next course card for the user dashboard.
// ─────────────────────────────────────────────────────────────────────────────

import type { NextCourseWidget as NextCourseData } from "@/types/aiBrain";

interface Props {
  data: NextCourseData;
  onAction?: () => void;
}

export default function NextCourseWidget({ data, onAction }: Props) {
  return (
    <div className="rounded-xl bg-linear-to-br from-[#1CE7D0]/5 to-[#FFC857]/5 border border-[#1CE7D0]/10 p-5 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-base">🎓</span>
        <h4 className="text-sm font-bold text-white">AI Recommends For You</h4>
        <span className="ml-auto text-[10px] font-semibold text-[#1CE7D0] bg-[#1CE7D0]/10 px-2 py-0.5 rounded-full">
          {data.matchScore}% match
        </span>
      </div>

      <div>
        <p className="text-base font-bold text-white">{data.title}</p>
        <p className="text-xs text-white/50 mt-1 leading-relaxed">{data.reason}</p>
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-lg font-bold text-[#FFC857]">${data.price}</p>
        <button
          onClick={() => {
            if (onAction) {
              onAction();
              return;
            }
            window.location.href = `/courses/${data.courseId}`;
          }}
          className="bg-[#FFC857] text-[#0D1B2A] text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#FFC857]/90 transition-colors"
        >
          Learn More
        </button>
      </div>
    </div>
  );
}
