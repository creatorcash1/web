// ─── CountdownTimer ──────────────────────────────────────────────────────────
// Live countdown to a target date. Cells show Days / Hours / Minutes / Seconds.
// Uses local state updated every second via setInterval.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  /** ISO date string, e.g. "2026-03-01T23:59:59" */
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(targetDate: string): TimeLeft {
  const diff = Math.max(0, new Date(targetDate).getTime() - Date.now());
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTime(calcTimeLeft(targetDate));
    const id = setInterval(() => setTime(calcTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const cells = [
    { label: "Days",    value: time ? pad(time.days) : "--" },
    { label: "Hours",   value: time ? pad(time.hours) : "--" },
    { label: "Minutes", value: time ? pad(time.minutes) : "--" },
    { label: "Seconds", value: time ? pad(time.seconds) : "--" },
  ];

  return (
    <div className="flex items-center gap-3 flex-wrap justify-center" aria-live="polite" aria-label="Countdown timer">
      {cells.map((c, i) => (
        <div key={c.label} className="flex items-center gap-3">
          <div className="countdown-cell">
            <div className="text-3xl font-black text-[#FFC857] tabular-nums leading-none">
              {c.value}
            </div>
            <div className="text-xs text-white/60 uppercase tracking-widest mt-1">
              {c.label}
            </div>
          </div>
          {i < cells.length - 1 && (
            <span className="text-[#FFC857] text-2xl font-black -mt-2 select-none">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
