// ─── DashboardCountdown ──────────────────────────────────────────────────────
// Hydration-safe countdown for the dashboard live-sessions section.
// Renders placeholder on SSR, then starts ticking after mount.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState } from "react";

interface Props {
  targetDate: string; // ISO
  compact?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calc(target: string): TimeLeft {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function DashboardCountdown({ targetDate, compact }: Props) {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTime(calc(targetDate));
    const id = setInterval(() => setTime(calc(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const cells = time
    ? [
        { label: "D", value: pad(time.days) },
        { label: "H", value: pad(time.hours) },
        { label: "M", value: pad(time.minutes) },
        { label: "S", value: pad(time.seconds) },
      ]
    : [
        { label: "D", value: "--" },
        { label: "H", value: "--" },
        { label: "M", value: "--" },
        { label: "S", value: "--" },
      ];

  if (compact) {
    return (
      <span className="tabular-nums text-sm font-bold text-[#FFC857]" aria-live="polite" aria-label="Countdown timer">
        {cells.map((c) => c.value).join(":")}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2" aria-live="polite" aria-label="Countdown timer">
      {cells.map((c, i) => (
        <div key={c.label} className="flex items-center gap-2">
          <div className="bg-[#0D1B2A] rounded-lg px-3 py-2 text-center min-w-[46px]">
            <div className="text-lg font-black text-[#FFC857] tabular-nums leading-none">
              {c.value}
            </div>
            <div className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">
              {c.label}
            </div>
          </div>
          {i < cells.length - 1 && (
            <span className="text-[#FFC857] font-bold text-sm select-none">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
