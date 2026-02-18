"use client";
// ─── AIAlertBanner ──────────────────────────────────────────────────────────
// Dismissible alert banner for the admin AI Brain section.
// ─────────────────────────────────────────────────────────────────────────────

import type { AdminAlert } from "@/types/aiBrain";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Props {
  alert: AdminAlert;
  onDismiss: () => void;
  onAction?: () => void;
}

const SEVERITY_STYLES = {
  info: {
    bg: "bg-[#1CE7D0]/5 border-[#1CE7D0]/20",
    icon: "text-[#1CE7D0]",
    dot: "bg-[#1CE7D0]",
  },
  warning: {
    bg: "bg-amber-500/5 border-amber-500/20",
    icon: "text-amber-400",
    dot: "bg-amber-400",
  },
  critical: {
    bg: "bg-red-500/5 border-red-500/20",
    icon: "text-red-400",
    dot: "bg-red-400 animate-pulse",
  },
};

export default function AIAlertBanner({ alert, onDismiss, onAction }: Props) {
  const s = SEVERITY_STYLES[alert.severity];

  return (
    <div className={`rounded-xl border p-4 ${s.bg} flex items-start gap-3`}>
      <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />

      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-bold ${s.icon}`}>{alert.title}</h4>
        <p className="text-white/50 text-xs mt-0.5 leading-relaxed">
          {alert.description}
        </p>
        {alert.actionLabel && (
          <button
            onClick={onAction}
            className="mt-2 text-xs font-semibold text-[#FFC857] hover:underline"
          >
            {alert.actionLabel} →
          </button>
        )}
      </div>

      <button
        onClick={onDismiss}
        className="text-white/20 hover:text-white/50 transition-colors flex-shrink-0"
        aria-label="Dismiss alert"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
