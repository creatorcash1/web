// ─── Dashboard Store (Zustand) ───────────────────────────────────────────────
// Minimal local UI state: active sidebar section, sidebar drawer visibility,
// and mock auth. Server state lives in React Query, not here.
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";

export type DashboardSection =
  | "overview"
  | "courses"
  | "live"
  | "pdfs"
  | "mentorship"
  | "payments"
  | "settings";

interface DashboardStore {
  /** Currently active sidebar section */
  activeSection: DashboardSection;
  setActiveSection: (s: DashboardSection) => void;

  /** Mobile sidebar drawer open state */
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  toggleSidebar: () => void;

  /** Mock authentication flag (swap with real auth later) */
  isAuthenticated: boolean;
  setAuthenticated: (v: boolean) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  activeSection: "overview",
  setActiveSection: (s) => set({ activeSection: s, sidebarOpen: false }),

  sidebarOpen: false,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  toggleSidebar: () => set((prev) => ({ sidebarOpen: !prev.sidebarOpen })),

  // Default true so the dashboard renders while auth is mocked
  isAuthenticated: true,
  setAuthenticated: (v) => set({ isAuthenticated: v }),
}));
