"use client";
// ─── InsightCard ────────────────────────────────────────────────────────────
// Displays a single KPI insight with trend indicator.
// ─────────────────────────────────────────────────────────────────────────────

import type { InsightItem } from "@/types/aiBrain";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon } from "@heroicons/react/24/outline";

interface Props {
  insight: InsightItem;
}

export default function InsightCard({ insight }: Props) {
  const trendIcon = {
    up: <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-400" />,
    down: <ArrowTrendingDownIcon className="w-4 h-4 text-red-400" />,
    flat: <MinusIcon className="w-4 h-4 text-white/30" />,
  }[insight.trend];

  const trendColor = {
    up: "text-emerald-400",
    down: "text-red-400",
    flat: "text-white/30",
  }[insight.trend];

  return (
    <div className="bg-[#0D1B2A] border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors">
      <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1.5 font-medium">
        {insight.metric}
      </p>
      <div className="flex items-end justify-between">
        <p className="text-xl font-bold text-white font-(family-name:--font-montserrat)">
          {insight.formattedValue}
        </p>
        <div className="flex items-center gap-1">
          {trendIcon}
          <span className={`text-xs font-semibold ${trendColor}`}>
            {insight.changePercent > 0 ? "+" : ""}
            {insight.changePercent}%
          </span>
        </div>
      </div>
      <p className="text-[10px] text-white/20 mt-1">{insight.period}</p>
    </div>
  );
}
