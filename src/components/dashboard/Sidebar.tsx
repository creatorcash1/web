// ─── Sidebar ─────────────────────────────────────────────────────────────────
// Dashboard sidebar: desktop = fixed left column, mobile = slide-in drawer.
// Active section highlighted in gold, hover glow in teal.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import Link from "next/link";
import {
  HomeIcon,
  AcademicCapIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  useDashboardStore,
  type DashboardSection,
} from "@/stores/dashboardStore";

interface NavItem {
  key: DashboardSection;
  label: string;
  href: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const navItems: NavItem[] = [
  { key: "overview",    label: "Dashboard",     href: "/dashboard",             Icon: HomeIcon },
  { key: "courses",     label: "My Courses",    href: "/dashboard/courses",     Icon: AcademicCapIcon },
  { key: "live",        label: "Live Sessions", href: "/dashboard/live",        Icon: VideoCameraIcon },
  { key: "pdfs",        label: "My PDFs",       href: "/dashboard/pdfs",        Icon: DocumentTextIcon },
  { key: "mentorship",  label: "Mentorship",    href: "/dashboard/mentorship",  Icon: UserGroupIcon },
  { key: "payments",    label: "Payments",      href: "/dashboard/payments",    Icon: CreditCardIcon },
  { key: "settings",    label: "Settings",      href: "/dashboard/settings",    Icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const activeSection   = useDashboardStore((s) => s.activeSection);
  const setActive       = useDashboardStore((s) => s.setActiveSection);
  const sidebarOpen     = useDashboardStore((s) => s.sidebarOpen);
  const setSidebarOpen  = useDashboardStore((s) => s.setSidebarOpen);

  return (
    <>
      {/* ── Mobile overlay ────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar panel ─────────────────────────────── */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-[#0D1B2A] flex flex-col
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        aria-label="Dashboard sidebar"
      >
        {/* ── Header ──────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#FFC857] flex items-center justify-center">
              <span className="text-[#0D1B2A] font-black text-xs">CC</span>
            </span>
            <span className="text-white font-(family-name:--font-montserrat) font-extrabold text-sm leading-tight">
              Creator<span className="text-[#FFC857]">Cash</span>Cow
            </span>
          </Link>
          <button
            className="lg:hidden text-white/60 hover:text-white p-1"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* ── Nav items ───────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1" aria-label="Dashboard navigation">
          {navItems.map(({ key, label, href, Icon }) => {
            const active = activeSection === key;
            return (
              <Link
                key={key}
                href={href}
                onClick={() => setActive(key)}
                className={`
                  group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                  ${
                    active
                      ? "bg-[#FFC857]/15 text-[#FFC857] shadow-[inset_0_0_0_1px_rgba(255,200,87,0.25)]"
                      : "text-white/60 hover:bg-[#1CE7D0]/10 hover:text-[#1CE7D0] hover:shadow-[0_0_12px_rgba(28,231,208,0.08)]"
                  }
                `}
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors duration-200
                    ${active ? "text-[#FFC857]" : "text-white/40 group-hover:text-[#1CE7D0]"}`}
                  aria-hidden="true"
                />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* ── Bottom user badge ───────────────────────── */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1CE7D0]/20 flex items-center justify-center text-[#1CE7D0] text-xs font-bold">
              JM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">Jordan M.</p>
              <p className="text-white/40 text-xs truncate">Pro Member</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
