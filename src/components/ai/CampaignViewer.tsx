"use client";
// ─── CampaignViewer ─────────────────────────────────────────────────────────
// Admin view of email campaigns / drip sequences. Shows trigger, steps,
// open/click rates, enrolled users.
// ─────────────────────────────────────────────────────────────────────────────

import type { EmailCampaign } from "@/types/aiBrain";
import { useState } from "react";

interface Props {
  campaigns: EmailCampaign[];
}

function triggerLabel(trigger: EmailCampaign["trigger"]): string {
  switch (trigger.type) {
    case "signup": return "User Signup";
    case "inactivity": return `${trigger.days}-Day Inactivity`;
    case "course_completion": return "Course Completion";
    case "purchase": return `Purchase (${trigger.itemType})`;
    case "milestone": return `Milestone: ${trigger.event}`;
    case "churn_risk": return `Churn Risk: ${trigger.riskLevel}`;
    default: return "Custom Trigger";
  }
}

function statusColor(status: EmailCampaign["status"]): string {
  if (status === "active") return "text-[#1CE7D0] bg-[#1CE7D0]/10 border-[#1CE7D0]/20";
  if (status === "paused") return "text-[#FFC857] bg-[#FFC857]/10 border-[#FFC857]/20";
  return "text-white/40 bg-white/[0.03] border-white/10";
}

export default function CampaignViewer({ campaigns }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12 text-white/30 text-sm">
        No active campaigns. Campaigns are generated based on user behavior patterns.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {campaigns.map((campaign) => (
        <div
          key={campaign.campaignId}
          className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden"
        >
          {/* Header */}
          <button
            onClick={() => setExpanded(expanded === campaign.campaignId ? null : campaign.campaignId)}
            className="w-full text-left p-4 flex items-center gap-3 hover:bg-white/[0.02] transition-colors"
          >
            {/* Status dot */}
            <span
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                campaign.status === "active"
                  ? "bg-[#1CE7D0]"
                  : campaign.status === "paused"
                  ? "bg-[#FFC857]"
                  : "bg-white/20"
              }`}
            />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{campaign.name}</p>
              <p className="text-[10px] text-white/40 mt-0.5">
                Trigger: {triggerLabel(campaign.trigger)} · {campaign.steps.length} steps
              </p>
            </div>

            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${statusColor(campaign.status)}`}>
              {campaign.status}
            </span>

            <div className="text-right flex-shrink-0">
              <p className="text-xs text-white/60">{campaign.enrolledUsers} enrolled</p>
              {campaign.completionRate > 0 && (
                <p className="text-[10px] text-[#1CE7D0]">{campaign.completionRate}% completed</p>
              )}
            </div>

            <svg
              className={`w-4 h-4 text-white/30 transition-transform ${expanded === campaign.campaignId ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Steps */}
          {expanded === campaign.campaignId && (
            <div className="border-t border-white/5 px-4 py-3 space-y-2">
              {campaign.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/[0.02]"
                >
                  <span className="w-6 h-6 rounded-full bg-[#FFC857]/10 text-[#FFC857] text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {step.stepNumber}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{step.subject}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">{step.summary}</p>
                  </div>
                  <div className="text-right flex-shrink-0 space-y-0.5">
                    <p className="text-[10px] text-white/40">
                      Day +{step.delayDays}
                    </p>
                    <p className="text-[10px]">
                      <span className="text-[#1CE7D0]">{step.openRate}% open</span>
                      {" · "}
                      <span className="text-[#FFC857]">{step.clickRate}% click</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
