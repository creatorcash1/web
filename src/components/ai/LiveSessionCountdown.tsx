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
    <div className="rounded-xl bg-linear-to-br from-[#0D1B2A] to-[#1CE7D0]/5 border border-[#1CE7D0]/10 p-5 space-y-3">
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
            <p className="text-[10px] text-white/40">days</p>
          </div>
        )}
        <div className="text-center">
          <p className="text-2xl font-bold text-[#FFC857]">{hours}</p>
          <p className="text-[10px] text-white/40">hours</p>
        </div>
      </div>

      <p className="text-[10px] text-white/30 text-center">
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
        className="w-full bg-[#1CE7D0] text-[#0D1B2A] text-xs font-bold py-2.5 rounded-lg hover:bg-[#1CE7D0]/90 transition-colors"
      >
        Set Reminder
      </button>
    </div>
  );
}
