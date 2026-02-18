"use client";
// ─── MessagePreview ─────────────────────────────────────────────────────────
// Preview an AI-generated message (email/notification/banner/popup).
// ─────────────────────────────────────────────────────────────────────────────

import type { AIMessage } from "@/types/aiBrain";

interface Props {
  message: AIMessage;
  compact?: boolean;
  onAction?: (message: AIMessage) => void;
}

const TYPE_ICON: Record<string, string> = {
  email: "✉️",
  notification: "🔔",
  banner: "🏷️",
  popup: "💬",
  sms: "📱",
};

const TONE_COLORS: Record<string, string> = {
  encouraging: "border-emerald-500/20",
  urgent: "border-red-500/20",
  celebratory: "border-[#FFC857]/20",
  educational: "border-[#1CE7D0]/20",
};

export default function MessagePreview({ message, compact = false, onAction }: Props) {
  return (
    <div
      className={`bg-white/[0.03] border rounded-xl ${TONE_COLORS[message.tone] || "border-white/10"} ${
        compact ? "p-3" : "p-4"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm">{TYPE_ICON[message.type] ?? "📝"}</span>
        <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">
          {message.type}
        </span>
        <span className="ml-auto text-[10px] text-white/20 capitalize">{message.tone}</span>
      </div>

      {/* Subject */}
      {message.subject && (
        <p className="text-xs font-bold text-white mb-1">{message.subject}</p>
      )}

      {/* Content */}
      <p className={`text-white/60 leading-relaxed ${compact ? "text-[11px] line-clamp-2" : "text-xs"}`}>
        {message.content}
      </p>

      {/* CTA */}
      {message.cta && (
        <button
          onClick={() => {
            if (onAction) {
              onAction(message);
              return;
            }
            if (message.ctaUrl) {
              window.location.href = message.ctaUrl;
            }
          }}
          className="mt-3 text-xs font-bold text-[#FFC857] hover:underline"
        >
          {message.cta} →
        </button>
      )}
    </div>
  );
}
