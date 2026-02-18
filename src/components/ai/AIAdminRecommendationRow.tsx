"use client";
// ─── AIAdminRecommendationRow ───────────────────────────────────────────────
// Row for the admin recommendations table from the Admin Insight Reporter.
// ─────────────────────────────────────────────────────────────────────────────

import type { AdminRecommendation } from "@/types/aiBrain";

interface Props {
  rec: AdminRecommendation;
}

const IMPACT_COLORS = {
  low: "text-white/30 bg-white/5",
  medium: "text-amber-400 bg-amber-500/10",
  high: "text-emerald-400 bg-emerald-500/10",
};

const EFFORT_COLORS = {
  low: "text-emerald-400 bg-emerald-500/10",
  medium: "text-amber-400 bg-amber-500/10",
  high: "text-red-400 bg-red-500/10",
};

const CATEGORY_ICONS: Record<string, string> = {
  retention: "🛡️",
  pricing: "💰",
  engagement: "🔥",
  product: "📦",
  content: "✍️",
};

export default function AIAdminRecommendationRow({ rec }: Props) {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
      <div className="flex items-start gap-3">
        <span className="text-lg mt-0.5">{CATEGORY_ICONS[rec.category] ?? "💡"}</span>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-white">{rec.title}</h4>
          <p className="text-xs text-white/40 mt-1 leading-relaxed">{rec.description}</p>
          <div className="flex items-center gap-2 mt-2.5">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${IMPACT_COLORS[rec.impact]}`}>
              Impact: {rec.impact}
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${EFFORT_COLORS[rec.effort]}`}>
              Effort: {rec.effort}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
