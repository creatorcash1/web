"use client";
// ─── BrainHealthCard ────────────────────────────────────────────────────────
// Shows AI Brain system status, processing metrics, and API usage.
// ─────────────────────────────────────────────────────────────────────────────

import type { AIBrainHealth } from "@/types/aiBrain";

interface Props {
  health: AIBrainHealth;
}

const STATUS_STYLES = {
  operational: { dot: "bg-emerald-400", label: "Operational", text: "text-emerald-400" },
  degraded: { dot: "bg-amber-400 animate-pulse", label: "Degraded", text: "text-amber-400" },
  offline: { dot: "bg-red-400", label: "Offline", text: "text-red-400" },
};

export default function BrainHealthCard({ health }: Props) {
  const st = STATUS_STYLES[health.status];
  const apiUsagePercent = Math.round((health.apiCallsToday / health.apiCallsLimit) * 100);

  return (
    <div className="bg-[#0D1B2A] border border-white/10 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white font-(family-name:--font-montserrat)">
          🧠 Brain Health
        </h3>
        <span className={`flex items-center gap-1.5 text-xs font-semibold ${st.text}`}>
          <span className={`w-2 h-2 rounded-full ${st.dot}`} />
          {st.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Metric label="Users Analyzed" value={health.totalUsersAnalyzed.toString()} />
        <Metric label="Avg Processing" value={`${health.avgProcessingTimeMs}ms`} />
        <Metric label="Cache Hit Rate" value={`${health.cacheHitRate}%`} />
        <Metric label="API Usage" value={`${health.apiCallsToday} / ${health.apiCallsLimit}`} />
      </div>

      {/* API usage bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-[10px] text-white/30 mb-1">
          <span>API Quota</span>
          <span>{apiUsagePercent}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              apiUsagePercent > 80 ? "bg-red-400" : apiUsagePercent > 50 ? "bg-amber-400" : "bg-[#1CE7D0]"
            }`}
            style={{ width: `${apiUsagePercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/3 rounded-lg px-3 py-2">
      <p className="text-[10px] text-white/30 mb-0.5">{label}</p>
      <p className="text-sm font-bold text-white">{value}</p>
    </div>
  );
}
