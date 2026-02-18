// ─── AI Brain Store (Zustand) ────────────────────────────────────────────────
// UI state for the AI Brain admin section: selected user profile, active agent
// tab, dismissed alerts, and user-facing upsell dismissal.
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";

export type AIAgentTab =
  | "overview"
  | "behavior"
  | "churn"
  | "upsell"
  | "revenue"
  | "content"
  | "insights"
  | "forecast"
  | "campaigns"
  | "achievements";

interface AIBrainStore {
  /** ID of the user being inspected in the admin AI Brain section */
  selectedUserId: string | null;
  setSelectedUserId: (id: string | null) => void;

  /** Active sub-tab within the AI Brain section */
  activeAgentTab: AIAgentTab;
  setActiveAgentTab: (tab: AIAgentTab) => void;

  /** Set of dismissed admin alert IDs */
  dismissedAlerts: Set<string>;
  dismissAlert: (id: string) => void;
  resetAlerts: () => void;

  /** User-facing: has the upsell banner been dismissed this session? */
  upsellDismissed: boolean;
  setUpsellDismissed: (v: boolean) => void;

  /** User-facing: has the AI notification panel been opened? */
  notificationPanelOpen: boolean;
  setNotificationPanelOpen: (v: boolean) => void;
  toggleNotificationPanel: () => void;
}

export const useAIBrainStore = create<AIBrainStore>((set) => ({
  selectedUserId: null,
  setSelectedUserId: (id) => set({ selectedUserId: id }),

  activeAgentTab: "overview",
  setActiveAgentTab: (tab) => set({ activeAgentTab: tab }),

  dismissedAlerts: new Set<string>(),
  dismissAlert: (id) =>
    set((state) => {
      const next = new Set(state.dismissedAlerts);
      next.add(id);
      return { dismissedAlerts: next };
    }),
  resetAlerts: () => set({ dismissedAlerts: new Set<string>() }),

  upsellDismissed: false,
  setUpsellDismissed: (v) => set({ upsellDismissed: v }),

  notificationPanelOpen: false,
  setNotificationPanelOpen: (v) => set({ notificationPanelOpen: v }),
  toggleNotificationPanel: () =>
    set((s) => ({ notificationPanelOpen: !s.notificationPanelOpen })),
}));
