// ─── Admin Store (Zustand) ───────────────────────────────────────────────────
// Local UI state for the admin dashboard: active section, sidebar, search,
// modal/drawer visibility. Server data lives in React Query.
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";

export type AdminSection =
  | "overview"
  | "users"
  | "products"
  | "live-sessions"
  | "mentorship"
  | "payments"
  | "analytics"
  | "content"
  | "settings"
  | "ai-brain"
  | "tiktok-ops";

interface AdminStore {
  /** Currently active sidebar section */
  activeSection: AdminSection;
  setActiveSection: (s: AdminSection) => void;

  /** Product sub-tab: courses / pdfs */
  productTab: "courses" | "pdfs";
  setProductTab: (t: "courses" | "pdfs") => void;

  /** Mobile sidebar drawer open state */
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  toggleSidebar: () => void;

  /** Global search query */
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  /** Mock admin auth flag */
  isAdmin: boolean;
  setIsAdmin: (v: boolean) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  activeSection: "overview",
  setActiveSection: (s) => set({ activeSection: s, sidebarOpen: false }),

  productTab: "courses",
  setProductTab: (t) => set({ productTab: t }),

  sidebarOpen: false,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  toggleSidebar: () => set((prev) => ({ sidebarOpen: !prev.sidebarOpen })),

  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),

  // Default true while auth is mocked
  isAdmin: true,
  setIsAdmin: (v) => set({ isAdmin: v }),
}));
