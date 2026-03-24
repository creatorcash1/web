"use client";
// ─── LiveSessionCountdown ───────────────────────────────────────────────────
// Countdown to next live session for user dashboard widget.
// ─────────────────────────────────────────────────────────────────────────────

import type { LiveSessionWidget } from "@/types/aiBrain";
import { useState, useEffect } from "react";

interface Props {
  data: LiveSessionWidget;
  onAction?: () => void;
}

export default function LiveSessionCountdown({ data, onAction }: Props) {
  const [hoursLeft, setHoursLeft] = useState(data.hoursUntil);

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.max(0, Math.round((new Date(data.scheduledDate).getTime() - Date.now()) / 3600000));
      setHoursLeft(diff);
    }, 60000);
    return () => clearInterval(interval);
  }, [data.scheduledDate]);

  const days = Math.floor(hoursLeft / 24);
  const hours = hoursLeft % 24;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#0D1B2A] to-[#134E4A] border border-[#0D1B2A]/20 p-5 space-y-3 shadow-lg">
      <div className="flex items-center gap-2">
        <span className="text-base">🎬</span>
        <h4 className="text-sm font-bold text-white">Next Live Session</h4>
      </div>

      <p className="text-base font-semibold text-white">{data.title}</p>

      {/* Countdown */}
      <div className="flex gap-3 justify-center">
        {days > 0 && (
          <div className="text-center">
            <p className="text-2xl font-bold text-[#FFC857]">{days}</p>
            <p className="text-xs text-white/70">days</p>
          </div>
        )}
        <div className="text-center">
          <p className="text-2xl font-bold text-[#FFC857]">{hours}</p>
          <p className="text-xs text-white/70">hours</p>
        </div>
      </div>

      <p className="text-xs text-white/60 text-center">
        {new Date(data.scheduledDate).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })}
      </p>

      <button
        onClick={() => {
          if (onAction) {
            onAction();
            return;
          }
          window.location.href = `/live/${data.sessionId}`;
        }}
        className="w-full bg-[#14B8A6] text-white text-xs font-bold py-2.5 rounded-xl hover:bg-[#0D9488] transition-colors"
      >
        Set Reminder
      </button>
    </div>
  );
}
