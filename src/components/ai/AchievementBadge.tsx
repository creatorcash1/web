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
            ? "bg-[#FFC857]/10 border-[#FFC857]/30 text-[#FFC857]"
            : "bg-white/2 border-white/10 text-white/30"
        }`}
        title={achievement.description}
      >
        <span className="text-sm">{achievement.icon}</span>
        <span>{achievement.title}</span>
        {!isEarned && (
          <span className="text-[10px] text-white/20">{achievement.progress}%</span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col items-center p-4 rounded-xl border transition-all group ${
        isEarned
          ? "bg-[#FFC857]/5 border-[#FFC857]/20 hover:border-[#FFC857]/40 shadow-[0_0_16px_rgba(255,200,87,0.06)]"
          : "bg-white/2 border-white/5 hover:border-white/10"
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
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={3}
            fill="none"
          />
          <circle
            cx={radius + 4}
            cy={radius + 4}
            r={radius}
            stroke={isEarned ? "#FFC857" : "#1CE7D0"}
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
          isEarned ? "text-white" : "text-white/40"
        }`}
      >
        {achievement.title}
      </p>
      <p className="text-[10px] text-white/30 mt-0.5 text-center leading-tight">
        {achievement.description}
      </p>

      {/* Status */}
      {isEarned ? (
        <span className="mt-2 text-[10px] font-semibold text-[#FFC857] bg-[#FFC857]/10 px-2 py-0.5 rounded-full">
          Earned
        </span>
      ) : (
        <span className="mt-2 text-[10px] font-semibold text-white/20">
          {achievement.progress}%
        </span>
      )}
    </div>
  );
}
