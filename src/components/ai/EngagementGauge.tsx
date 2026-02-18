"use client";
// ─── EngagementGauge ─────────────────────────────────────────────────────────
// Visual circular gauge showing 0-100 engagement score with color coding.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

function getColor(score: number): string {
  if (score >= 85) return "#1CE7D0"; // teal — power user
  if (score >= 70) return "#22C55E"; // green — high
  if (score >= 45) return "#FFC857"; // gold — moderate
  if (score >= 20) return "#F97316"; // orange — low
  return "#EF4444"; // red — inactive
}

function getLabel(score: number): string {
  if (score >= 85) return "Power User";
  if (score >= 70) return "High";
  if (score >= 45) return "Moderate";
  if (score >= 20) return "Low";
  return "Inactive";
}

export default function EngagementGauge({ score, size = "md", showLabel = true }: Props) {
  const color = getColor(score);
  const label = getLabel(score);

  const dims = { sm: 72, md: 96, lg: 128 }[size];
  const strokeWidth = { sm: 6, md: 8, lg: 10 }[size];
  const radius = (dims - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;
  const fontSize = { sm: "text-base", md: "text-xl", lg: "text-3xl" }[size];

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: dims, height: dims }}>
        <svg width={dims} height={dims} className="-rotate-90">
          {/* Background track */}
          <circle
            cx={dims / 2}
            cy={dims / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
          />
          {/* Score arc */}
          <circle
            cx={dims / 2}
            cy={dims / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-700 ease-in-out"
          />
        </svg>
        {/* Center number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${fontSize}`} style={{ color }}>
            {score}
          </span>
        </div>
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-white/50">{label}</span>
      )}
    </div>
  );
}
