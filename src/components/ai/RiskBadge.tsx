"use client";
// ─── RiskBadge ──────────────────────────────────────────────────────────────
// Color-coded badge showing churn risk level.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  level: "low" | "medium" | "high";
  score?: number;
  compact?: boolean;
}

const COLOR_MAP = {
  low: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
  medium: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
  high: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
};

export default function RiskBadge({ level, score, compact = false }: Props) {
  const colors = COLOR_MAP[level];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${colors.bg} ${colors.text} ${
        compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {level.charAt(0).toUpperCase() + level.slice(1)} Risk
      {score !== undefined && !compact && (
        <span className="text-white/30 ml-1">({score})</span>
      )}
    </span>
  );
}
