"use client";
// ─── AchievementBadge ───────────────────────────────────────────────────────
// Individual achievement badge with earned/locked states and progress ring.
// ─────────────────────────────────────────────────────────────────────────────

import type { Achievement } from "@/types/aiBrain";

interface Props {
  achievement: Achievement;
  compact?: boolean;
}

export default function AchievementBadge({ achievement, compact = false }: Props) {
  const isEarned = achievement.earnedAt !== null;
  const radius = compact ? 18 : 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (achievement.progress / 100) * circumference;

  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
          isEarned
            ? "bg-[#FFC857]/15 border-[#FFC857]/40 text-[#B45309]"
            : "bg-[#0D1B2A]/5 border-[#0D1B2A]/15 text-[#0D1B2A]/50"
        }`}
        title={achievement.description}
      >
        <span className="text-sm">{achievement.icon}</span>
        <span>{achievement.title}</span>
        {!isEarned && (
          <span className="text-[10px] text-[#0D1B2A]/40">{achievement.progress}%</span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col items-center p-4 rounded-xl border transition-all group ${
        isEarned
          ? "bg-[#FFC857]/10 border-[#FFC857]/30 hover:border-[#FFC857]/50 shadow-sm"
          : "bg-white border-[#0D1B2A]/10 hover:border-[#0D1B2A]/20"
      }`}
    >
      {/* Progress ring */}
      <div className="relative">
        <svg
          width={(radius + 4) * 2}
          height={(radius + 4) * 2}
          className="transform -rotate-90"
        >
          <circle
            cx={radius + 4}
            cy={radius + 4}
            r={radius}
            stroke="rgba(13,27,42,0.1)"
            strokeWidth={3}
            fill="none"
          />
          <circle
            cx={radius + 4}
            cy={radius + 4}
            r={radius}
            stroke={isEarned ? "#D97706" : "#0D9488"}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl">
          {achievement.icon}
        </span>
      </div>

      {/* Info */}
      <p
        className={`text-xs font-bold mt-2 text-center ${
          isEarned ? "text-[#0D1B2A]" : "text-[#0D1B2A]/50"
        }`}
      >
        {achievement.title}
      </p>
      <p className="text-[10px] text-[#0D1B2A]/50 mt-0.5 text-center leading-tight">
        {achievement.description}
      </p>

      {/* Status */}
      {isEarned ? (
        <span className="mt-2 text-[10px] font-semibold text-[#B45309] bg-[#FFC857]/20 px-2 py-0.5 rounded-full">
          Earned
        </span>
      ) : (
        <span className="mt-2 text-[10px] font-semibold text-[#0D1B2A]/40">
          {achievement.progress}%
        </span>
      )}
    </div>
  );
}
