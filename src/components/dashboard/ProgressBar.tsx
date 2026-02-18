// ─── ProgressBar ─────────────────────────────────────────────────────────────
// Animated teal fill bar with gray track. Width transitions via CSS.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState } from "react";

interface ProgressBarProps {
  /** 0 – 100 */
  percentage: number;
  /** Override fill colour */
  color?: string;
  /** Height: "sm" | "md" — defaults to "md" */
  size?: "sm" | "md";
}

export default function ProgressBar({
  percentage,
  color = "#1CE7D0",
  size = "md",
}: ProgressBarProps) {
  // Animate from 0 to target width on mount
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setWidth(Math.min(100, Math.max(0, percentage))));
    return () => cancelAnimationFrame(id);
  }, [percentage]);

  const h = size === "sm" ? "h-1.5" : "h-2.5";

  return (
    <div
      className={`w-full ${h} rounded-full bg-[#E5E5E5] overflow-hidden`}
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${percentage}% complete`}
    >
      <div
        className={`${h} rounded-full transition-all duration-700 ease-out`}
        style={{ width: `${width}%`, backgroundColor: color }}
      />
    </div>
  );
}
