"use client";
// ─── Admin Sidebar ──────────────────────────────────────────────────────────
// 9-section navigation with gold active state, teal hover glow, mobile drawer.
// ─────────────────────────────────────────────────────────────────────────────

import {
  ChartBarIcon,
  UsersIcon,
  CubeIcon,
  VideoCameraIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  ChartPieIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  XMarkIcon,
  CpuChipIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/outline";
import { useAdminStore, type AdminSection } from "@/stores/adminStore";

const NAV_ITEMS: { key: AdminSection; label: string; Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }[] = [
  { key: "overview", label: "Overview", Icon: ChartBarIcon },
  { key: "users", label: "Users", Icon: UsersIcon },
  { key: "products", label: "Products", Icon: CubeIcon },
  { key: "live-sessions", label: "Live Sessions", Icon: VideoCameraIcon },
  { key: "mentorship", label: "Mentorship", Icon: CalendarDaysIcon },
  { key: "payments", label: "Payments", Icon: CreditCardIcon },
  { key: "analytics", label: "Analytics", Icon: ChartPieIcon },
  { key: "tiktok-ops", label: "TikTok Ops", Icon: MegaphoneIcon },
  { key: "content", label: "Content", Icon: DocumentTextIcon },
  { key: "ai-brain", label: "AI Brain", Icon: CpuChipIcon },
  { key: "settings", label: "Settings", Icon: Cog6ToothIcon },
];

export default function AdminSidebar() {
  const activeSection = useAdminStore((s) => s.activeSection);
  const setActiveSection = useAdminStore((s) => s.setActiveSection);
  const sidebarOpen = useAdminStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAdminStore((s) => s.setSidebarOpen);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-[#0D1B2A] border-r border-white/5
          flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white font-(family-name:--font-montserrat)">
              Admin Panel
            </h2>
            <p className="text-xs text-[#FFC857] mt-0.5">CreatorCashCow</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/60 hover:text-white"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ key, label, Icon }) => {
            const active = activeSection === key;
            return (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200 group
                  ${
                    active
                      ? "bg-[#FFC857]/10 text-[#FFC857] shadow-[inset_0_0_0_1px_rgba(255,200,87,0.2)]"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    active ? "text-[#FFC857]" : "text-white/40 group-hover:text-[#1CE7D0]"
                  }`}
                />
                {label}
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FFC857]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-xs text-white/30">v1.0.0 — Admin</p>
        </div>
      </aside>
    </>
  );
}
