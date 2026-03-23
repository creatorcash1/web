"use client";
// ─── AINotificationPanel ────────────────────────────────────────────────────
// Slide-out panel on the user dashboard showing AI-generated messages.
// Triggered by a bell icon in the header area.
// ─────────────────────────────────────────────────────────────────────────────

import type { AIMessage } from "@/types/aiBrain";
import { useQuery } from "@tanstack/react-query";
import { XMarkIcon } from "@heroicons/react/24/outline";
import MessagePreview from "@/components/ai/MessagePreview";
import { fetchDashboardData } from "@/services/dashboard";
import { useCTA } from "@/lib/useCTA";
import type { CTAResourceType } from "@/types/wiring";

interface Props {
  messages: AIMessage[];
  isOpen: boolean;
  onClose: () => void;
}

export default function AINotificationPanel({ messages, isOpen, onClose }: Props) {
  const { data: dashboard } = useQuery({
    queryKey: ["dashboard-data", "usr_001"],
    queryFn: () => fetchDashboardData("usr_001"),
    staleTime: 5 * 60 * 1000,
  });

  const { handleCTA } = useCTA({
    location: "ai_notification_panel",
    user: {
      userId: dashboard?.user.id ?? "usr_001",
      isAuthenticated: true,
      role: "user",
      enrolledCourseIds: dashboard?.courses.map((c) => c.id) ?? [],
      purchasedPdfIds: dashboard?.pdfs.map((p) => p.id) ?? [],
      mentorshipProductIds: (dashboard?.bookings.length ?? 0) > 0 ? ["mentorship-2hr"] : [],
    },
  });

  const inferResource = (url: string | null): { resourceType: CTAResourceType; resourceId?: string } => {
    if (!url) return { resourceType: "dashboard" };
    const normalized = url.toLowerCase();
    if (normalized.includes("/mentorship")) return { resourceType: "mentorship", resourceId: "mentorship-2hr" };
    if (normalized.includes("/pdf")) return { resourceType: "pdf" };
    if (normalized.includes("/live")) return { resourceType: "live" };
    if (normalized.includes("/course")) return { resourceType: "course" };
    return { resourceType: "dashboard" };
  };

  if (!isOpen) return null;

  // Filter out emails — those are scheduled, not shown as live notifications
  const notifications = messages.filter((m) => m.type !== "email");

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-[#0D1B2A] border-l border-white/10 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔔</span>
            <h3 className="text-sm font-bold text-white font-(family-name:--font-montserrat)">
              AI Notifications
            </h3>
            {notifications.length > 0 && (
              <span className="text-[10px] font-bold bg-[#FFC857]/20 text-[#FFC857] px-2 py-0.5 rounded-full">
                {notifications.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/60 transition-colors"
            aria-label="Close notifications"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length > 0 ? (
            notifications.map((msg) => (
              <MessagePreview
                key={msg.id}
                message={msg}
                compact
                onAction={(message) => {
                  const mapped = inferResource(message.ctaUrl);
                  handleCTA({
                    actionType: "navigate",
                    resourceType: mapped.resourceType,
                    resourceId: mapped.resourceId,
                    requiresAuth: true,
                    requiresPurchase: false,
                    analyticsEvent: "ai_notification_cta_clicked",
                    fallbackRoute: "/dashboard",
                  });
                  onClose();
                }}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <span className="text-3xl opacity-30">🔔</span>
              <p className="text-white/30 text-sm">No new notifications</p>
              <p className="text-white/15 text-xs">
                AI-powered recommendations will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
